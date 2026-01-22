import { v4 as uuidv4 } from 'uuid';
import type { Team } from '../domain/Team';
import { playerGenerator } from './playerGenerator';

// Dados mockados para gerar times com nomes legais
const TEAM_NAMES = [
    { name: 'Red Canids', acronym: 'RED', p: '#FF0000', s: '#000000' },
    { name: 'paiN Gaming', acronym: 'PNG', p: '#000000', s: '#FF0000' },
    { name: 'LOUD', acronym: 'LLL', p: '#00FF00', s: '#000000' },
    { name: 'FURIA', acronym: 'FUR', p: '#000000', s: '#FFFFFF' },
    { name: 'KaBuM!', acronym: 'KBM', p: '#FF6600', s: '#000000' },
    { name: 'INTZ', acronym: 'ITZ', p: '#FFFFFF', s: '#000000' },
    { name: 'Vivo Keyd', acronym: 'VKS', p: '#800080', s: '#FFFF00' },
    { name: 'Fluxo', acronym: 'FX', p: '#330066', s: '#FFFFFF' },
    { name: 'Liberty', acronym: 'LBR', p: '#0000FF', s: '#FFFFFF' },
    { name: 'Los Grandes', acronym: 'LOS', p: '#FF4500', s: '#000000' }
];

export const teamGenerator = {
    generateLeague(): Team[] {
        return TEAM_NAMES.map(t => ({
            id: uuidv4(),
            name: t.name,
            acronym: t.acronym,
            primaryColor: t.p,
            secondaryColor: t.s,
            prestige: Math.floor(Math.random() * 50) + 50,
            budget: 10000000,
            stats: {
                wins: 0,
                losses: 0,
                championshipPoints: 0
            },
            roster: playerGenerator.generateRoster(7) 
        }));
    }
};