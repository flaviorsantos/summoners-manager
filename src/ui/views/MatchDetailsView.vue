<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { getRatingColorClass } from '@/core/utils/formatters';
import { CHAMPIONS_DB } from '@/core/domain/Champions';

const route = useRoute();
const store = useGameStore();
const matchId = route.params.id as string;

const match = computed(() => {
    let found = store.matchArchive.find(m => m.matchId === matchId);
    if (!found && store.lastMatchResult?.matchId === matchId) found = store.lastMatchResult;
    return found;
});

const blueTeamName = computed(() => match.value ? store.getTeamName(match.value.homeTeamId) : 'Blue Team');
const redTeamName = computed(() => match.value ? store.getTeamName(match.value.awayTeamId) : 'Red Team');

const blueTeamColor = computed(() => {
    const t = store.teams.find(t => t.id === match.value?.homeTeamId);
    return t ? t.primaryColor : 'bg-blue-600';
});
const redTeamColor = computed(() => {
    const t = store.teams.find(t => t.id === match.value?.awayTeamId);
    return t ? t.primaryColor : 'bg-red-600';
});

const getChampImage = (champName: string) => {
    const champ = CHAMPIONS_DB.find(c => c.name === champName);
    const validId = champ ? champ.id : champName.replace(/[^a-zA-Z0-9]/g, '');
    return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${validId}.png`;
};

// 👇 CORREÇÃO AQUI
const processStats = () => {
    if (!match.value) return [];
    const list: any[] = [];
    
    // O playerStats agora é um Array. Iteramos apenas o stat.
    match.value.playerStats.forEach((stat) => {
        // Usamos o stat.playerId para achar o jogador, e não o índice
        const player = store.players.find(p => p.id === stat.playerId);
        list.push({ ...stat, player: player || { nickname: 'Unknown', role: '?' } }); 
    });
    return list;
};

const roleOrder: Record<string, number> = { 'TOP': 1, 'JUNGLE': 2, 'MID': 3, 'ADC': 4, 'SUPPORT': 5 };

const blueStats = computed(() => {
    if (!match.value) return [];
    const all = processStats();
    return all
        .filter(s => s.opponentTeamId === match.value!.awayTeamId)
        .sort((a, b) => {
            const roleA = a.player?.role || '';
            const roleB = b.player?.role || '';
            return (roleOrder[roleA] || 9) - (roleOrder[roleB] || 9);
        });
});

const redStats = computed(() => {
    if (!match.value) return [];
    const all = processStats();
    return all
        .filter(s => s.opponentTeamId === match.value!.homeTeamId)
        .sort((a, b) => {
            const roleA = a.player?.role || '';
            const roleB = b.player?.role || '';
            return (roleOrder[roleA] || 9) - (roleOrder[roleB] || 9);
        });
});

const getKda = (k: number, d: number, a: number) => ((k+a)/Math.max(1,d)).toFixed(1);
</script>

<template>
    <GameLayout>
        <div v-if="match" class="animate-fade-in">
            
            <div class="mb-8 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
                <div class="flex h-24">
                    <div class="flex-1 flex items-center justify-between px-8 relative overflow-hidden">
                        <div class="absolute inset-0 opacity-20" :class="blueTeamColor"></div> <div class="relative z-10">
                            <h2 class="text-2xl font-bold text-white uppercase tracking-wider">{{ blueTeamName }}</h2>
                            <span class="text-blue-300 font-bold text-sm">BLUE SIDE</span>
                        </div>
                        <div class="relative z-10 text-6xl font-bold text-white">{{ match.blueScore }}</div>
                    </div>

                    <div class="w-24 bg-gray-900 flex flex-col items-center justify-center border-x border-gray-700 z-20">
                        <span class="text-gray-500 font-bold text-xl">VS</span>
                        <span class="text-gray-600 text-xs mt-1">{{ match.duration }}m</span>
                    </div>

                    <div class="flex-1 flex items-center justify-between px-8 relative overflow-hidden flex-row-reverse">
                        <div class="absolute inset-0 opacity-20" :class="redTeamColor"></div> <div class="relative z-10 text-right">
                            <h2 class="text-2xl font-bold text-white uppercase tracking-wider">{{ redTeamName }}</h2>
                            <span class="text-red-300 font-bold text-sm">RED SIDE</span>
                        </div>
                        <div class="relative z-10 text-6xl font-bold text-white">{{ match.redScore }}</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div class="bg-blue-900/20 p-2 text-center border-b border-blue-900/30">
                        <span class="text-blue-400 font-bold text-xs uppercase tracking-widest">{{ match.winner === 'BLUE' ? 'VICTORY' : 'DEFEAT' }}</span>
                    </div>
                    <table class="w-full text-left text-sm border-collapse">
                        <thead class="bg-gray-900 text-gray-500 text-xs uppercase">
                            <tr>
                                <th class="p-3 pl-4">Champion / Player</th>
                                <th class="p-3 text-center">KDA</th>
                                <th class="p-3 text-center">DMG</th>
                                <th class="p-3 text-center">Gold</th>
                                <th class="p-3 text-center">CS</th>
                                <th class="p-3 text-center">Rt</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700/50">
                            <tr v-for="stat in blueStats" :key="stat.player?.id" class="hover:bg-blue-900/10 transition-colors">
                                <td class="p-2 pl-4 flex items-center gap-3">
                                    <div class="relative">
                                        <img 
                                            :src="getChampImage(stat.championName)" 
                                            class="w-10 h-10 rounded-md border-2 border-blue-500/50 object-cover" 
                                            alt="Champ"
                                        >
                                        <div class="absolute -bottom-1 -right-1 bg-gray-900 text-gray-400 text-[10px] px-1 rounded border border-gray-700 font-bold">
                                            {{ stat.player.role ? stat.player.role.substring(0,1) : '?' }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold text-white">{{ stat.player?.nickname }}</div>
                                        <div class="text-xs text-blue-300">{{ stat.championName }}</div>
                                    </div>
                                </td>
                                <td class="p-2 text-center">
                                    <div class="text-white font-mono font-bold">{{ stat.kills }}/{{ stat.deaths }}/{{ stat.assists }}</div>
                                    <div class="text-xs text-gray-500">{{ getKda(stat.kills, stat.deaths, stat.assists) }}</div>
                                </td>
                                <td class="p-2 text-center text-orange-400 text-xs font-bold">{{ (stat.damage/1000).toFixed(1) }}k</td>
                                <td class="p-2 text-center text-yellow-500 text-xs font-bold">{{ (stat.gold/1000).toFixed(1) }}k</td>
                                <td class="p-2 text-center text-gray-400 text-xs">{{ stat.cs }}</td>
                                <td class="p-2 text-center font-bold" :class="getRatingColorClass(stat.rating * 10)">{{ stat.rating }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div class="bg-red-900/20 p-2 text-center border-b border-red-900/30">
                        <span class="text-red-400 font-bold text-xs uppercase tracking-widest">{{ match.winner === 'RED' ? 'VICTORY' : 'DEFEAT' }}</span>
                    </div>
                    <table class="w-full text-left text-sm border-collapse">
                        <thead class="bg-gray-900 text-gray-500 text-xs uppercase">
                            <tr>
                                <th class="p-3 pl-4">Champion / Player</th>
                                <th class="p-3 text-center">KDA</th>
                                <th class="p-3 text-center">DMG</th>
                                <th class="p-3 text-center">Gold</th>
                                <th class="p-3 text-center">CS</th>
                                <th class="p-3 text-center">Rt</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700/50">
                            <tr v-for="stat in redStats" :key="stat.player?.id" class="hover:bg-red-900/10 transition-colors">
                                <td class="p-2 pl-4 flex items-center gap-3">
                                    <div class="relative">
                                        <img 
                                            :src="getChampImage(stat.championName)" 
                                            class="w-10 h-10 rounded-md border-2 border-red-500/50 object-cover" 
                                            alt="Champ"
                                        >
                                        <div class="absolute -bottom-1 -right-1 bg-gray-900 text-gray-400 text-[10px] px-1 rounded border border-gray-700 font-bold">
                                            {{ stat.player.role ? stat.player.role.substring(0,1) : '?' }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold text-white">{{ stat.player?.nickname }}</div>
                                        <div class="text-xs text-red-300">{{ stat.championName }}</div>
                                    </div>
                                </td>
                                <td class="p-2 text-center">
                                    <div class="text-white font-mono font-bold">{{ stat.kills }}/{{ stat.deaths }}/{{ stat.assists }}</div>
                                    <div class="text-xs text-gray-500">{{ getKda(stat.kills, stat.deaths, stat.assists) }}</div>
                                </td>
                                <td class="p-2 text-center text-orange-400 text-xs font-bold">{{ (stat.damage/1000).toFixed(1) }}k</td>
                                <td class="p-2 text-center text-yellow-500 text-xs font-bold">{{ (stat.gold/1000).toFixed(1) }}k</td>
                                <td class="p-2 text-center text-gray-400 text-xs">{{ stat.cs }}</td>
                                <td class="p-2 text-center font-bold" :class="getRatingColorClass(stat.rating * 10)">{{ stat.rating }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
        <div v-else class="text-center text-gray-500 mt-20">Match details not found.</div>
    </GameLayout>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>