export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

export interface PlayerAttributes {
    laning: number;
    farming: number;
    roaming: number;
    mechanics: number;
    reflexes: number;
    aggression: number;
    macro: number;
    vision: number;
    shotcalling: number;
    teamfight: number;
}

export interface ChampionMastery {
    championName: string;
    masteryLevel: number; 
}

export interface SoloQStats {
    rankTier: 'CHALLENGER' | 'GRANDMASTER' | 'MASTER';
    lp: number;
    wins: number;
    losses: number;
}

export interface PlayerContract {
    salary: number;  
    expires: number; 
}

export interface MatchHistoryEntry {
    matchId: string;
    day: number;
    opponentTeamId: string;
    result: 'WIN' | 'LOSS';
    championName: string;
    kills: number;
    deaths: number;
    assists: number;
    cs: number;
    gold: number;
    damage: number;
    duration: number;
    visionScore: number;
    rating: number;
}

export interface Player {
    id: string;
    name: string;
    nickname: string;
    age: number;
    country: string;
    role: Role;
    team: string; 
    gender: 'MALE' | 'FEMALE';
    
    overall: number;
    potential: number;
    
    attributes: PlayerAttributes;
    championPool: ChampionMastery[];
    contract: PlayerContract;
    matchHistory: MatchHistoryEntry[];
    soloQ?: SoloQStats;
}