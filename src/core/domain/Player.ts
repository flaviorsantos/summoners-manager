export interface ChampionMastery {
    championName: string;
    masteryLevel: number; // 1 a 7 (ou 100 a 1000 internamente)
}

export type PlayerRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

export interface PlayerAttributes {
    laning: number;      
    
    mechanics: number;   
    aggression: number;  
    
    positioning: number; 
    shotcalling: number; 
    vision: number;      
}

export interface Player {
    id: string;
    name: string;
    nickname: string;
    age: number;
    role: PlayerRole;
    
    attributes: PlayerAttributes;
    overall: number; 
    potential: number; 
    
    championPool: ChampionMastery[];
    
    salary: number;
    contractExpires: number; 
    
    morale: number; 
}