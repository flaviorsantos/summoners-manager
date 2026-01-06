<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { formatMoney, getRatingColorClass } from '@/core/utils/formatters';
import { CHAMPIONS_DB } from '@/core/domain/Champions';

const route = useRoute();
const router = useRouter();
const store = useGameStore();

type Tab = 'overview' | 'stats' | 'history';
const activeTab = ref<Tab>('overview');

const player = computed(() => {
    return store.players.find(p => p.id === route.params.id);
});

// --- HELPERS VISUAIS ---

// Traduz nível numérico para Texto Qualitativo
const getMasteryText = (level: number) => {
    if (level >= 95) return { label: 'Legendary', color: 'text-yellow-400 font-black' };
    if (level >= 85) return { label: 'World Class', color: 'text-purple-400 font-bold' };
    if (level >= 75) return { label: 'Excellent', color: 'text-blue-400 font-bold' };
    if (level >= 60) return { label: 'Good', color: 'text-green-400' };
    if (level >= 45) return { label: 'Decent', color: 'text-gray-300' };
    if (level >= 30) return { label: 'Learning', color: 'text-orange-400' };
    return { label: 'Novice', color: 'text-red-500' };
};

const getChampImage = (champName: string) => {
    const champ = CHAMPIONS_DB.find(c => c.name === champName);
    const id = champ ? champ.id : champName.replace(/[^a-zA-Z0-9]/g, ''); 
    return `https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/${id}.png`;
};

const getKda = (k: number, d: number, a: number) => {
    return ((k + a) / Math.max(1, d)).toFixed(2);
};

const openMatch = (matchId: string) => {
    router.push(`/match/${matchId}`);
};

// --- ESTATÍSTICAS AGREGADAS ---
const seasonStats = computed(() => {
    if (!player.value || !player.value.matchHistory) return [];

    const statsMap = new Map<string, {
        name: string, games: number, wins: number, 
        kills: number, deaths: number, assists: number, 
        cs: number, damage: number, gold: number
    }>();

    player.value.matchHistory.forEach(match => {
        const champ = match.championName;
        if (!statsMap.has(champ)) {
            statsMap.set(champ, { 
                name: champ, games: 0, wins: 0, 
                kills: 0, deaths: 0, assists: 0, 
                cs: 0, damage: 0, gold: 0 
            });
        }
        const entry = statsMap.get(champ)!;
        entry.games++;
        if (match.result === 'WIN') entry.wins++;
        entry.kills += match.kills;
        entry.deaths += match.deaths;
        entry.assists += match.assists;
        entry.cs += match.cs;
        entry.damage += match.damage;
        entry.gold += match.gold;
    });

    return Array.from(statsMap.values()).sort((a, b) => b.games - a.games);
});

// Grupos de Atributos (Divididos para 2 Colunas)
const leftAttributes = computed(() => {
    if (!player.value) return [];
    const a = player.value.attributes;
    return [
        { label: 'Laning', val: a.laning },
        { label: 'Farming', val: a.farming },
        { label: 'Mechanics', val: a.mechanics },
        { label: 'Reflexes', val: a.reflexes },
        { label: 'Aggression', val: a.aggression }
    ];
});

const rightAttributes = computed(() => {
    if (!player.value) return [];
    const a = player.value.attributes;
    return [
        { label: 'Macro Game', val: a.macro },
        { label: 'Vision Control', val: a.vision },
        { label: 'Roaming', val: a.roaming },
        { label: 'Shotcalling', val: a.shotcalling },
        { label: 'Teamfighting', val: a.teamfight }
    ];
});
</script>

<template>
    <GameLayout>
        <div v-if="player" class="max-w-6xl mx-auto animate-fade-in pb-10">
            
            <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg relative overflow-hidden">
                <div class="absolute top-0 right-0 p-32 bg-gray-700/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div class="flex gap-6 items-center relative z-10">
                    <div class="w-24 h-24 bg-gray-900 rounded-lg border-2 border-gray-600 flex items-center justify-center relative shadow-lg">
                        <div class="text-4xl font-black text-gray-700">{{ player.role[0] }}</div>
                        <div class="absolute -bottom-2 -right-2 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow">
                            {{ player.role }}
                        </div>
                    </div>
                    
                    <div>
                        <h1 class="text-4xl font-black text-white mb-1 tracking-tight">{{ player.nickname }}</h1>
                        <p class="text-lg text-gray-400 font-medium mb-3">{{ player.name }} <span class="text-gray-600 text-sm ml-1">({{ player.age }} years)</span></p>
                        <div class="flex gap-3">
                            <div class="px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                <span>{{ store.getTeamName(player.team) }}</span>
                            </div>
                            <div class="px-3 py-1 rounded bg-green-900/20 border border-green-800 text-green-400 text-xs font-mono font-bold">
                                {{ formatMoney(player.contract.salary) }}/yr
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-6 text-center bg-gray-900/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm relative z-10">
                    <div>
                        <div class="text-5xl font-black tracking-tighter" :class="getRatingColorClass(player.overall)">{{ player.overall }}</div>
                        <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Overall</div>
                    </div>
                    <div class="w-px bg-gray-700"></div>
                    <div>
                        <div class="text-5xl font-black tracking-tighter" :class="getRatingColorClass(player.potential)">{{ player.potential }}</div>
                        <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Potential</div>
                    </div>
                </div>
            </div>

            <div class="flex border-b border-gray-700 mb-6 gap-8 px-2">
                <button 
                    v-for="tab in ['overview', 'stats', 'history']" :key="tab"
                    @click="activeTab = tab as Tab"
                    class="pb-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2"
                    :class="activeTab === tab ? 'text-blue-400 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'"
                >
                    {{ tab }}
                </button>
            </div>

            <div class="min-h-100">
                
                <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    
                    <div class="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <h3 class="text-gray-400 text-xs font-bold uppercase mb-6 border-b border-gray-700 pb-2">Player Attributes</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            <div class="space-y-1">
                                <div v-for="attr in leftAttributes" :key="attr.label" 
                                     class="flex justify-between items-center py-2 border-b border-gray-700/50 hover:bg-gray-700/30 px-2 rounded transition-colors">
                                    <span class="text-sm text-gray-400 font-bold uppercase">{{ attr.label }}</span>
                                    <span class="text-lg font-black font-mono" :class="getRatingColorClass(attr.val)">{{ attr.val }}</span>
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <div v-for="attr in rightAttributes" :key="attr.label" 
                                     class="flex justify-between items-center py-2 border-b border-gray-700/50 hover:bg-gray-700/30 px-2 rounded transition-colors">
                                    <span class="text-sm text-gray-400 font-bold uppercase">{{ attr.label }}</span>
                                    <span class="text-lg font-black font-mono" :class="getRatingColorClass(attr.val)">{{ attr.val }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="bg-gray-800 rounded-lg border border-gray-700 p-5 h-fit">
                            <h3 class="text-gray-400 text-xs font-bold uppercase mb-4 border-b border-gray-700 pb-2">Champion Pool</h3>
                            <div class="space-y-3">
                                <div v-for="champ in player.championPool.sort((a,b) => b.masteryLevel - a.masteryLevel).slice(0, 8)" 
                                     :key="champ.championName" 
                                     class="flex items-center gap-3 bg-gray-900/50 p-2 rounded border border-gray-800 hover:border-gray-600 transition-colors">
                                    
                                    <img :src="getChampImage(champ.championName)" class="w-10 h-10 rounded object-cover">
                                    
                                    <div class="flex-1 flex justify-between items-center">
                                        <div class="text-sm font-bold text-gray-200">{{ champ.championName }}</div>
                                        <div class="text-xs uppercase" :class="getMasteryText(champ.masteryLevel).color">
                                            {{ getMasteryText(champ.masteryLevel).label }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="player.championPool.length === 0" class="text-gray-500 text-sm italic p-2">
                                    Unknown pool.
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 rounded-lg border border-gray-700 p-5">
                            <h3 class="text-gray-400 text-xs font-bold uppercase mb-4 border-b border-gray-700 pb-2">Contract Details</h3>
                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Expires</span>
                                    <span class="text-white font-bold">{{ 2024 + player.contract.expires }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Salary</span>
                                    <span class="text-green-400 font-mono">{{ formatMoney(player.contract.salary) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Buyout Clause</span>
                                    <span class="text-white font-mono">{{ formatMoney(player.contract.salary * 1.5) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="activeTab === 'stats'" class="animate-fade-in">
                    <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-900 text-gray-400 text-xs uppercase font-bold">
                                <tr>
                                    <th class="p-4">Champion</th>
                                    <th class="p-4 text-center">Games</th>
                                    <th class="p-4 text-center">Winrate</th>
                                    <th class="p-4 text-center">KDA</th>
                                    <th class="p-4 text-center">CS/m</th>
                                    <th class="p-4 text-center">Gold/m</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-700">
                                <tr v-for="stat in seasonStats" :key="stat.name" class="hover:bg-gray-700 transition-colors">
                                    <td class="p-3 pl-4 flex items-center gap-3">
                                        <img :src="getChampImage(stat.name)" class="w-8 h-8 rounded border border-gray-600">
                                        <span class="font-bold text-white">{{ stat.name }}</span>
                                    </td>
                                    <td class="p-3 text-center text-white">{{ stat.games }}</td>
                                    <td class="p-3 text-center">
                                        <span :class="(stat.wins/stat.games) >= 0.5 ? 'text-blue-400' : 'text-red-400'" class="font-bold">
                                            {{ ((stat.wins/stat.games)*100).toFixed(0) }}%
                                        </span>
                                    </td>
                                    <td class="p-3 text-center font-mono text-yellow-500">
                                        {{ getKda(stat.kills, stat.deaths, stat.assists) }}
                                    </td>
                                    <td class="p-3 text-center text-gray-400">
                                        {{ (stat.cs / stat.games).toFixed(1) }}
                                    </td>
                                    <td class="p-3 text-center text-gray-400">
                                        {{ (stat.gold / stat.games / 1000).toFixed(1) }}k
                                    </td>
                                </tr>
                                <tr v-if="seasonStats.length === 0">
                                    <td colspan="6" class="p-8 text-center text-gray-500 italic">No matches played this season.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-else-if="activeTab === 'history'" class="animate-fade-in">
                    <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-900 text-gray-400 text-xs uppercase font-bold border-b border-gray-700">
                                <tr>
                                    <th class="p-3 pl-6">Result</th>
                                    <th class="p-3">Champion</th>
                                    <th class="p-3 text-center">KDA</th>
                                    <th class="p-3 text-center hidden md:table-cell">Damage</th>
                                    <th class="p-3 text-center hidden md:table-cell">CS</th>
                                    <th class="p-3 text-center hidden md:table-cell">Gold</th>
                                    <th class="p-3 text-center">Rating</th>
                                    <th class="p-3 text-right pr-6">Info</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-700">
                                <tr v-for="match in player.matchHistory" :key="match.matchId" class="hover:bg-gray-750 transition-colors">
                                    <td class="p-3 pl-6">
                                        <span class="font-bold text-xs px-2 py-1 rounded border" 
                                              :class="match.result === 'WIN' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-red-900/30 text-red-400 border-red-800'">
                                            {{ match.result }}
                                        </span>
                                    </td>
                                    <td class="p-3 flex items-center gap-3">
                                        <img :src="getChampImage(match.championName)" class="w-8 h-8 rounded border border-gray-600">
                                        <span class="font-bold text-gray-300">{{ match.championName }}</span>
                                    </td>
                                    <td class="p-3 text-center font-mono text-white">
                                        {{ match.kills }}/{{ match.deaths }}/{{ match.assists }}
                                    </td>
                                    <td class="p-3 text-center text-gray-400 hidden md:table-cell text-xs">
                                        {{ (match.damage / 1000).toFixed(1) }}k
                                    </td>
                                    <td class="p-3 text-center text-gray-400 hidden md:table-cell text-xs">
                                        {{ match.cs }}
                                    </td>
                                    <td class="p-3 text-center text-gray-400 hidden md:table-cell text-xs">
                                        {{ (match.gold / 1000).toFixed(1) }}k
                                    </td>
                                    <td class="p-3 text-center font-bold" :class="getRatingColorClass(match.rating * 10)">
                                        {{ match.rating }}
                                    </td>
                                    <td class="p-3 text-right pr-6">
                                        <button @click="openMatch(match.matchId)" class="text-blue-400 hover:text-white underline text-xs">
                                            View
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="!player.matchHistory || player.matchHistory.length === 0">
                                    <td colspan="8" class="p-10 text-center text-gray-500 italic">No matches recorded yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
            <div class="text-xl font-bold mb-2">Player Not Found</div>
            <router-link to="/my-team" class="text-blue-400 hover:underline">Back to Team</router-link>
        </div>
    </GameLayout>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>