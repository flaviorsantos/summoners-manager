import { CHAMPIONS_DB } from "../domain/Champions";
import type { Player } from "../domain/Player";

export type DraftSide = 'BLUE' | 'RED';
export type DraftActionType = 'BAN' | 'PICK';

export interface DraftStep {
    side: DraftSide;
    type: DraftActionType;
    slotIdx: number;
}

const META_BANS = ['Ahri', 'LeeSin', 'Kaisa', 'Aatrox', 'Thresh', 'Azir', 'Aphelios', 'Renata', 'Yone', 'Sylas'];

export function getSmartBan(
    targetTeam: Player[], 
    currentBans: Set<string>, 
    enemyPicks?: Map<string, string> 
): string {
    
    const enemyFilledRoles = new Set<string>();
    
    if (enemyPicks) {
        enemyPicks.forEach((champId) => {
            const c = CHAMPIONS_DB.find(x => x.id === champId);
            if (c) {
                enemyFilledRoles.add(c.roles[0]); 
            }
        });
    }

    let candidates: { id: string, score: number }[] = [];
    
    targetTeam.forEach(p => {
        const roleAlreadyFilled = enemyFilledRoles.has(p.role);
        
        const threat = p.overall / 100;
        p.championPool.forEach(pool => {
            const c = CHAMPIONS_DB.find(db => db.name === pool.championName);
            if (c && !currentBans.has(c.id)) {
                let situationalScore = pool.masteryLevel * threat;
                
                if (roleAlreadyFilled && c.roles[0] === p.role) {
                    situationalScore *= 0.05; 
                }

                candidates.push({ id: c.id, score: situationalScore });
            }
        });
    });

    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length > 0) return candidates[0].id;

    for (const name of META_BANS) {
        const c = CHAMPIONS_DB.find(db => db.name === name);
        if (c && !currentBans.has(c.id)) {
             if (!enemyFilledRoles.has(c.roles[0])) return c.id;
        }
    }

    const fallback = CHAMPIONS_DB.find(c => !currentBans.has(c.id));
    return fallback ? fallback.id : 'Garen';
}

export function getSmartPick(
    player: Player, 
    taken: Set<string>, 
    _myTeamPicks: string[] 
): { id: string, score: number } {
    
    const possibleChamps = CHAMPIONS_DB.filter(c => 
        (c.roles.includes(player.role) || c.roles.length > 0) && !taken.has(c.id)
    );
    
    let best = { id: '', score: -Infinity };

    possibleChamps.forEach(champ => {
        let score = 0;
        
        const mastery = player.championPool.find(p => p.championName === champ.name)?.masteryLevel || 0;
        if (mastery === 0) score -= 50; 
        else score += mastery * 2
        if (META_BANS.includes(champ.name)) score += 20;

        if (champ.roles[0] === player.role) score += 100;
        else if (champ.roles.includes(player.role)) score += 50;
        else score -= 200; 

        if (score > best.score) {
            best = { id: champ.id, score };
        }
    });

    if (!best.id && possibleChamps.length > 0) {
        best = { id: possibleChamps[0].id, score: 0 };
    }

    return best;
}