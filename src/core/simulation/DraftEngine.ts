import { CHAMPIONS_DB } from "../domain/Champions";
import type { Player } from "../domain/Player";

export interface DraftResult {
    bluePicks: Map<string, string>;
    redPicks: Map<string, string>;
    blueBans: string[];
    redBans: string[];
}

export interface DraftOrders {
    myBans?: string[];
    myPicks?: Map<string, string>;
    enemyPicks?: Map<number, string>;
    enemyBans?: string[];
}

// Meta Fake Season 2026
const META_BANS = ['Ahri', 'LeeSin', 'Kaisa', 'Aatrox', 'Thresh', 'Azir', 'Aphelios', 'RenataGlasc', 'Yone', 'Sylas'];

// Sinergias (Bônus Explosivo de Score)
const SYNERGY_MAP: Record<string, string[]> = {
    'Kalista': ['Thresh', 'Nautilus', 'RenataGlasc', 'Alistar', 'Taric'],
    'Lucian': ['Nami', 'Milio', 'Braum'],
    'Xayah': ['Rakan'],
    'KogMaw': ['Lulu', 'Milio', 'Janna'],
    'Yasuo': ['Gragas', 'Malphite', 'Diana', 'Yone', 'Nautilus'],
    'Samira': ['Nautilus', 'Rell', 'Leona', 'Alistar'],
    'Caitlyn': ['Lux', 'Morgana', 'Karma'],
    'Zeri': ['Yuumi', 'Lulu'],
    'LeeSin': ['LeBlanc', 'Ahri', 'Syndra', 'Orianna'],
    'Vi': ['Ahri', 'Sylas', 'Orianna'],
    'Wukong': ['Yasuo', 'Orianna'],
};

export function getSmartBan(targetTeam: Player[], currentBans: Set<string>, enemyPicks?: Map<string, string>): string {
    // 1. Quebrar Combo (Se inimigo pegou Xayah, bane Rakan)
    if (enemyPicks && enemyPicks.size > 0 && Math.random() > 0.6) {
        for (const [_, champId] of enemyPicks) {
            const champName = CHAMPIONS_DB.find(c => c.id === champId)?.name;
            if (champName && SYNERGY_MAP[champName]) {
                for (const partner of SYNERGY_MAP[champName]) {
                    const partnerChamp = CHAMPIONS_DB.find(c => c.name === partner);
                    if (partnerChamp && !currentBans.has(partnerChamp.id)) return partnerChamp.id;
                }
            }
        }
    }

    // 2. Target Ban (Focar Mono Champions ou Carry)
    if (Math.random() > 0.3) {
        let candidates: { id: string, score: number }[] = [];
        targetTeam.forEach(p => {
            const threat = p.overall / 100;
            p.championPool.forEach(pool => {
                const c = CHAMPIONS_DB.find(db => db.name === pool.championName);
                if (c && !currentBans.has(c.id)) {
                    candidates.push({ id: c.id, score: pool.masteryLevel * threat });
                }
            });
        });
        candidates.sort((a, b) => b.score - a.score);
        if (candidates.length > 0) return candidates[0].id;
    }

    // 3. Meta Ban
    for (const name of META_BANS) {
        const c = CHAMPIONS_DB.find(db => db.name === name);
        if (c && !currentBans.has(c.id)) return c.id;
    }

    const fallback = CHAMPIONS_DB.find(c => !currentBans.has(c.id));
    return fallback ? fallback.id : 'Garen';
}

// 👇 ALTERAÇÃO: Retorna Objeto { id, score }
export function getSmartPick(
    player: Player, 
    taken: Set<string>, 
    myTeamPicks: string[]
): { id: string, score: number } {
    
    // Filtra campeões da Role do jogador
    // Se o jogador é "TOP", ele prefere champs de Top, MAS...
    // Num sistema de swap real, o jogador pode pickar pra outro.
    // Para simplificar: O score considera a força do campeão NA MÃO DESSE JOGADOR.
    const possibleChamps = CHAMPIONS_DB.filter(c => c.roles.includes(player.role) && !taken.has(c.id));
    
    let best = { id: '', score: -1 };

    // Lista de nomes já pickados pelo time (pra ver sinergia)
    const teamNames = new Set<string>();
    myTeamPicks.forEach(id => { const c = CHAMPIONS_DB.find(x => x.id === id); if(c) teamNames.add(c.name); });

    possibleChamps.forEach(champ => {
        let score = 0;
        
        // 1. Maestria
        const mastery = player.championPool.find(p => p.championName === champ.name)?.masteryLevel || 0;
        score += mastery; // 0 a 100

        // 2. Meta (Muito forte)
        if (META_BANS.includes(champ.name)) score += 30;

        // 3. Sinergia (Explosiva)
        // Comba com alguém?
        if (SYNERGY_MAP[champ.name]) {
            if (SYNERGY_MAP[champ.name].some(partner => teamNames.has(partner))) score += 70;
        }
        // Alguém precisa dele?
        teamNames.forEach(tn => {
            if (SYNERGY_MAP[tn] && SYNERGY_MAP[tn].includes(champ.name)) score += 70;
        });

        // 4. Overall do jogador (Prioridade de Carry)
        // Se o jogador é muito bom (Faker), o pick dele vale mais
        score += (player.overall / 5);

        // Penalidade se não joga com o boneco
        if (mastery === 0) score -= 30;

        if (score > best.score) {
            best = { id: champ.id, score };
        }
    });

    // Fallback de emergência
    if (!best.id && possibleChamps.length > 0) {
        best = { id: possibleChamps[0].id, score: 10 };
    }

    return best;
}

// Simulação de Background (mantida simples)
export function simulateDraft(blueTeam: Player[], redTeam: Player[], orders?: DraftOrders): DraftResult {
    if (orders && orders.myPicks && orders.enemyPicks) {
        const redPicksMap = new Map<string, string>();
        orders.enemyPicks.forEach((champId, slotIdx) => {
            if (redTeam[slotIdx]) redPicksMap.set(redTeam[slotIdx].id, champId);
        });
        return {
            bluePicks: orders.myPicks, redPicks: redPicksMap,
            blueBans: orders.myBans || [], redBans: orders.enemyBans || []
        };
    }

    const taken = new Set<string>();
    const blueBans: string[] = [];
    const redBans: string[] = [];
    const bluePicks = new Map<string, string>();
    const redPicks = new Map<string, string>();

    // Bans
    for (let i = 0; i < 5; i++) {
        const b = getSmartBan(redTeam, taken);
        if (b) { taken.add(b); blueBans.push(b); }
        const r = getSmartBan(blueTeam, taken);
        if (r) { taken.add(r); redBans.push(r); }
    }

    // Picks (Prioridade por Overall para simular Swap)
    const pickOrder = [
        ...[...blueTeam].sort((a,b) => b.overall - a.overall).map(p => ({p, team: 'BLUE'})),
        ...[...redTeam].sort((a,b) => b.overall - a.overall).map(p => ({p, team: 'RED'}))
    ];

    // Simplificação: Cada um pega seu melhor
    // (Na simulação visual o processo é turno a turno)
    [...blueTeam, ...redTeam].forEach(p => {
        const teamPicks = blueTeam.includes(p) ? Array.from(bluePicks.values()) : Array.from(redPicks.values());
        const best = getSmartPick(p, taken, teamPicks);
        if (best.id) {
            taken.add(best.id);
            if (blueTeam.includes(p)) bluePicks.set(p.id, best.id);
            else redPicks.set(p.id, best.id);
        }
    });

    return { bluePicks, redPicks, blueBans, redBans };
}