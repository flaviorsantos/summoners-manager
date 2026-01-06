export type FocusLane = 'STANDARD' | 'TOP' | 'JUNGLE' | 'MID' | 'BOT';
export type PlayStyle = 'BALANCED' | 'AGGRESSIVE' | 'DEFENSIVE' | 'SCALING';

export interface GameTactics {
    focus: FocusLane;       
    style: PlayStyle;       
}

export const TACTIC_DESCRIPTIONS: Record<string, string> = {
    'STANDARD': "Standard lanes. Jungler reacts to map.",
    'TOP': "Jungler camps Top. Bot lane plays weakside.",
    'MID': "Jungler hovers Mid. 2v2 synergy focus.",
    'BOT': "Jungler camps Bot. Top lane plays weakside.",
    'JUNGLE': "Team invades with Jungler. Focus on neutral objectives.",
    
    'BALANCED': "Normal decision making.",
    'AGGRESSIVE': "Force plays and dives. High kills, high deaths.",
    'DEFENSIVE': "Avoid risks. High CS, low deaths, give objectives if needed.",
    'SCALING': "Play purely for late game. Avoid early fights."
};