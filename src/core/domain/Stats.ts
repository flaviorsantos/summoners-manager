export interface KDAStats {
    kills: number;
    deaths: number;
    assists: number;
}

export interface EconomyStats {
    goldEarned: number;
    cs: number; 
    damageDealt: number;
    damageTaken: number;
    wardsPlaced?: number;
    wardsDestroyed?: number;
}

export interface MatchPlayerStats extends KDAStats, EconomyStats {
    playerId: string;
    championName: string; 
    role: string;
    rating: number; 
}

export interface TeamSeasonStats {
    wins: number;
    losses: number;
    championshipPoints: number;
    
    matchesPlayed: number;
    gameDurationAvg: number;
    totalKills: number;
    totalDeaths: number;
}

export interface MatchResult {
    id: string;
    winner: 'BLUE' | 'RED';
    duration: number; 
    blueTeamId: string;
    redTeamId: string;
    blueScore: number; 
    redScore: number;
    playerStats: MatchPlayerStats[]; 
    timeline: string[]; 
}