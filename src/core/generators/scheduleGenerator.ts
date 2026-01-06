import { v4 as uuidv4 } from 'uuid';
import type { Team } from '../domain/Team';
import type { ScheduleMatch } from '../domain/Schedule';

export const generateSchedule = (teams: Team[]): ScheduleMatch[] => {
    const schedule: ScheduleMatch[] = [];
    const leagueTeams = [...teams];
    const numRounds = leagueTeams.length - 1; 
    const halfSize = leagueTeams.length / 2;
    const teamIds = leagueTeams.map(t => t.id);

    let currentLeagueDay = 4; 

    for (let round = 0; round < numRounds; round++) {
        
        for (let i = 0; i < halfSize; i++) {
            const home = teamIds[i];
            const away = teamIds[teamIds.length - 1 - i];

            schedule.push({
                id: uuidv4(),
                day: currentLeagueDay, 
                homeTeamId: home,
                awayTeamId: away,
                played: false
            });
        }

        if (round % 2 === 0) {
            currentLeagueDay += 1; 
        } else {
            currentLeagueDay += 6; 
        }

        teamIds.splice(1, 0, teamIds.pop()!); 
    }

    if ((numRounds - 1) % 2 === 0) currentLeagueDay += 6; else currentLeagueDay += 1;

    const firstHalfMatches = [...schedule];
    
    const returnSchedule: ScheduleMatch[] = [];
    
    for (let round = 0; round < numRounds; round++) {
        const roundMatches = firstHalfMatches.slice(round * halfSize, (round + 1) * halfSize);
        
        roundMatches.forEach(match => {
            returnSchedule.push({
                id: uuidv4(),
                day: currentLeagueDay,
                homeTeamId: match.awayTeamId,
                awayTeamId: match.homeTeamId,
                played: false
            });
        });

        if (round % 2 === 0) {
            currentLeagueDay += 1; 
        } else {
            currentLeagueDay += 6; 
        }
    }

    return [...schedule, ...returnSchedule];
};