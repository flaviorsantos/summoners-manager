import type { MatchStats, ChampionStats } from './Stats';

export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

export interface PlayerAttributes {
    laning:  number;
    farming: number;
    roaming: number;
    mechanics:  number;
    reflexes:   number;
    aggression: number;
    macro:       number;
    vision:      number;
    shotcalling: number;
    teamfight:   number;
}

export interface ChampionMastery {
    championName: string;
    masteryLevel: number;
}

export interface Player {
    id:       string;
    name:     string;
    nickname: string;
    age:      number;
    gender:   string;
    role:     Role;
    team:     string;
    country:  string;

    overall:   number;
    potential: number;

    contract: {
        salary:  number;
        expires: number;
    };

    attributes:   PlayerAttributes;
    championPool: ChampionMastery[];

    matchHistory: MatchStats[];      
    championStats: ChampionStats[];
}