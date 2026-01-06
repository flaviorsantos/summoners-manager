import { v4 as uuidv4 } from 'uuid';
import type { Player } from "../domain/Player";
import type { MatchStats } from "../domain/Stats";
import type { GameTactics } from '../domain/Tactics';
import { type DraftResult } from './DraftEngine';
import type { Champion } from '../domain/Champions';

export interface FullMatchResult {
    matchId: string;
    winner: 'BLUE' | 'RED';
    blueScore: number; 
    redScore: number;  
    duration: number;  
    log: string[];
    playerStats: Map<string, MatchStats>;
    homeTeamId: string;
    awayTeamId: string;
}

const KILL_WEIGHTS = { 'TOP': 0.20, 'JUNGLE': 0.15, 'MID': 0.25, 'ADC': 0.35, 'SUPPORT': 0.05 };
const DEATH_WEIGHTS = { 'TOP': 0.15, 'JUNGLE': 0.25, 'MID': 0.15, 'ADC': 0.10, 'SUPPORT': 0.35 };
const ASSIST_PARTICIPATION_BASE = { 'TOP': 0.4, 'JUNGLE': 0.6, 'MID': 0.5, 'ADC': 0.4, 'SUPPORT': 0.8 };
const CS_DISTRIBUTION = { 'ADC': 1.15, 'MID': 1.0, 'TOP': 0.9, 'JUNGLE': 0.65, 'SUPPORT': 0.1 };

const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper de Distribuição
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
    draftResult?: DraftResult
): FullMatchResult => {
    
    const matchId = uuidv4();
    const log: string[] = [];

    // --- SEGURANÇA ---
    if (!draftResult) {
        console.error(`🚨 CRITICAL: Match ${matchId} running WITHOUT Draft Result!`);
    }
    
    // --- FASE 1: Vencedor ---
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

    // --- FASE 2: Placar ---
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

    const playerStats = new Map<string, MatchStats>();

    // --- FASE 3: Stats Individuais ---
    const generateFullPlayerStats = (
        player: Player, 
        myIndex: number,
        teamPlayers: Player[],
        myKills: number, 
        myDeaths: number,
        teamKillsArray: number[], 
        isWinner: boolean
    ): MatchStats => {
        
        // 1. DETERMINAR CAMPEÃO
        let champName = "Unknown";
        let champData: Champion | undefined;

        if (draftResult) {
            champData = draftResult.bluePicks.get(player.id) || draftResult.redPicks.get(player.id);
            if (champData) {
                champName = champData.name;
            } else {
                champName = player.championPool[0]?.championName || "Minion";
            }
        } else {
            champName = player.championPool[0]?.championName || "Random";
        }

        const role = player.role || 'MID';

        // 2. Performance baseada no Draft
        let performanceMod = 1.0; 
        if (champData) {
            // FIX: Usamos (role as any) aqui para silenciar o erro de compatibilidade de Tipos
            // O TS reclama que 'Role' (do Player) não é 'ChampionRole' (do Champion), mas são as mesmas strings.
            const isMainRole = champData.roles.includes(role as any);
            
            if (!isMainRole) performanceMod -= 0.20; 
            const masteryEntry = player.championPool.find(c => c.championName === champName);
            if (masteryEntry) performanceMod += (masteryEntry.masteryLevel / 1000); 
            else performanceMod -= 0.05;
        }

        // 3. Assists e Ouro
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
        
        const kdaRatio = (myKills + myAssists) / Math.max(1, myDeaths);
        let ratingRaw = (kdaRatio * 0.7) + ((csPerMin/10)*2) + (isWinner?1:0) + (role==='SUPPORT'?2:0);
        const rating = Math.min(10, Math.max(1, ratingRaw + (roll(-15, 15)/10)));

        return {
            matchId, day, opponentTeamId: winner === 'BLUE' ? awayTeamId : homeTeamId,
            result: isWinner ? 'WIN' : 'LOSS', championName: champName,
            kills: myKills, deaths: myDeaths, assists: myAssists,
            cs: myCs, gold: myGold, damage: myDmg, duration,
            visionScore: Math.floor(duration * 1.5), rating: parseFloat(rating.toFixed(1))
        };
    };

    blueTeam.forEach((p, i) => {
        if(p) playerStats.set(p.id, generateFullPlayerStats(p, i, blueTeam, blueKillsArray[i], blueDeathsArray[i], blueKillsArray, winner === 'BLUE'));
    });
    redTeam.forEach((p, i) => {
        if(p) playerStats.set(p.id, generateFullPlayerStats(p, i, redTeam, redKillsArray[i], redDeathsArray[i], redKillsArray, winner === 'RED'));
    });

    return {
        matchId, winner, duration, log, playerStats, homeTeamId, awayTeamId,
        blueScore: blueTotalKills, redScore: redTotalKills
    };
}