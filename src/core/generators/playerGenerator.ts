import { v4 as uuidv4 } from 'uuid';
import type { Player, PlayerAttributes, Role, ChampionMastery } from './../domain/Player';
import { CHAMPIONS_DB, type Champion } from './../domain/Champions'; 

const FIRST_NAMES = ["Lee", "Kim", "Park", "Martin", "Rasmus", "Felipe", "Gabriel", "Thiago", "Matheus", "Lucas", "Pedro"];
const NICKS = ["Faker", "Caps", "Brance", "Titan", "Chovy", "ShowMaker", "Tinowns", "Robo", "Cariok", "Ceos", "Aegis", "Route"];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const generateAttr = (base: number, variation: number = 15):number => {
    let val = base + randomInt(-variation, variation);
    return Math.max(1, Math.min(99, val));
}

export const generatePlayer = (forcedRole?: Role): Player => {
    let role = forcedRole;
    if (!role) {
        const roles: Role[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
        role = roles[randomInt(0, 4)];
    }

    const age = randomInt(16, 25);
    const experienceBuff = (age - 16) * 2;
    
    const attributes: PlayerAttributes = {
        laning: generateAttr(role === 'SUPPORT' ? 50 : 60),
        farming: generateAttr(role === 'SUPPORT' ? 30 : 70),
        mechanics: generateAttr(65),
        reflexes: generateAttr(70 - (age > 24 ? 5 : 0)),
        aggression: generateAttr(50, 30),

        macro: generateAttr(50 + experienceBuff),
        roaming: generateAttr(role === 'MID' || role === 'SUPPORT' ? 65 : 50),
        vision: generateAttr((role === 'SUPPORT' || role === 'JUNGLE' ? 65 : 45) + experienceBuff),
        shotcalling: generateAttr(40 + experienceBuff),
        teamfight: generateAttr(60)
    };

    const values = Object.values(attributes);
    const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

    const validChamps = CHAMPIONS_DB.filter(c => c.roles.includes(role!));
    
    const poolSize = randomInt(3, 6);
    const championPool: ChampionMastery[] = [];
    const usedIds = new Set<string>();

    for(let i=0; i < poolSize; i++) {
        if(validChamps.length === 0) break;

        const randomIdx = randomInt(0, validChamps.length - 1);
        const champ = validChamps[randomIdx];

        if (!usedIds.has(champ.id)) {
            usedIds.add(champ.id);
            championPool.push({
                championName: champ.name, 
                masteryLevel: generateAttr(80, 20) 
            });
        }
    }

    if (championPool.length === 0) {
        championPool.push({ championName: "Teemo", masteryLevel: 99 });
    }

    let potential = overall + (age > 22 ? randomInt(0, 5) : randomInt(5, 20));

    return {
        id: uuidv4(),
        name: `${FIRST_NAMES[randomInt(0, FIRST_NAMES.length-1)]}`,
        nickname: NICKS[randomInt(0, NICKS.length-1)] + randomInt(1, 99),
        age,
        gender: 'M',
        role: role!,
        team: 'Free Agent',
        overall,
        potential,
        contract: {
            salary: overall * 1000 + randomInt(0, 5000),
            expires: 2026
        },
        attributes,
        championPool,
        matchHistory: [],
        championStats: []
    };
}