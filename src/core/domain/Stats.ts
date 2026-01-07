
export interface MatchStats {
    matchId: string;
    playerId: string;
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
    
    visionScore: number;
    rating: number; 
    duration: number; 
}

export interface ChampionStats {
    championName: string;
    gamesPlayed: number;
    wins: number;
    losses: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    avgCs: number;
    avgRating: number;
}