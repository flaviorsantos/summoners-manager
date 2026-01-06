export interface ManagerAttributes {
    man_management: number; 
    training: number;       
    tactical: number;      
    negotiation: number;    
    scouting: number;       
}

export interface Manager {
    name: string;
    age: number;
    nationality: string;
    background: 'EX_PLAYER' | 'ANALYST' | 'BUSINESS' | 'ROOKIE';
    attributes: ManagerAttributes;
    reputation: number; // 0 a 100
}