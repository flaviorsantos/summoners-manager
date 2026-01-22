import type { Team } from '../domain/Team';
import type { Match } from '../domain/Schedule';

export const scheduleGenerator = {
    generate(teams: Team[]) {
        const schedule = [];
        const numWeeks = (teams.length - 1) * 2;
        
        for (let i = 1; i <= numWeeks; i++) {
            schedule.push({
                week: i,
                matches: this.generateRound(teams)
            });
        }
        
        return schedule;
    },

    generateRound(teams: Team[]): Match[] {
        const matches: Match[] = [];
        const shuffled = [...teams].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 < shuffled.length) {
                matches.push({
                    id: Math.random().toString(36).substr(2, 9),
                    blueTeamId: shuffled[i].id,
                    redTeamId: shuffled[i+1].id,
                    winner: null,
                    isPlayed: false
                });
            }
        }
        return matches;
    }
};