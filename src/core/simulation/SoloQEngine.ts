import type { Player } from "../domain/Player";

const GAMES_PER_DAY_MIN = 1;
const GAMES_PER_DAY_MAX = 10;

export const initializeSoloQ = (player: Player) => {
    let lp = 0;
    let rank: 'CHALLENGER' | 'GRANDMASTER' | 'MASTER' = 'MASTER';
    
    if (player.overall >= 90) { 
        rank = 'CHALLENGER'; 
        lp = 800 + Math.floor(Math.random() * 400); 
    } else if (player.overall >= 85) { 
        rank = 'GRANDMASTER'; 
        lp = 400 + Math.floor(Math.random() * 400); 
    } else { 
        rank = 'MASTER'; 
        lp = Math.floor(Math.random() * 400); 
    }

    player.soloQ = {
        rankTier: rank,
        lp: lp,
        wins: 0,
        losses: 0
    };
};

export const simulateDailySoloQ = (players: Player[]) => {
    players.forEach(p => {
        if (!p.soloQ) initializeSoloQ(p);

        const gamesToday = Math.floor(Math.random() * (GAMES_PER_DAY_MAX - GAMES_PER_DAY_MIN + 1)) + GAMES_PER_DAY_MIN;
        
        for (let i = 0; i < gamesToday; i++) {
            const mechanicBonus = (p.attributes.mechanics - 50) / 2.5; // Ex: 90 mecânica = +16% chance
            const winChance = 50 + mechanicBonus;
            
            const roll = Math.random() * 100;

            if (roll <= winChance) {
                p.soloQ!.wins++;
                p.soloQ!.lp += Math.floor(Math.random() * 6) + 15; 
            } else {
                p.soloQ!.losses++;
                const loss = Math.floor(Math.random() * 6) + 14;
                p.soloQ!.lp = Math.max(0, p.soloQ!.lp - loss);
            }
        }

        if (p.soloQ!.lp >= 900) p.soloQ!.rankTier = 'CHALLENGER';
        else if (p.soloQ!.lp >= 500) p.soloQ!.rankTier = 'GRANDMASTER';
        else p.soloQ!.rankTier = 'MASTER';
    });
};