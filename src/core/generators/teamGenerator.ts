import { v4 as uuidv4 } from 'uuid';
import type { Team } from '../domain/Team';

const LEAGUE_TEAMS = [
    { name: "paiN Gaming", acronym: "PNG", color: "bg-gray-900" },
    { name: "LOUD", acronym: "LLL", color: "bg-green-500" },
    { name: "RED Canids", acronym: "RED", color: "bg-red-600" },
    { name: "FURIA", acronym: "FUR", color: "bg-black" },
    { name: "Leviatan", acronym: "LEV", color: "bg-blue-900" },
    { name: "Vivo Keyd Stars", acronym: "VKS", color: "bg-purple-700" },
    { name: "Fluxo W7M", acronym: "FX", color: "bg-purple-900" },
    { name: "Los Grandes", acronym: "LOS", color: "bg-orange-600" }
];

export const generateLeagueTeams = (): Team[] => {
    return LEAGUE_TEAMS.map(t => ({
        id: uuidv4(),
        name: t.name,
        acronym: t.acronym,
        primaryColor: t.color,
        secondaryColor: 'text-white',
        prestige: Math.floor(Math.random() * 50) + 50, 
        budget: 10000000, 
        stats: {
            wins: 0,
            losses: 0,
            championshipPoints: 0
        }
    }));
}