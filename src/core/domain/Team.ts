export interface TeamStats {
    wins: number;
    losses: number;
    championshipPoints: number;
}

export interface Team {
    id: string;
    name: string;
    acronym: string;
    primaryColor: string;
    secondaryColor: string;
    
    prestige: number;
    budget: number;

    stats: TeamStats
}