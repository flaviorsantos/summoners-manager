import type { Player } from './Player';
import type { TeamSeasonStats } from './Stats';

export interface Team {
    id: string;
    name: string;
    acronym: string;
    primaryColor: string;
    secondaryColor: string;
    
    prestige: number; 
    budget: number;   
    
    roster: Player[];
    
    stats: TeamSeasonStats;
}