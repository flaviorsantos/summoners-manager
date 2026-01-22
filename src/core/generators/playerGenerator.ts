import { v4 as uuidv4 } from 'uuid';
import type { Player, PlayerRole, PlayerAttributes } from '../domain/Player';
import { CHAMPIONS_DB } from '../domain/Champions';

const FIRST_NAMES = ['Gabriel', 'Lucas', 'Matheus', 'Felipe', 'Bruno', 'Leonardo', 'Rodrigo', 'Thiago', 'Arthur', 'Davi'];
const NICKS = ['Robo', 'Tinowns', 'Titan', 'Cariok', 'Ceos', 'Brance', 'Aegis', 'Wizer', 'Route', 'Dynquedo'];

export const playerGenerator = {
    generateRoster(size: number): Player[] {
        const roles: PlayerRole[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
        const roster: Player[] = [];

        roles.forEach(role => roster.push(this.generatePlayer(role)));

        for(let i = 5; i < size; i++) {
            roster.push(this.generatePlayer(roles[i % 5]));
        }

        return roster;
    },

    generatePlayer(role: PlayerRole): Player {
        const age = Math.floor(Math.random() * 8) + 17; 
        
        const genAttr = () => Math.floor(Math.random() * 40) + 50; 
        
        const attributes: PlayerAttributes = {
            laning: genAttr(),
            mechanics: genAttr(),
            aggression: Math.floor(Math.random() * 100), 
            positioning: genAttr(),
            shotcalling: genAttr(),
            vision: genAttr()
        };

        const overall = Math.floor(
            (attributes.laning * 1.5 + attributes.mechanics * 1.5 + attributes.positioning + attributes.shotcalling + attributes.vision) / 5.5
        );

        return {
            id: uuidv4(),
            name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]}`,
            nickname: `${NICKS[Math.floor(Math.random() * NICKS.length)]}`,
            age,
            role,
            attributes,
            overall,
            potential: overall + Math.floor(Math.random() * 15),
            salary: overall * 1000,
            contractExpires: 2026 + Math.floor(Math.random() * 3),
            morale: 100,
            championPool: this.generatePool(role)
        };
    },

    generatePool(role: PlayerRole) {
        const validChamps = CHAMPIONS_DB.filter(c => c.roles.includes(role));
        const poolSize = 5 + Math.floor(Math.random() * 5);
        
        const shuffled = [...validChamps].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, poolSize).map(c => ({
            championName: c.name,
            masteryLevel: Math.floor(Math.random() * 10000) + 500 
        }));
    }
};