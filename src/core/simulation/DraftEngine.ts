import type { Player } from "../domain/Player";
import { CHAMPIONS_DB, type Champion } from "../domain/Champions";

export interface DraftResult {
    bluePicks: Map<string, Champion>;
    redPicks: Map<string, Champion>;
    bans: string[];
}

export interface DraftOrders {
    myBans: string[];       
    myPicks: Map<string, string>; 
}

const getMetaPick = (role: string, unavailable: Set<string>): Champion => {
    const candidates = CHAMPIONS_DB.filter(c => 
        c.roles.includes(role as any) && !unavailable.has(c.id)
    );
    if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return CHAMPIONS_DB[0]; 
};

export const simulateDraft = (
    blueTeam: Player[], 
    redTeam: Player[],
    userOrders?: DraftOrders 
): DraftResult => {
    
    const unavailable = new Set<string>();
    const bluePicks = new Map<string, Champion>();
    const redPicks = new Map<string, Champion>();
    const bans: string[] = [];

    if (userOrders) {
        userOrders.myBans.forEach(banId => {
            if (banId && !unavailable.has(banId)) {
                unavailable.add(banId);
                bans.push(banId);
            }
        });

        userOrders.myPicks.forEach((champId, playerId) => {
            const champ = CHAMPIONS_DB.find(c => c.id === champId);
            if (champ) {
                bluePicks.set(playerId, champ);
                unavailable.add(champId);
            }
        });
    }

    const totalBansTarget = 10; 
    let attempts = 0;
    
    while (bans.length < totalBansTarget && attempts < 100) {
        const banTarget = CHAMPIONS_DB[Math.floor(Math.random() * CHAMPIONS_DB.length)];
        if (!unavailable.has(banTarget.id)) {
            unavailable.add(banTarget.id);
            bans.push(banTarget.id);
        }
        attempts++;
    }

    const allPlayers = [
        { p: blueTeam[0], side: 'BLUE' }, { p: redTeam[0], side: 'RED' },
        { p: blueTeam[1], side: 'BLUE' }, { p: redTeam[1], side: 'RED' },
        { p: blueTeam[2], side: 'BLUE' }, { p: redTeam[2], side: 'RED' },
        { p: blueTeam[3], side: 'BLUE' }, { p: redTeam[3], side: 'RED' },
        { p: blueTeam[4], side: 'BLUE' }, { p: redTeam[4], side: 'RED' }
    ];

    allPlayers.forEach(entry => {
        const player = entry.p;
        if (!player) return;

        if (entry.side === 'BLUE' && bluePicks.has(player.id)) return;
        if (entry.side === 'RED' && redPicks.has(player.id)) return;

        let selectedChamp: Champion | null = null;

        for (const mastery of player.championPool) {
            const dbChamp = CHAMPIONS_DB.find(c => c.name === mastery.championName);
            if (dbChamp && !unavailable.has(dbChamp.id)) {
                selectedChamp = dbChamp;
                break;
            }
        }

        if (!selectedChamp) {
            selectedChamp = getMetaPick(player.role, unavailable);
        }

        unavailable.add(selectedChamp.id);
        if (entry.side === 'BLUE') bluePicks.set(player.id, selectedChamp);
        else redPicks.set(player.id, selectedChamp);
    });

    return { bluePicks, redPicks, bans };
};