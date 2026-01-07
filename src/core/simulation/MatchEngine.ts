import { v4 as uuidv4 } from 'uuid';
import type { Player } from "../domain/Player";
import type { MatchStats } from "../domain/Stats";
import type { GameTactics } from '../domain/Tactics';
import { type DraftResult } from './DraftEngine';
import { Champion, CHAMPIONS_DB } from '../domain/Champions';

export interface FullMatchResult {
    matchId: string;
    winner: 'BLUE' | 'RED';
    blueScore: number; 
    redScore: number;  
    duration: number;  
    log: string[];
    playerStats: MatchStats[];
    homeTeamId: string;
    awayTeamId: string;
}

const KILL_WEIGHTS = { 'TOP': 0.20, 'JUNGLE': 0.15, 'MID': 0.25, 'ADC': 0.35, 'SUPPORT': 0.05 };
const DEATH_WEIGHTS = { 'TOP': 0.15, 'JUNGLE': 0.25, 'MID': 0.15, 'ADC': 0.10, 'SUPPORT': 0.35 };
const ASSIST_PARTICIPATION_BASE = { 'TOP': 0.4, 'JUNGLE': 0.6, 'MID': 0.5, 'ADC': 0.4, 'SUPPORT': 0.8 };
const CS_DISTRIBUTION = { 'ADC': 1.15, 'MID': 1.0, 'TOP': 0.9, 'JUNGLE': 0.65, 'SUPPORT': 0.1 };

const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const distributeIntegerPool = (totalPool: number, players: Player[], weightsRef: Record<string, number>): number[] => {
    if (totalPool === 0 || players.length === 0) return players.map(() => 0);
    const rawWeights = players.map(p => weightsRef[p?.role || 'MID'] || 0.1);
    const weightSum = rawWeights.reduce((a, b) => a + b, 0) || 1;
    let distributed = rawWeights.map(w => Math.floor(totalPool * (w / weightSum)));
    let currentSum = distributed.reduce((a, b) => a + b, 0);
    let remainder = totalPool - currentSum;
    while (remainder > 0) {
        let randomPoint = Math.random() * weightSum;
        for(let i = 0; i < players.length; i++) {
            randomPoint -= rawWeights[i];
            if(randomPoint <= 0) { distributed[i]++; remainder--; break; }
        }
        if (randomPoint > 0 && remainder > 0) { distributed[0]++; remainder--; }
    }
    return distributed;
};

export const simulateMatch = (
    blueTeam: Player[], 
    redTeam: Player[], 
    day: number, 
    homeTeamId: string,
    awayTeamId: string,
    tactics?: GameTactics,
    draftResult?: DraftResult,
    forcedMatchId?: string
): FullMatchResult => {
    
    const matchId = forcedMatchId || uuidv4();
    const log: string[] = [];

    if (!draftResult) {
        console.error(`🚨 CRITICAL: Match ${matchId} running WITHOUT Draft Result!`);
    }
    
    let bluePower = 0;
    let redPower = 0;
    let aggressiveness = tactics?.style === 'AGGRESSIVE' ? 1.3 : (tactics?.style === 'DEFENSIVE' ? 0.7 : 1.0);

    for (let i = 0; i < 5; i++) {
        const pBlue = blueTeam[i]; const pRed = redTeam[i];
        if (!pBlue || !pRed) continue;
        const bLane = pBlue.attributes.laning + pBlue.attributes.mechanics + roll(-25, 25);
        const rLane = pRed.attributes.laning + pRed.attributes.mechanics + roll(-25, 25);
        if (bLane > rLane) bluePower += 10; else redPower += 10;
    }

    const getTeamTF = (team: Player[]) => team.reduce((acc, p) => acc + (p ? p.attributes.teamfight + p.attributes.macro : 0), 0);
    const totalBlue = bluePower + (getTeamTF(blueTeam) * 0.1) + roll(-50, 50);
    const totalRed = redPower + (getTeamTF(redTeam) * 0.1) + roll(-50, 50);
    const winner = totalBlue > totalRed ? 'BLUE' : 'RED';
    const duration = roll(22, 45);

    const baseKillsPerMin = roll(8, 14) / 10;
    const totalGameKills = Math.floor(duration * baseKillsPerMin * aggressiveness);
    const winnerShare = roll(60, 75) / 100;
    const winnerKillsTotal = Math.floor(totalGameKills * winnerShare);
    const loserKillsTotal = totalGameKills - winnerKillsTotal;
    const blueTotalKills = winner === 'BLUE' ? winnerKillsTotal : loserKillsTotal;
    const redTotalKills = winner === 'RED' ? winnerKillsTotal : loserKillsTotal;

    const blueKillsArray = distributeIntegerPool(blueTotalKills, blueTeam, KILL_WEIGHTS);
    const redKillsArray = distributeIntegerPool(redTotalKills, redTeam, KILL_WEIGHTS);
    const blueDeathsArray = distributeIntegerPool(redTotalKills, blueTeam, DEATH_WEIGHTS);
    const redDeathsArray = distributeIntegerPool(blueTotalKills, redTeam, DEATH_WEIGHTS);

    const playerStats: MatchStats[] = [];

    const generateFullPlayerStats = (
        player: Player, 
        myIndex: number,
        _teamPlayers: Player[],
        myKills: number, 
        myDeaths: number,
        teamKillsArray: number[], 
        isWinner: boolean
    ): MatchStats => {
        
        let champName = "Unknown";
        let champData: Champion | undefined;

        if (draftResult) {
            const pickId = draftResult.bluePicks.get(player.id) || draftResult.redPicks.get(player.id);
            
            if (pickId) {
                champData = CHAMPIONS_DB.find(c => c.id === pickId);
            }

            if (champData) {
                champName = champData.name;
            } else {
                champName = player.championPool[0]?.championName || "Minion";
                champData = CHAMPIONS_DB.find(c => c.name === champName);
            }
        } else {
            champName = player.championPool[0]?.championName || "Random";
            champData = CHAMPIONS_DB.find(c => c.name === champName);
        }

        const role = player.role || 'MID';

        let performanceMod = 1.0; 
        if (champData) {
            const isMainRole = champData.roles.includes(role as any);
            
            if (!isMainRole) performanceMod -= 0.20; 
            const masteryEntry = player.championPool.find(c => c.championName === champName);
            if (masteryEntry) performanceMod += (masteryEntry.masteryLevel / 1000); 
            else performanceMod -= 0.05;
        }

        let myAssists = 0;
        const participationRate = ASSIST_PARTICIPATION_BASE[role] + (roll(-10, 10)/100);
        teamKillsArray.forEach((teammateKills, idx) => {
            if (idx === myIndex) return; 
            for(let k=0; k < teammateKills; k++) {
                if (Math.random() < participationRate) myAssists++;
            }
        });

        const roleCsFactor = CS_DISTRIBUTION[role] || 1.0;
        let csPerMin = (player.attributes.farming / 10) * roleCsFactor;
        csPerMin += (isWinner ? 0.5 : -0.5) + (roll(-10, 10) / 10);
        csPerMin = Math.max(0, Math.min(13, csPerMin));
        const myCs = Math.floor(duration * csPerMin);

        let goldFromCs = myCs * 21;
        if (role === 'SUPPORT') goldFromCs += (duration * 250);

        const myGold = Math.floor(goldFromCs + (myKills * 300) + (myAssists * 150) + (isWinner ? 2500 : 1000) + (duration * 120));
        
        const damageRoleMod = role === 'SUPPORT' ? 0.6 : (role === 'ADC' || role === 'MID') ? 1.3 : 0.9;
        const myDmg = Math.floor(((myGold * damageRoleMod * (roll(90, 110)/100)) + roll(1000, 3000)) * performanceMod);

        const visionScore = role === 'SUPPORT' ? Math.floor(duration * 2.5) : Math.floor(duration * 0.8);
        
        // 1. Nota Base (Mais baixa para evitar inflação)
        let rating = 6.0; 

        // 2. Impacto de Mortes (Muito punitivo)
        // Suportes toleram mais mortes (sacrifício), Carries são punidos severamente.
        const deathPenalty = role === 'SUPPORT' ? 0.35 : 0.50;
        rating -= (myDeaths * deathPenalty);

        // 3. Impacto de Kills (Logarítmico - Diminishing Returns)
        // Evita que 20 kills dê +10 pontos direto.
        // Fórmula: log2(kills + 1) * peso
        if (myKills > 0) {
            const killWeight = (role === 'ADC' || role === 'MID') ? 0.5 : 0.4;
            rating += Math.log2(myKills + 1) * killWeight;
        }

        // 4. Impacto de Assists
        if (myAssists > 0) {
            const assistWeight = (role === 'SUPPORT' || role === 'JUNGLE') ? 0.35 : 0.15;
            rating += Math.log2(myAssists + 1) * assistWeight;
        }

        // 5. Farm (Exigente)
        if (role !== 'SUPPORT' && role !== 'JUNGLE') {
            const cspm = myCs / duration; 
            if (cspm >= 10.0) rating += 1.0;      // Perfeito (Chovy level)
            else if (cspm >= 8.5) rating += 0.5;  // Pro standard
            else if (cspm < 6.5) rating -= 0.5;   // Ruim
            else if (cspm < 5.0) rating -= 1.0;   // Horrível
        }

        // 6. Participação em Kills (KP%)
        const teamTotalKills = teamKillsArray.reduce((a,b) => a+b, 0);
        if (teamTotalKills > 2) { // Só avalia se teve jogo
            const kp = (myKills + myAssists) / teamTotalKills;
            if (kp > 0.80) rating += 0.5; // Está em todas
            else if (kp < 0.15 && role !== 'TOP') rating -= 0.5; // AFK farming
        }

        // 7. Eficiência de Dano (Só ganha ponto se carregar)
        if (role !== 'SUPPORT') {
            const dmgPerGold = myDmg / Math.max(1, myGold);
            if (dmgPerGold > 1.5) rating += 0.4; // Deu muito dano com o ouro que tinha
            else if (dmgPerGold < 0.6) rating -= 0.3; // Tem ouro mas não bate
        }

        // 8. Bônus/Malus de Resultado
        if (isWinner) rating += 0.3;
        else rating -= 0.2; // Perder dói

        // 9. Clamp Final (Limites Rígidos)
        // É quase impossível tirar 10. Precisa de KDA perfeito + Farm 10/min + Win.
        // Nota mínima 2.5 (Troll).
        rating = Math.max(2.5, Math.min(10.0, rating));

        // Arredonda para 1 casa decimal
        rating = parseFloat(rating.toFixed(1));

        return {
            matchId, playerId: player.id, day, opponentTeamId: winner === 'BLUE' ? awayTeamId : homeTeamId,
            result: isWinner ? 'WIN' : 'LOSS', championName: champName,
            kills: myKills, deaths: myDeaths, assists: myAssists,
            cs: myCs, gold: myGold, damage: myDmg, duration,
            visionScore,
            rating
        };
    };

    blueTeam.forEach((p, i) => {
        if(p) playerStats.push(generateFullPlayerStats(p, i, blueTeam, blueKillsArray[i], blueDeathsArray[i], blueKillsArray, winner === 'BLUE'));
    });
    redTeam.forEach((p, i) => {
        if(p) playerStats.push(generateFullPlayerStats(p, i, redTeam, redKillsArray[i], redDeathsArray[i], redKillsArray, winner === 'RED'));
    });

    return {
        matchId, winner, duration, log, playerStats, homeTeamId, awayTeamId,
        blueScore: blueTotalKills, redScore: redTotalKills
    };
}