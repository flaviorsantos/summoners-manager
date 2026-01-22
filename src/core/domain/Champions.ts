export type ChampionRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
export type DamageType = 'AD' | 'AP' | 'MIXED' | 'TRUE' | 'TANK';
export type ChampionClass = 'TANK' | 'FIGHTER' | 'ASSASSIN' | 'MAGE' | 'MARKSMAN' | 'ENCHANTER' | 'SPECIALIST';

export type ChampionTag = 
    | 'NEEDS_KNOCKUP' | 'PROVIDES_KNOCKUP' | 'WOMBO_ENABLER'
    | 'HARD_ENGAGE' | 'DISENGAGE' | 'LOCKDOWN'
    | 'POKE' | 'SIEGE' | 'ARTILLERY'
    | 'HYPER_CARRY' | 'CARRY' | 'EARLY_BULLY' | 'LANE_BULLY' | 'SCALING' | 'SNOWBALL'
    | 'ENCHANTER' | 'PEEL' | 'HEAL' | 'SHIELD' | 'SUSTAIN'
    | 'UTILITY' | 'SUPPORTIVE' | 'HYPER_CARRY_BUFFER' | 'REVIVE'
    | 'ANTI_CC' | 'RANGE_BUFF' | 'SPEED' | 'SAFE' | 'SAFETY'
    | 'DIVER' | 'ASSASSIN' | 'SKIRMISHER' | 'JUGGERNAUT' | 'DRAIN_TANK'
    | 'TANK_BUSTER' | 'ONE_SHOT' | 'BURST' | 'CONTROL' | 'MAGE' | 'TANK'
    | 'ISOLATION' | 'GLOBAL' | 'ROAMER' | 'SPLIT_PUSHER' | 'WAVE_CLEAR'
    | 'HOOK' | 'CATCH' | 'PICK' | 'BIND'
    | 'RESET' | 'CLEANUP' | 'EXECUTE' | 'STEALTH' | 'TRICKSTER' | 'SHUFFLE'
    | 'AOE' | 'TRUE_DAMAGE' | 'HYBRID' 
    | 'DISABLE_TOWER' | 'OBJECTIVE_CONTROL' | 'PLAYMAKER' | 'STEAL_ULT'
    | 'SHIELD_BREAKER' | 'ANTI_CARRY' | 'ANTI_DIVE' | 'INVULNERABILITY' | 'UNTARGETABLE' | 'CC_RELIANT' | 'MOBILITY' | 'IMMOBILE';

export interface Champion {
    id: string; 
    name: string;
    roles: ChampionRole[];
    class: ChampionClass;
    tags: ChampionTag[]; 
    damageType: DamageType;
    difficulty: number;
    earlyGame: number;
    midGame: number;
    lateGame: number;
}

export const CHAMPIONS_DB: Champion[] = [
    // TOP
    { id: 'Aatrox', name: 'Aatrox', roles: ['TOP'], class: 'FIGHTER', tags: ['DIVER', 'EARLY_BULLY'], damageType: 'AD', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 6 },
    { id: 'Camille', name: 'Camille', roles: ['TOP'], class: 'FIGHTER', tags: ['DIVER', 'ISOLATION', 'SPLIT_PUSHER'], damageType: 'AD', difficulty: 3, earlyGame: 5, midGame: 8, lateGame: 9 },
    { id: 'Chogath', name: 'Cho\'Gath', roles: ['TOP', 'MID'], class: 'TANK', tags: ['SCALING', 'EXECUTE', 'PROVIDES_KNOCKUP', 'TRUE_DAMAGE'], damageType: 'AP', difficulty: 1, earlyGame: 4, midGame: 7, lateGame: 10 },
    { id: 'Darius', name: 'Darius', roles: ['TOP'], class: 'FIGHTER', tags: ['LANE_BULLY', 'DIVER'], damageType: 'AD', difficulty: 1, earlyGame: 9, midGame: 7, lateGame: 4 },
    { id: 'DrMundo', name: 'Dr. Mundo', roles: ['TOP', 'JUNGLE'], class: 'FIGHTER', tags: ['JUGGERNAUT', 'SUSTAIN', 'ANTI_CC'], damageType: 'MIXED', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Fiora', name: 'Fiora', roles: ['TOP'], class: 'FIGHTER', tags: ['SPLIT_PUSHER', 'ISOLATION', 'HYPER_CARRY'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 8, lateGame: 10 },
    { id: 'Gangplank', name: 'Gangplank', roles: ['TOP', 'MID'], class: 'FIGHTER', tags: ['SCALING', 'GLOBAL', 'WOMBO_ENABLER'], damageType: 'AD', difficulty: 3, earlyGame: 5, midGame: 8, lateGame: 10 },
    { id: 'Garen', name: 'Garen', roles: ['TOP'], class: 'FIGHTER', tags: ['LANE_BULLY', 'TANK'], damageType: 'AD', difficulty: 1, earlyGame: 7, midGame: 6, lateGame: 5 },
    { id: 'Gnar', name: 'Gnar', roles: ['TOP'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP', 'POKE'], damageType: 'AD', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Gwen', name: 'Gwen', roles: ['TOP', 'JUNGLE'], class: 'FIGHTER', tags: ['HYPER_CARRY', 'SPLIT_PUSHER'], damageType: 'AP', difficulty: 2, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Illaoi', name: 'Illaoi', roles: ['TOP'], class: 'FIGHTER', tags: ['LANE_BULLY', 'SIEGE'], damageType: 'AD', difficulty: 2, earlyGame: 7, midGame: 8, lateGame: 5 },
    { id: 'Irelia', name: 'Irelia', roles: ['TOP', 'MID'], class: 'FIGHTER', tags: ['DIVER', 'HYPER_CARRY'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Jax', name: 'Jax', roles: ['TOP', 'JUNGLE'], class: 'FIGHTER', tags: ['HYPER_CARRY', 'SPLIT_PUSHER'], damageType: 'MIXED', difficulty: 2, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Jayce', name: 'Jayce', roles: ['TOP', 'MID'], class: 'FIGHTER', tags: ['POKE', 'SIEGE', 'LANE_BULLY'], damageType: 'AD', difficulty: 3, earlyGame: 9, midGame: 8, lateGame: 5 },
    { id: 'Kante', name: 'K\'Sante', roles: ['TOP'], class: 'TANK', tags: ['PEEL', 'ISOLATION', 'PROVIDES_KNOCKUP'], damageType: 'TANK', difficulty: 3, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'Kayle', name: 'Kayle', roles: ['TOP', 'MID'], class: 'SPECIALIST', tags: ['HYPER_CARRY', 'SCALING'], damageType: 'MIXED', difficulty: 2, earlyGame: 2, midGame: 6, lateGame: 10 },
    { id: 'Kennen', name: 'Kennen', roles: ['TOP', 'MID'], class: 'MAGE', tags: ['WOMBO_ENABLER', 'AOE', 'HARD_ENGAGE', 'CC_RELIANT'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 7 },
    { id: 'Kled', name: 'Kled', roles: ['TOP'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'DIVER', 'GLOBAL'], damageType: 'AD', difficulty: 2, earlyGame: 8, midGame: 7, lateGame: 4 },
    { id: 'Malphite', name: 'Malphite', roles: ['TOP', 'MID'], class: 'TANK', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP', 'WOMBO_ENABLER'], damageType: 'AP', difficulty: 1, earlyGame: 4, midGame: 9, lateGame: 8 },
    { id: 'Maokai', name: 'Maokai', roles: ['JUNGLE', 'SUPPORT', 'TOP'], class: 'TANK', tags: ['HARD_ENGAGE', 'PEEL', 'PROVIDES_KNOCKUP', 'CONTROL'], damageType: 'AP', difficulty: 1, earlyGame: 5, midGame: 8, lateGame: 8 },
    { id: 'Mordekaiser', name: 'Mordekaiser', roles: ['TOP'], class: 'FIGHTER', tags: ['ISOLATION', 'JUGGERNAUT'], damageType: 'AP', difficulty: 1, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'Nasus', name: 'Nasus', roles: ['TOP'], class: 'FIGHTER', tags: ['SCALING', 'SPLIT_PUSHER'], damageType: 'AD', difficulty: 1, earlyGame: 3, midGame: 6, lateGame: 10 },
    { id: 'Ornn', name: 'Ornn', roles: ['TOP'], class: 'TANK', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP', 'WOMBO_ENABLER'], damageType: 'TANK', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 9 },
    { id: 'Pantheon', name: 'Pantheon', roles: ['SUPPORT', 'MID', 'TOP'], class: 'FIGHTER', tags: ['GLOBAL', 'EARLY_BULLY', 'DIVER'], damageType: 'AD', difficulty: 1, earlyGame: 9, midGame: 6, lateGame: 3 },
    { id: 'Poppy', name: 'Poppy', roles: ['JUNGLE', 'SUPPORT', 'TOP'], class: 'TANK', tags: ['PEEL', 'DISENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'TANK', difficulty: 2, earlyGame: 6, midGame: 7, lateGame: 7 },
    { id: 'Quinn', name: 'Quinn', roles: ['TOP'], class: 'MARKSMAN', tags: ['ROAMER', 'SPLIT_PUSHER'], damageType: 'AD', difficulty: 2, earlyGame: 8, midGame: 7, lateGame: 5 },
    { id: 'Renekton', name: 'Renekton', roles: ['TOP'], class: 'FIGHTER', tags: ['LANE_BULLY', 'DIVER'], damageType: 'AD', difficulty: 2, earlyGame: 9, midGame: 7, lateGame: 4 },
    { id: 'Riven', name: 'Riven', roles: ['TOP'], class: 'FIGHTER', tags: ['SKIRMISHER', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 3, earlyGame: 7, midGame: 9, lateGame: 6 },
    { id: 'Rumble', name: 'Rumble', roles: ['TOP', 'MID'], class: 'MAGE', tags: ['WOMBO_ENABLER', 'LANE_BULLY'], damageType: 'AP', difficulty: 2, earlyGame: 8, midGame: 9, lateGame: 6 },
    { id: 'Sett', name: 'Sett', roles: ['TOP', 'SUPPORT'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'LANE_BULLY'], damageType: 'AD', difficulty: 1, earlyGame: 8, midGame: 7, lateGame: 5 },
    { id: 'Shen', name: 'Shen', roles: ['TOP', 'SUPPORT'], class: 'TANK', tags: ['GLOBAL', 'PEEL'], damageType: 'TANK', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'Singed', name: 'Singed', roles: ['TOP'], class: 'TANK', tags: ['SPLIT_PUSHER', 'DISENGAGE'], damageType: 'AP', difficulty: 2, earlyGame: 4, midGame: 8, lateGame: 8 },
    { id: 'Sion', name: 'Sion', roles: ['TOP'], class: 'TANK', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP', 'SCALING'], damageType: 'TANK', difficulty: 2, earlyGame: 5, midGame: 8, lateGame: 9 },
    { id: 'TahmKench', name: 'Tahm Kench', roles: ['SUPPORT', 'TOP'], class: 'TANK', tags: ['PEEL', 'GLOBAL'], damageType: 'TANK', difficulty: 2, earlyGame: 7, midGame: 7, lateGame: 8 },
    { id: 'Teemo', name: 'Teemo', roles: ['TOP'], class: 'SPECIALIST', tags: ['LANE_BULLY', 'POKE'], damageType: 'AP', difficulty: 1, earlyGame: 8, midGame: 6, lateGame: 6 },
    { id: 'Tryndamere', name: 'Tryndamere', roles: ['TOP'], class: 'FIGHTER', tags: ['SPLIT_PUSHER', 'HYPER_CARRY'], damageType: 'AD', difficulty: 1, earlyGame: 6, midGame: 8, lateGame: 9 },
    { id: 'Urgot', name: 'Urgot', roles: ['TOP'], class: 'FIGHTER', tags: ['LANE_BULLY', 'JUGGERNAUT'], damageType: 'AD', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 6 },
    { id: 'Vayne', name: 'Vayne', roles: ['ADC', 'TOP'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'TANK_BUSTER'], damageType: 'TRUE', difficulty: 3, earlyGame: 3, midGame: 7, lateGame: 10 },
    { id: 'Volibear', name: 'Volibear', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['DIVER', 'DISABLE_TOWER'], damageType: 'MIXED', difficulty: 1, earlyGame: 7, midGame: 8, lateGame: 6 },
    { id: 'MonkeyKing', name: 'Wukong', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 1, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Yasuo', name: 'Yasuo', roles: ['MID', 'TOP', 'ADC'], class: 'FIGHTER', tags: ['NEEDS_KNOCKUP', 'HYPER_CARRY'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 9 },
    { id: 'Yone', name: 'Yone', roles: ['MID', 'TOP'], class: 'FIGHTER', tags: ['PROVIDES_KNOCKUP', 'HYPER_CARRY', 'DIVER'], damageType: 'MIXED', difficulty: 3, earlyGame: 5, midGame: 8, lateGame: 10 },
    { id: 'Yorick', name: 'Yorick', roles: ['TOP'], class: 'FIGHTER', tags: ['SPLIT_PUSHER', 'SIEGE'], damageType: 'AD', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 8 },

    // JUNGLE
    { id: 'Amumu', name: 'Amumu', roles: ['JUNGLE', 'SUPPORT'], class: 'TANK', tags: ['HARD_ENGAGE', 'WOMBO_ENABLER'], damageType: 'AP', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 8 },
    { id: 'Belveth', name: 'Bel\'Veth', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['HYPER_CARRY', 'SIEGE'], damageType: 'AD', difficulty: 2, earlyGame: 5, midGame: 9, lateGame: 9 },
    { id: 'Briar', name: 'Briar', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['DIVER', 'GLOBAL'], damageType: 'AD', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 6 },
    { id: 'Diana', name: 'Diana', roles: ['JUNGLE', 'MID'], class: 'ASSASSIN', tags: ['DIVER', 'WOMBO_ENABLER'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Ekko', name: 'Ekko', roles: ['JUNGLE', 'MID'], class: 'ASSASSIN', tags: ['DIVER', 'SCALING'], damageType: 'AP', difficulty: 3, earlyGame: 5, midGame: 8, lateGame: 9 },
    { id: 'Elise', name: 'Elise', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['DIVER', 'EARLY_BULLY'], damageType: 'AP', difficulty: 3, earlyGame: 10, midGame: 7, lateGame: 3 },
    { id: 'Evelynn', name: 'Evelynn', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['ASSASSIN', 'ISOLATION'], damageType: 'AP', difficulty: 2, earlyGame: 4, midGame: 9, lateGame: 8 },
    { id: 'Fiddlesticks', name: 'Fiddlesticks', roles: ['JUNGLE'], class: 'MAGE', tags: ['WOMBO_ENABLER', 'HARD_ENGAGE'], damageType: 'AP', difficulty: 2, earlyGame: 5, midGame: 9, lateGame: 9 },
    { id: 'Gragas', name: 'Gragas', roles: ['JUNGLE', 'TOP', 'SUPPORT'], class: 'TANK', tags: ['DISENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'Graves', name: 'Graves', roles: ['JUNGLE'], class: 'MARKSMAN', tags: ['CARRY', 'EARLY_BULLY'], damageType: 'AD', difficulty: 2, earlyGame: 8, midGame: 9, lateGame: 7 },
    { id: 'Hecarim', name: 'Hecarim', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'DIVER'], damageType: 'AD', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Ivern', name: 'Ivern', roles: ['JUNGLE'], class: 'ENCHANTER', tags: ['PEEL', 'SUPPORTIVE'], damageType: 'AP', difficulty: 3, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'JarvanIV', name: 'Jarvan IV', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 1, earlyGame: 8, midGame: 8, lateGame: 6 },
    { id: 'Karthus', name: 'Karthus', roles: ['JUNGLE', 'ADC'], class: 'MAGE', tags: ['GLOBAL', 'SCALING', 'HYPER_CARRY'], damageType: 'AP', difficulty: 2, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Kayn', name: 'Kayn', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['ASSASSIN', 'DIVER'], damageType: 'AD', difficulty: 2, earlyGame: 4, midGame: 9, lateGame: 8 },
    { id: 'Khazix', name: 'Kha\'Zix', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['ISOLATION', 'ASSASSIN'], damageType: 'AD', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Kindred', name: 'Kindred', roles: ['JUNGLE'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'SCALING'], damageType: 'AD', difficulty: 3, earlyGame: 5, midGame: 8, lateGame: 10 },
    { id: 'LeeSin', name: 'Lee Sin', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['EARLY_BULLY', 'PLAYMAKER', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 3, earlyGame: 9, midGame: 8, lateGame: 4 },
    { id: 'Lillia', name: 'Lillia', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['WOMBO_ENABLER', 'SKIRMISHER'], damageType: 'AP', difficulty: 2, earlyGame: 5, midGame: 9, lateGame: 8 },
    { id: 'MasterYi', name: 'Master Yi', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['HYPER_CARRY', 'CLEANUP'], damageType: 'TRUE', difficulty: 1, earlyGame: 4, midGame: 7, lateGame: 10 },
    { id: 'Nidalee', name: 'Nidalee', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['POKE', 'EARLY_BULLY'], damageType: 'AP', difficulty: 3, earlyGame: 9, midGame: 7, lateGame: 4 },
    { id: 'Nocturne', name: 'Nocturne', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['GLOBAL', 'DIVER'], damageType: 'AD', difficulty: 1, earlyGame: 6, midGame: 9, lateGame: 5 },
    { id: 'Nunu', name: 'Nunu & Willump', roles: ['JUNGLE'], class: 'TANK', tags: ['OBJECTIVE_CONTROL', 'HARD_ENGAGE'], damageType: 'AP', difficulty: 1, earlyGame: 8, midGame: 7, lateGame: 6 },
    { id: 'Olaf', name: 'Olaf', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['DIVER', 'EARLY_BULLY'], damageType: 'TRUE', difficulty: 2, earlyGame: 9, midGame: 7, lateGame: 4 },
    { id: 'Rammus', name: 'Rammus', roles: ['JUNGLE'], class: 'TANK', tags: ['HARD_ENGAGE', 'ROAMER'], damageType: 'TANK', difficulty: 1, earlyGame: 6, midGame: 7, lateGame: 6 },
    { id: 'Reksai', name: 'Rek\'Sai', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['EARLY_BULLY', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 2, earlyGame: 9, midGame: 7, lateGame: 4 },
    { id: 'Rengar', name: 'Rengar', roles: ['JUNGLE', 'TOP'], class: 'ASSASSIN', tags: ['ASSASSIN', 'ONE_SHOT'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Sejuani', name: 'Sejuani', roles: ['JUNGLE'], class: 'TANK', tags: ['HARD_ENGAGE', 'WOMBO_ENABLER', 'PROVIDES_KNOCKUP'], damageType: 'TANK', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 8 },
    { id: 'Shaco', name: 'Shaco', roles: ['JUNGLE', 'SUPPORT'], class: 'ASSASSIN', tags: ['ASSASSIN', 'TRICKSTER'], damageType: 'AD', difficulty: 3, earlyGame: 8, midGame: 7, lateGame: 5 },
    { id: 'Shyvana', name: 'Shyvana', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['SCALING', 'DIVER'], damageType: 'MIXED', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 8 },
    { id: 'Skarner', name: 'Skarner', roles: ['JUNGLE', 'TOP'], class: 'TANK', tags: ['HARD_ENGAGE', 'LOCKDOWN'], damageType: 'TANK', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'Taliyah', name: 'Taliyah', roles: ['JUNGLE', 'MID'], class: 'MAGE', tags: ['ROAMER', 'CONTROL', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 8 },
    { id: 'Trundle', name: 'Trundle', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['SPLIT_PUSHER', 'TANK_BUSTER'], damageType: 'AD', difficulty: 1, earlyGame: 7, midGame: 7, lateGame: 7 },
    { id: 'Udyr', name: 'Udyr', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['SKIRMISHER', 'SPLIT_PUSHER'], damageType: 'MIXED', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 6 },
    { id: 'Vi', name: 'Vi', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['HARD_ENGAGE', 'LOCKDOWN', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 1, earlyGame: 7, midGame: 8, lateGame: 6 },
    { id: 'Viego', name: 'Viego', roles: ['JUNGLE'], class: 'ASSASSIN', tags: ['RESET', 'CARRY'], damageType: 'AD', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 8 },
    { id: 'Warwick', name: 'Warwick', roles: ['JUNGLE', 'TOP'], class: 'FIGHTER', tags: ['DIVER', 'EARLY_BULLY'], damageType: 'MIXED', difficulty: 1, earlyGame: 8, midGame: 7, lateGame: 5 },
    { id: 'XinZhao', name: 'Xin Zhao', roles: ['JUNGLE'], class: 'FIGHTER', tags: ['DIVER', 'EARLY_BULLY', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 1, earlyGame: 9, midGame: 7, lateGame: 4 },
    { id: 'Zac', name: 'Zac', roles: ['JUNGLE', 'TOP'], class: 'TANK', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'TANK', difficulty: 2, earlyGame: 5, midGame: 9, lateGame: 8 },
    { id: 'Zed', name: 'Zed', roles: ['MID', 'JUNGLE'], class: 'ASSASSIN', tags: ['ASSASSIN', 'ROAMER'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 6 },

    // MID
    { id: 'Ahri', name: 'Ahri', roles: ['MID'], class: 'MAGE', tags: ['ASSASSIN', 'ROAMER', 'PICK'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Akali', name: 'Akali', roles: ['MID', 'TOP'], class: 'ASSASSIN', tags: ['ASSASSIN', 'DIVER'], damageType: 'AP', difficulty: 3, earlyGame: 5, midGame: 10, lateGame: 7 },
    { id: 'Akshan', name: 'Akshan', roles: ['MID', 'TOP'], class: 'MARKSMAN', tags: ['ROAMER', 'REVIVE'], damageType: 'AD', difficulty: 3, earlyGame: 9, midGame: 8, lateGame: 5 },
    { id: 'Anivia', name: 'Anivia', roles: ['MID'], class: 'MAGE', tags: ['CONTROL', 'WAVE_CLEAR', 'SCALING'], damageType: 'AP', difficulty: 3, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Annie', name: 'Annie', roles: ['MID', 'SUPPORT'], class: 'MAGE', tags: ['BURST', 'HARD_ENGAGE'], damageType: 'AP', difficulty: 1, earlyGame: 6, midGame: 8, lateGame: 7 },
    { id: 'AurelionSol', name: 'Aurelion Sol', roles: ['MID'], class: 'MAGE', tags: ['SCALING', 'WOMBO_ENABLER', 'GLOBAL'], damageType: 'AP', difficulty: 2, earlyGame: 3, midGame: 8, lateGame: 10 },
    { id: 'Azir', name: 'Azir', roles: ['MID'], class: 'MAGE', tags: ['SCALING', 'HYPER_CARRY', 'SHUFFLE'], damageType: 'AP', difficulty: 3, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Cassiopeia', name: 'Cassiopeia', roles: ['MID', 'TOP'], class: 'MAGE', tags: ['HYPER_CARRY', 'DISENGAGE'], damageType: 'AP', difficulty: 3, earlyGame: 5, midGame: 8, lateGame: 10 },
    { id: 'Corki', name: 'Corki', roles: ['MID', 'ADC'], class: 'MARKSMAN', tags: ['POKE', 'SIEGE'], damageType: 'MIXED', difficulty: 2, earlyGame: 5, midGame: 9, lateGame: 8 },
    { id: 'Fizz', name: 'Fizz', roles: ['MID'], class: 'ASSASSIN', tags: ['ASSASSIN', 'DIVER'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 6 },
    { id: 'Galio', name: 'Galio', roles: ['MID', 'SUPPORT'], class: 'TANK', tags: ['GLOBAL', 'WOMBO_ENABLER', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 8 },
    { id: 'Heimerdinger', name: 'Heimerdinger', roles: ['SUPPORT', 'MID', 'TOP'], class: 'MAGE', tags: ['SIEGE', 'CONTROL'], damageType: 'AP', difficulty: 2, earlyGame: 8, midGame: 8, lateGame: 6 },
    { id: 'Hwei', name: 'Hwei', roles: ['MID', 'SUPPORT'], class: 'MAGE', tags: ['ARTILLERY', 'CONTROL', 'WOMBO_ENABLER'], damageType: 'AP', difficulty: 3, earlyGame: 5, midGame: 9, lateGame: 9 },
    { id: 'Kassadin', name: 'Kassadin', roles: ['MID'], class: 'ASSASSIN', tags: ['SCALING', 'HYPER_CARRY'], damageType: 'AP', difficulty: 2, earlyGame: 2, midGame: 6, lateGame: 10 },
    { id: 'Katarina', name: 'Katarina', roles: ['MID'], class: 'ASSASSIN', tags: ['RESET', 'CLEANUP', 'AOE'], damageType: 'MIXED', difficulty: 3, earlyGame: 4, midGame: 9, lateGame: 8 },
    { id: 'Leblanc', name: 'LeBlanc', roles: ['MID'], class: 'ASSASSIN', tags: ['ASSASSIN', 'ROAMER'], damageType: 'AP', difficulty: 3, earlyGame: 8, midGame: 9, lateGame: 5 },
    { id: 'Lissandra', name: 'Lissandra', roles: ['MID'], class: 'MAGE', tags: ['HARD_ENGAGE', 'CC_RELIANT'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 8 },
    { id: 'Lux', name: 'Lux', roles: ['SUPPORT', 'MID'], class: 'MAGE', tags: ['POKE', 'BURST'], damageType: 'AP', difficulty: 1, earlyGame: 7, midGame: 8, lateGame: 7 },
    { id: 'Malzahar', name: 'Malzahar', roles: ['MID'], class: 'MAGE', tags: ['LOCKDOWN', 'WAVE_CLEAR'], damageType: 'AP', difficulty: 1, earlyGame: 5, midGame: 8, lateGame: 8 },
    { id: 'Naafiri', name: 'Naafiri', roles: ['MID', 'JUNGLE'], class: 'ASSASSIN', tags: ['ASSASSIN', 'ROAMER', 'DIVER'], damageType: 'AD', difficulty: 1, earlyGame: 7, midGame: 9, lateGame: 6 },
    { id: 'Neeko', name: 'Neeko', roles: ['MID', 'SUPPORT'], class: 'MAGE', tags: ['HARD_ENGAGE', 'TRICKSTER'], damageType: 'AP', difficulty: 2, earlyGame: 8, midGame: 8, lateGame: 6 },
    { id: 'Orianna', name: 'Orianna', roles: ['MID'], class: 'MAGE', tags: ['CONTROL', 'WOMBO_ENABLER', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 10, lateGame: 9 },
    { id: 'Qiyana', name: 'Qiyana', roles: ['MID', 'JUNGLE'], class: 'ASSASSIN', tags: ['ASSASSIN', 'WOMBO_ENABLER', 'PROVIDES_KNOCKUP'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 10, lateGame: 7 },
    { id: 'Ryze', name: 'Ryze', roles: ['MID', 'TOP'], class: 'MAGE', tags: ['SCALING', 'WAVE_CLEAR', 'ROAMER'], damageType: 'AP', difficulty: 2, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Sylas', name: 'Sylas', roles: ['MID', 'TOP'], class: 'FIGHTER', tags: ['SKIRMISHER', 'STEAL_ULT'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 8 },
    { id: 'Syndra', name: 'Syndra', roles: ['MID'], class: 'MAGE', tags: ['BURST', 'CONTROL', 'SCALING'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 9 },
    { id: 'Talon', name: 'Talon', roles: ['MID', 'JUNGLE'], class: 'ASSASSIN', tags: ['ROAMER', 'ASSASSIN'], damageType: 'AD', difficulty: 2, earlyGame: 9, midGame: 8, lateGame: 4 },
    { id: 'TwistedFate', name: 'Twisted Fate', roles: ['MID'], class: 'MAGE', tags: ['GLOBAL', 'ROAMER', 'CC_RELIANT'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 8 },
    { id: 'Veigar', name: 'Veigar', roles: ['MID', 'SUPPORT'], class: 'MAGE', tags: ['SCALING', 'CONTROL', 'BURST'], damageType: 'AP', difficulty: 1, earlyGame: 3, midGame: 7, lateGame: 10 },
    { id: 'Velkoz', name: 'Vel\'Koz', roles: ['SUPPORT', 'MID'], class: 'MAGE', tags: ['POKE', 'ARTILLERY', 'TRUE_DAMAGE'], damageType: 'TRUE', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 8 },
    { id: 'Vex', name: 'Vex', roles: ['MID'], class: 'MAGE', tags: ['ANTI_DIVE', 'BURST', 'RESET'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 8, lateGame: 7 },
    { id: 'Viktor', name: 'Viktor', roles: ['MID'], class: 'MAGE', tags: ['CONTROL', 'SCALING', 'WAVE_CLEAR'], damageType: 'AP', difficulty: 3, earlyGame: 5, midGame: 9, lateGame: 10 },
    { id: 'Vladimir', name: 'Vladimir', roles: ['MID', 'TOP'], class: 'MAGE', tags: ['SCALING', 'HYPER_CARRY', 'SUSTAIN'], damageType: 'AP', difficulty: 2, earlyGame: 3, midGame: 7, lateGame: 10 },
    { id: 'Xerath', name: 'Xerath', roles: ['SUPPORT', 'MID'], class: 'MAGE', tags: ['POKE', 'ARTILLERY'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 8 },
    { id: 'Ziggs', name: 'Ziggs', roles: ['ADC', 'MID'], class: 'MAGE', tags: ['POKE', 'SIEGE', 'WAVE_CLEAR'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 8, lateGame: 7 },
    { id: 'Zoe', name: 'Zoe', roles: ['MID'], class: 'MAGE', tags: ['POKE', 'BURST', 'PICK'], damageType: 'AP', difficulty: 3, earlyGame: 9, midGame: 8, lateGame: 5 },

    // ADC
    { id: 'Aphelios', name: 'Aphelios', roles: ['ADC'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'IMMOBILE', 'SCALING'], damageType: 'AD', difficulty: 3, earlyGame: 4, midGame: 7, lateGame: 10 },
    { id: 'Ashe', name: 'Ashe', roles: ['ADC', 'SUPPORT'], class: 'MARKSMAN', tags: ['UTILITY', 'HARD_ENGAGE', 'POKE'], damageType: 'AD', difficulty: 1, earlyGame: 7, midGame: 6, lateGame: 7 },
    { id: 'Caitlyn', name: 'Caitlyn', roles: ['ADC'], class: 'MARKSMAN', tags: ['LANE_BULLY', 'SIEGE', 'POKE'], damageType: 'AD', difficulty: 2, earlyGame: 9, midGame: 6, lateGame: 9 },
    { id: 'Draven', name: 'Draven', roles: ['ADC'], class: 'MARKSMAN', tags: ['LANE_BULLY', 'SNOWBALL'], damageType: 'AD', difficulty: 3, earlyGame: 10, midGame: 8, lateGame: 6 },
    { id: 'Ezreal', name: 'Ezreal', roles: ['ADC'], class: 'MARKSMAN', tags: ['POKE', 'SAFE', 'SKIRMISHER'], damageType: 'MIXED', difficulty: 2, earlyGame: 6, midGame: 9, lateGame: 7 },
    { id: 'Jhin', name: 'Jhin', roles: ['ADC'], class: 'MARKSMAN', tags: ['UTILITY', 'CATCH', 'POKE'], damageType: 'AD', difficulty: 2, earlyGame: 7, midGame: 8, lateGame: 8 },
    { id: 'Jinx', name: 'Jinx', roles: ['ADC'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'RESET', 'AOE'], damageType: 'AD', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Kaisa', name: 'Kai\'Sa', roles: ['ADC'], class: 'MARKSMAN', tags: ['DIVER', 'HYPER_CARRY', 'HYBRID'], damageType: 'MIXED', difficulty: 3, earlyGame: 4, midGame: 9, lateGame: 10 },
    { id: 'Kalista', name: 'Kalista', roles: ['ADC'], class: 'MARKSMAN', tags: ['LANE_BULLY', 'HARD_ENGAGE', 'WOMBO_ENABLER'], damageType: 'AD', difficulty: 3, earlyGame: 9, midGame: 8, lateGame: 5 },
    { id: 'KogMaw', name: 'Kog\'Maw', roles: ['ADC'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'TANK_BUSTER', 'IMMOBILE'], damageType: 'MIXED', difficulty: 2, earlyGame: 3, midGame: 7, lateGame: 10 },
    { id: 'Lucian', name: 'Lucian', roles: ['ADC', 'MID'], class: 'MARKSMAN', tags: ['LANE_BULLY', 'BURST', 'SKIRMISHER'], damageType: 'AD', difficulty: 2, earlyGame: 9, midGame: 8, lateGame: 5 },
    { id: 'MissFortune', name: 'Miss Fortune', roles: ['ADC'], class: 'MARKSMAN', tags: ['WOMBO_ENABLER', 'LANE_BULLY', 'AOE'], damageType: 'AD', difficulty: 1, earlyGame: 8, midGame: 9, lateGame: 6 },
    { id: 'Nilah', name: 'Nilah', roles: ['ADC'], class: 'FIGHTER', tags: ['DIVER', 'WOMBO_ENABLER', 'SKIRMISHER'], damageType: 'AD', difficulty: 2, earlyGame: 5, midGame: 9, lateGame: 9 },
    { id: 'Samira', name: 'Samira', roles: ['ADC'], class: 'MARKSMAN', tags: ['NEEDS_KNOCKUP', 'RESET', 'DIVER'], damageType: 'AD', difficulty: 3, earlyGame: 5, midGame: 9, lateGame: 8 },
    { id: 'Sivir', name: 'Sivir', roles: ['ADC'], class: 'MARKSMAN', tags: ['WAVE_CLEAR', 'UTILITY', 'AOE'], damageType: 'AD', difficulty: 1, earlyGame: 6, midGame: 8, lateGame: 9 },
    { id: 'Smolder', name: 'Smolder', roles: ['ADC', 'MID'], class: 'MARKSMAN', tags: ['SCALING', 'POKE', 'EXECUTE'], damageType: 'AD', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Tristana', name: 'Tristana', roles: ['ADC', 'MID'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'RESET', 'SIEGE'], damageType: 'AD', difficulty: 1, earlyGame: 6, midGame: 8, lateGame: 10 },
    { id: 'Twitch', name: 'Twitch', roles: ['ADC', 'JUNGLE'], class: 'MARKSMAN', tags: ['ASSASSIN', 'HYPER_CARRY', 'STEALTH'], damageType: 'AD', difficulty: 2, earlyGame: 3, midGame: 7, lateGame: 10 },
    { id: 'Varus', name: 'Varus', roles: ['ADC', 'MID'], class: 'MARKSMAN', tags: ['POKE', 'CC_RELIANT', 'HYBRID'], damageType: 'MIXED', difficulty: 2, earlyGame: 7, midGame: 8, lateGame: 7 },
    { id: 'Xayah', name: 'Xayah', roles: ['ADC'], class: 'MARKSMAN', tags: ['SAFETY', 'DISENGAGE', 'WAVE_CLEAR'], damageType: 'AD', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 9 },
    { id: 'Zeri', name: 'Zeri', roles: ['ADC'], class: 'MARKSMAN', tags: ['HYPER_CARRY', 'SKIRMISHER'], damageType: 'MIXED', difficulty: 3, earlyGame: 5, midGame: 9, lateGame: 10 },

    // SUPPORT
    { id: 'Alistar', name: 'Alistar', roles: ['SUPPORT'], class: 'TANK', tags: ['HARD_ENGAGE', 'PEEL', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 1, earlyGame: 6, midGame: 8, lateGame: 8 },
    { id: 'Bard', name: 'Bard', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['ROAMER', 'PLAYMAKER', 'CATCH'], damageType: 'AP', difficulty: 3, earlyGame: 7, midGame: 9, lateGame: 8 },
    { id: 'Blitzcrank', name: 'Blitzcrank', roles: ['SUPPORT'], class: 'TANK', tags: ['HOOK', 'PICK', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 1, earlyGame: 9, midGame: 7, lateGame: 5 },
    { id: 'Brand', name: 'Brand', roles: ['SUPPORT', 'JUNGLE', 'MID'], class: 'MAGE', tags: ['POKE', 'AOE', 'TANK_BUSTER'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 8 },
    { id: 'Braum', name: 'Braum', roles: ['SUPPORT'], class: 'TANK', tags: ['PEEL', 'DISENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 9 },
    { id: 'Janna', name: 'Janna', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['PEEL', 'DISENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 9 },
    { id: 'Karma', name: 'Karma', roles: ['SUPPORT', 'MID'], class: 'ENCHANTER', tags: ['POKE', 'LANE_BULLY', 'SPEED'], damageType: 'AP', difficulty: 1, earlyGame: 9, midGame: 7, lateGame: 6 },
    { id: 'Leona', name: 'Leona', roles: ['SUPPORT'], class: 'TANK', tags: ['HARD_ENGAGE', 'LOCKDOWN'], damageType: 'AP', difficulty: 1, earlyGame: 8, midGame: 8, lateGame: 7 },
    { id: 'Lulu', name: 'Lulu', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['PEEL', 'HYPER_CARRY_BUFFER', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 8 },
    { id: 'Milio', name: 'Milio', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['PEEL', 'ANTI_CC', 'RANGE_BUFF'], damageType: 'AP', difficulty: 1, earlyGame: 7, midGame: 9, lateGame: 8 },
    { id: 'Morgana', name: 'Morgana', roles: ['SUPPORT', 'JUNGLE'], class: 'MAGE', tags: ['CATCH', 'ANTI_CC', 'BIND'], damageType: 'AP', difficulty: 1, earlyGame: 7, midGame: 8, lateGame: 7 },
    { id: 'Nami', name: 'Nami', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['LANE_BULLY', 'PROVIDES_KNOCKUP', 'SUSTAIN'], damageType: 'AP', difficulty: 2, earlyGame: 8, midGame: 8, lateGame: 7 },
    { id: 'Nautilus', name: 'Nautilus', roles: ['SUPPORT'], class: 'TANK', tags: ['HOOK', 'HARD_ENGAGE', 'PROVIDES_KNOCKUP'], damageType: 'AP', difficulty: 1, earlyGame: 9, midGame: 8, lateGame: 7 },
    { id: 'Pyke', name: 'Pyke', roles: ['SUPPORT'], class: 'ASSASSIN', tags: ['HOOK', 'ASSASSIN', 'ROAMER'], damageType: 'AD', difficulty: 3, earlyGame: 10, midGame: 7, lateGame: 4 },
    { id: 'Rakan', name: 'Rakan', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['HARD_ENGAGE', 'PROVIDES_KNOCKUP', 'MOBILITY'], damageType: 'AP', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 8 },
    { id: 'Rell', name: 'Rell', roles: ['SUPPORT'], class: 'TANK', tags: ['HARD_ENGAGE', 'WOMBO_ENABLER', 'SHIELD_BREAKER'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 7 },
    { id: 'Renata', name: 'Renata Glasc', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['DISENGAGE', 'REVIVE', 'ANTI_CARRY'], damageType: 'AP', difficulty: 3, earlyGame: 6, midGame: 9, lateGame: 9 },
    { id: 'Senna', name: 'Senna', roles: ['SUPPORT', 'ADC'], class: 'MARKSMAN', tags: ['SCALING', 'POKE', 'HEAL'], damageType: 'AD', difficulty: 2, earlyGame: 6, midGame: 8, lateGame: 10 },
    { id: 'Seraphine', name: 'Seraphine', roles: ['SUPPORT', 'MID', 'ADC'], class: 'MAGE', tags: ['WOMBO_ENABLER', 'SHIELD', 'POKE'], damageType: 'AP', difficulty: 1, earlyGame: 5, midGame: 9, lateGame: 9 },
    { id: 'Sona', name: 'Sona', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['SCALING', 'WOMBO_ENABLER', 'HEAL'], damageType: 'AP', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Soraka', name: 'Soraka', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['HEAL', 'GLOBAL', 'POKE'], damageType: 'AP', difficulty: 1, earlyGame: 8, midGame: 7, lateGame: 8 },
    { id: 'Swain', name: 'Swain', roles: ['SUPPORT', 'MID', 'TOP'], class: 'MAGE', tags: ['DRAIN_TANK', 'HOOK', 'AOE'], damageType: 'AP', difficulty: 2, earlyGame: 7, midGame: 9, lateGame: 7 },
    { id: 'Taric', name: 'Taric', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['PEEL', 'INVULNERABILITY', 'RESET'], damageType: 'AP', difficulty: 2, earlyGame: 5, midGame: 8, lateGame: 10 },
    { id: 'Thresh', name: 'Thresh', roles: ['SUPPORT'], class: 'TANK', tags: ['HOOK', 'PEEL', 'PLAYMAKER'], damageType: 'AP', difficulty: 3, earlyGame: 8, midGame: 9, lateGame: 8 },
    { id: 'Yuumi', name: 'Yuumi', roles: ['SUPPORT'], class: 'ENCHANTER', tags: ['UNTARGETABLE', 'SCALING', 'HYPER_CARRY_BUFFER'], damageType: 'AP', difficulty: 1, earlyGame: 4, midGame: 8, lateGame: 10 },
    { id: 'Zilean', name: 'Zilean', roles: ['SUPPORT', 'MID'], class: 'SPECIALIST', tags: ['REVIVE', 'SPEED', 'CONTROL'], damageType: 'AP', difficulty: 2, earlyGame: 5, midGame: 8, lateGame: 10 },
    { id: 'Zyra', name: 'Zyra', roles: ['SUPPORT', 'MID'], class: 'MAGE', tags: ['POKE', 'DISENGAGE', 'CATCH'], damageType: 'AP', difficulty: 2, earlyGame: 9, midGame: 8, lateGame: 6 }
];