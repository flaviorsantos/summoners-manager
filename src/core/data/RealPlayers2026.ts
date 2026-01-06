import type { Role } from "../domain/Player";

export interface RealPlayerBase {
    nickname: string;
    name: string;
    role: Role;
    teamId: string;
    age: number;
    overall: number;
    potential: number;
    country: string;
}

export const REAL_PLAYERS_2026: RealPlayerBase[] = [
    // --- PAIN GAMING (PNG) ---
    { nickname: "Robo", name: "Leonardo Souza", role: "TOP", teamId: "PNG", age: 27, overall: 91, potential: 91, country: "BR" },
    { nickname: "Cariok", name: "Marcos Oliveira", role: "JUNGLE", teamId: "PNG", age: 26, overall: 89, potential: 90, country: "BR" },
    { nickname: "Tinowns", name: "Thiago Sartori", role: "MID", teamId: "PNG", age: 28, overall: 92, potential: 92, country: "BR" },
    { nickname: "TitaN", name: "Alexandre Lima", role: "ADC", teamId: "PNG", age: 25, overall: 92, potential: 94, country: "BR" },
    { nickname: "Kuri", name: "Choi Won-yeong", role: "SUPPORT", teamId: "PNG", age: 25, overall: 89, potential: 91, country: "KR" },

    // --- LOUD (LLL) ---
    { nickname: "xyno", name: "Gabriel de Oliveira", role: "TOP", teamId: "LLL", age: 21, overall: 84, potential: 89, country: "BR" },
    { nickname: "YoungJae", name: "Go Young-jae", role: "JUNGLE", teamId: "LLL", age: 23, overall: 88, potential: 90, country: "KR" },
    { nickname: "Jean Mago", name: "Jean Mago", role: "MID", teamId: "LLL", age: 22, overall: 86, potential: 92, country: "BR" },
    { nickname: "Bull", name: "Lim Geun-hee", role: "ADC", teamId: "LLL", age: 22, overall: 87, potential: 90, country: "KR" },
    { nickname: "RedBert", name: "Ygor Freitas", role: "SUPPORT", teamId: "LLL", age: 27, overall: 85, potential: 85, country: "BR" },

    // --- VIVO KEYD STARS (VKS) ---
    { nickname: "Guigo", name: "Guilherme Ruiz", role: "TOP", teamId: "VKS", age: 24, overall: 86, potential: 88, country: "BR" },
    { nickname: "Disamis", name: "Pedro Gonçalves", role: "JUNGLE", teamId: "VKS", age: 22, overall: 87, potential: 91, country: "BR" },
    { nickname: "Mireu", name: "Jeong Jo-bin", role: "MID", teamId: "VKS", age: 24, overall: 89, potential: 91, country: "KR" },
    { nickname: "Morttheus", name: "Matheus Marcondes", role: "ADC", teamId: "VKS", age: 21, overall: 85, potential: 90, country: "BR" },
    { nickname: "Kaiwing", name: "Ling Kai Wing", role: "SUPPORT", teamId: "VKS", age: 28, overall: 88, potential: 88, country: "HK" },

    // --- FLUXO W7M (FW7M) ---
    { nickname: "Curty", name: "Pedro Henrique Silveira", role: "TOP", teamId: "FW7M", age: 20, overall: 82, potential: 88, country: "BR" },
    { nickname: "Peach", name: "Kim Min-cheol", role: "JUNGLE", teamId: "FW7M", age: 26, overall: 88, potential: 89, country: "KR" },
    { nickname: "Hauz", name: "Bruno Felberge", role: "MID", teamId: "FW7M", age: 24, overall: 86, potential: 88, country: "BR" },
    { nickname: "Bao", name: "Jeong Hyeon-woo", role: "ADC", teamId: "FW7M", age: 24, overall: 88, potential: 90, country: "KR" },
    { nickname: "ProDelta", name: "Fábio Marques", role: "SUPPORT", teamId: "FW7M", age: 23, overall: 86, potential: 90, country: "BR" },

    // --- LOS GRANDES (LOS) ---
    { nickname: "Zest", name: "Kim Dong-min", role: "TOP", teamId: "LOS", age: 23, overall: 85, potential: 88, country: "KR" },
    { nickname: "Drakehero", name: "Leandro Paes", role: "JUNGLE", teamId: "LOS", age: 20, overall: 81, potential: 89, country: "BR" },
    { nickname: "Feisty", name: "Jeong Seong-hoon", role: "MID", teamId: "LOS", age: 21, overall: 85, potential: 90, country: "KR" },
    { nickname: "duduhh", name: "Wallyson Francisco", role: "ADC", teamId: "LOS", age: 18, overall: 80, potential: 92, country: "BR" },
    { nickname: "Ackerman", name: "Gabriel Aparicio", role: "SUPPORT", teamId: "LOS", age: 23, overall: 84, potential: 86, country: "AR" },

    // --- LEVIATÁN (LEV) ---
    { nickname: "Zothve", name: "Breno Lucca", role: "TOP", teamId: "LEV", age: 22, overall: 83, potential: 87, country: "BR" },
    { nickname: "Scary", name: "Gabriel de Castro", role: "JUNGLE", teamId: "LEV", age: 22, overall: 82, potential: 86, country: "BR" },
    { nickname: "TopLop", name: "Francisco Gabriel", role: "MID", teamId: "LEV", age: 23, overall: 84, potential: 86, country: "BR" },
    { nickname: "Ceo", name: "Matías Mirne", role: "ADC", teamId: "LEV", age: 22, overall: 88, potential: 91, country: "AR" },
    { nickname: "Guchi", name: "Bautista Bartomeus", role: "SUPPORT", teamId: "LEV", age: 21, overall: 82, potential: 85, country: "AR" },

    // --- RED CANIDS (RED) ---
    { nickname: "fNb", name: "Francisco Natanael", role: "TOP", teamId: "RED", age: 26, overall: 88, potential: 90, country: "BR" },
    { nickname: "DOOM", name: "Kim Do-hoon", role: "JUNGLE", teamId: "RED", age: 22, overall: 85, potential: 89, country: "KR" },
    { nickname: "Kaze", name: "Guilherme de Castro", role: "MID", teamId: "RED", age: 23, overall: 83, potential: 87, country: "BR" },
    { nickname: "Rabelo", name: "Matheus Rabelo", role: "ADC", teamId: "RED", age: 21, overall: 84, potential: 91, country: "BR" },
    { nickname: "Frosty", name: "Vinicius Rosa", role: "SUPPORT", teamId: "RED", age: 21, overall: 83, potential: 89, country: "BR" },

    // --- FURIA (FUR) ---
    { nickname: "Zary", name: "César Bertelli", role: "TOP", teamId: "FUR", age: 23, overall: 84, potential: 88, country: "BR" },
    { nickname: "Tatu", name: "Gabriel de Jesus", role: "JUNGLE", teamId: "FUR", age: 20, overall: 82, potential: 89, country: "BR" },
    { nickname: "Tutsz", name: "Arthur Machado", role: "MID", teamId: "FUR", age: 24, overall: 86, potential: 89, country: "BR" },
    { nickname: "Ayu", name: "Andrey Saraiva", role: "ADC", teamId: "FUR", age: 21, overall: 86, potential: 91, country: "BR" },
    { nickname: "JoJo", name: "Vinícius Paiva", role: "SUPPORT", teamId: "FUR", age: 26, overall: 85, potential: 86, country: "BR" },

    // --- FREE AGENTS (MERCADO - 50 JOGADORES) ---
    // Tops
    { nickname: "Wizer", name: "Choi Eui-seok", role: "TOP", teamId: "Free Agent", age: 26, overall: 89, potential: 89, country: "KR" },
    { nickname: "Lonely", name: "Han Gyu-jun", role: "TOP", teamId: "Free Agent", age: 25, overall: 85, potential: 87, country: "KR" },
    { nickname: "Tay", name: "Rodrigo Panisa", role: "TOP", teamId: "Free Agent", age: 28, overall: 83, potential: 83, country: "BR" },
    { nickname: "Parang", name: "Lee Sang-won", role: "TOP", teamId: "Free Agent", age: 27, overall: 86, potential: 86, country: "KR" },
    { nickname: "Makes", name: "Gabriel Nemeth", role: "TOP", teamId: "Free Agent", age: 21, overall: 81, potential: 86, country: "BR" },
    { nickname: "Betão", name: "Humberto Milas", role: "TOP", teamId: "Free Agent", age: 22, overall: 80, potential: 85, country: "BR" },
    { nickname: "SuperCleber", name: "Cleber Nantes", role: "TOP", teamId: "Free Agent", age: 22, overall: 82, potential: 87, country: "BR" },
    { nickname: "Zzk", name: "Rick de Oliveira", role: "TOP", teamId: "Free Agent", age: 23, overall: 79, potential: 83, country: "BR" },
    { nickname: "Hidan", name: "Enzo Nakazawa", role: "TOP", teamId: "Free Agent", age: 21, overall: 78, potential: 84, country: "BR" },
    { nickname: "Acce", name: "Emmanuel Juárez", role: "TOP", teamId: "Free Agent", age: 30, overall: 80, potential: 80, country: "AR" },

    // Junglers
    { nickname: "Aegis", name: "Gabriel Lemos", role: "JUNGLE", teamId: "Free Agent", age: 25, overall: 86, potential: 89, country: "BR" },
    { nickname: "Croc", name: "Park Jong-hoon", role: "JUNGLE", teamId: "Free Agent", age: 27, overall: 90, potential: 90, country: "KR" },
    { nickname: "Malrang", name: "Kim Geun-seong", role: "JUNGLE", teamId: "Free Agent", age: 26, overall: 88, potential: 88, country: "KR" },
    { nickname: "Yampi", name: "Yan Petermann", role: "JUNGLE", teamId: "Free Agent", age: 26, overall: 83, potential: 84, country: "BR" },
    { nickname: "Revolta", name: "Gabriel Henud", role: "JUNGLE", teamId: "Free Agent", age: 31, overall: 80, potential: 80, country: "BR" },
    { nickname: "Ranger", name: "Filipe Brombilla", role: "JUNGLE", teamId: "Free Agent", age: 30, overall: 81, potential: 81, country: "BR" },
    { nickname: "Shini", name: "Diogo Rogê", role: "JUNGLE", teamId: "Free Agent", age: 29, overall: 79, potential: 79, country: "BR" },
    { nickname: "St1ng", name: "Luís Dirami", role: "JUNGLE", teamId: "Free Agent", age: 21, overall: 80, potential: 86, country: "BR" },
    { nickname: "Stiner", name: "Vinicius Dias", role: "JUNGLE", teamId: "Free Agent", age: 22, overall: 78, potential: 84, country: "BR" },
    { nickname: "SrVenancio", name: "Samuel Venâncio", role: "JUNGLE", teamId: "Free Agent", age: 21, overall: 77, potential: 86, country: "BR" },

    // Mids
    { nickname: "Grevthar", name: "Daniel Xavier", role: "MID", teamId: "Free Agent", age: 27, overall: 84, potential: 85, country: "BR" },
    { nickname: "Envy", name: "Bruno Farias", role: "MID", teamId: "Free Agent", age: 26, overall: 85, potential: 87, country: "BR" },
    { nickname: "Kami", name: "Gabriel Bohm", role: "MID", teamId: "Free Agent", age: 30, overall: 84, potential: 84, country: "BR" },
    { nickname: "Fuuu", name: "Gabriel Furuuti", role: "MID", teamId: "Free Agent", age: 20, overall: 82, potential: 90, country: "BR" },
    { nickname: "Piloto", name: "Giuliano Longo", role: "MID", teamId: "Free Agent", age: 22, overall: 81, potential: 88, country: "BR" },
    { nickname: "Nojima", name: "João Nojima", role: "MID", teamId: "Free Agent", age: 22, overall: 81, potential: 86, country: "BR" },
    { nickname: "Keine", name: "Kim Joon-cheol", role: "MID", teamId: "Free Agent", age: 26, overall: 84, potential: 85, country: "KR" },
    { nickname: "Blacky", name: "Matheus Lessa", role: "MID", teamId: "Free Agent", age: 25, overall: 79, potential: 81, country: "BR" },
    { nickname: "Tolhu", name: "Nicolas Saggiorato", role: "MID", teamId: "Free Agent", age: 21, overall: 76, potential: 86, country: "BR" },
    { nickname: "Leleko", name: "Alex Santos", role: "MID", teamId: "Free Agent", age: 23, overall: 78, potential: 83, country: "BR" },

    // ADCs
    { nickname: "Brance", name: "Diego Amaral", role: "ADC", teamId: "Free Agent", age: 22, overall: 89, potential: 93, country: "BR" },
    { nickname: "Netuno", name: "Lucas Flores", role: "ADC", teamId: "Free Agent", age: 23, overall: 87, potential: 90, country: "BR" },
    { nickname: "Route", name: "Moon Geom-su", role: "ADC", teamId: "Free Agent", age: 26, overall: 92, potential: 92, country: "KR" },
    { nickname: "Trigo", name: "Matheus Trigo", role: "ADC", teamId: "Free Agent", age: 25, overall: 84, potential: 86, country: "BR" },
    { nickname: "Micão", name: "Micael Rodrigues", role: "ADC", teamId: "Free Agent", age: 30, overall: 81, potential: 81, country: "BR" },
    { nickname: "NinjaKiwi", name: "Yudi Kajimura", role: "ADC", teamId: "Free Agent", age: 21, overall: 82, potential: 88, country: "BR" },
    { nickname: "Snaker", name: "Tiago Oliveira", role: "ADC", teamId: "Free Agent", age: 24, overall: 83, potential: 85, country: "BR" },
    { nickname: "Absolut", name: "Daniel Michel", role: "ADC", teamId: "Free Agent", age: 28, overall: 80, potential: 80, country: "BR" },
    { nickname: "Mortred", name: "Yago Santos", role: "ADC", teamId: "Free Agent", age: 22, overall: 79, potential: 84, country: "BR" },
    { nickname: "Babsy", name: "Gabriel de Castro", role: "ADC", teamId: "Free Agent", age: 20, overall: 78, potential: 88, country: "BR" },

    // Supports
    { nickname: "Ceos", name: "Denilson Oliveira", role: "SUPPORT", teamId: "Free Agent", age: 27, overall: 90, potential: 90, country: "BR" },
    { nickname: "Jojo", name: "Gabriel Dzelme", role: "SUPPORT", teamId: "Free Agent", age: 27, overall: 86, potential: 86, country: "BR" },
    { nickname: "Damage", name: "Yan Sales", role: "SUPPORT", teamId: "Free Agent", age: 26, overall: 84, potential: 86, country: "BR" },
    { nickname: "Scuro", name: "Pedro Augusto", role: "SUPPORT", teamId: "Free Agent", age: 24, overall: 83, potential: 85, country: "BR" },
    { nickname: "Scamber", name: "Rafael de Oliveira", role: "SUPPORT", teamId: "Free Agent", age: 24, overall: 81, potential: 84, country: "BR" },
    { nickname: "Nia", name: "Woo Jun-sung", role: "SUPPORT", teamId: "Free Agent", age: 25, overall: 84, potential: 87, country: "KR" },
    { nickname: "Zay", name: "Vinicius Viana", role: "SUPPORT", teamId: "Free Agent", age: 23, overall: 82, potential: 88, country: "BR" },
    { nickname: "Kravitz", name: "Luiz de Castro", role: "SUPPORT", teamId: "Free Agent", age: 22, overall: 79, potential: 86, country: "BR" },
    { nickname: "Baiano", name: "Gustavo Gomes", role: "SUPPORT", teamId: "Free Agent", age: 31, overall: 78, potential: 78, country: "BR" },
    { nickname: "Wos", name: "Willyan Bonpam", role: "SUPPORT", teamId: "Free Agent", age: 29, overall: 80, potential: 80, country: "BR" }
];