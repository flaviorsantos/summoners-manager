import type { Player } from "../domain/Player";

const GAMES_PER_DAY_MIN = 1;
const GAMES_PER_DAY_MAX = 10;

const getTargetLP = (overall: number) => {
    if (overall < 80) return 0;
    return (overall - 80) * 110; 
};

export const initializeSoloQ = (player: Player) => {
    const target = getTargetLP(player.overall);
    const startingLP = Math.max(0, target - 200); 

    let rank: 'CHALLENGER' | 'GRANDMASTER' | 'MASTER' = 'MASTER';
    if (startingLP >= 900) rank = 'CHALLENGER';
    else if (startingLP >= 500) rank = 'GRANDMASTER';

    player.soloQ = {
        rankTier: rank,
        lp: startingLP,
        wins: 0,
        losses: 0
    };
};
export const simulateDailySoloQ = (players: Player[]) => {
    players.forEach(p => {
        if (!p.soloQ) initializeSoloQ(p);

        const gamesToday = Math.floor(Math.random() * (GAMES_PER_DAY_MAX - GAMES_PER_DAY_MIN + 1)) + GAMES_PER_DAY_MIN;
        
        for (let i = 0; i < gamesToday; i++) {
            const mechanicBonus = (p.attributes.mechanics - 50) / 2.5; 
            const winChance = 50 + mechanicBonus;
            const roll = Math.random() * 100;
            const isWin = roll <= winChance;

            const targetLP = getTargetLP(p.overall);
            const currentLP = p.soloQ!.lp;
            const diff = targetLP - currentLP;

            const correction = Math.floor(diff / 20); 

            let lpChange = 0;

            if (isWin) {
                p.soloQ!.wins++;
                lpChange = 20 + correction;
                lpChange = Math.max(10, Math.min(35, lpChange)); 
                p.soloQ!.lp += lpChange;
            } else {
                p.soloQ!.losses++;
                lpChange = 20 - correction;
                lpChange = Math.max(10, Math.min(35, lpChange)); 
                p.soloQ!.lp = Math.max(0, p.soloQ!.lp - lpChange);
            }
        }

        if (p.soloQ!.lp >= 900) p.soloQ!.rankTier = 'CHALLENGER';
        else if (p.soloQ!.lp >= 500) p.soloQ!.rankTier = 'GRANDMASTER';
        else p.soloQ!.rankTier = 'MASTER';
    });
};