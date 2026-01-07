<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { formatMoney, getRatingColorClass } from '@/core/utils/formatters';

const route = useRoute();
const router = useRouter();
const store = useGameStore();

const team = computed(() => {
    return store.teams.find(t => t.id === route.params.id);
});

const roster = computed(() => {
    if (!team.value) return [];
    const roleOrder = { 'TOP': 1, 'JUNGLE': 2, 'MID': 3, 'ADC': 4, 'SUPPORT': 5 };
    
    return store.players
        .filter(p => p.team === team.value?.id)
        .sort((a, b) => (roleOrder[a.role] || 9) - (roleOrder[b.role] || 9));
});

const openPlayer = (id: string) => router.push({ name: 'player', params: { id } });
</script>

<template>
    <GameLayout>
        <div v-if="team" class="animate-fade-in">
            
            <div class="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6 flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-6">
                    <div class="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner border-4 border-gray-700"
                         :class="[team.primaryColor, team.secondaryColor]">
                        {{ team.acronym }}
                    </div>
                    
                    <div>
                        <h1 class="text-4xl font-bold text-white tracking-tight">{{ team.name }}</h1>
                        <div class="text-gray-400 mt-1 flex gap-4">
                            <span>Prestige: <span class="text-yellow-500 font-bold">{{ team.prestige }}</span></span>
                            <span>Budget: <span class="text-green-400 font-mono">{{ formatMoney(team.budget) }}</span></span>
                        </div>
                    </div>
                </div>

                <div class="text-right">
                    <div class="text-xs text-gray-500 uppercase font-bold tracking-widest">Season Record</div>
                    <div class="text-5xl font-bold text-white tabular-nums">
                        {{ team.stats.wins }}<span class="text-gray-600 mx-2">-</span>{{ team.stats.losses }}
                    </div>
                    <div class="text-sm text-gray-400 mt-1">
                        {{ ((team.stats.wins / (team.stats.wins + team.stats.losses || 1)) * 100).toFixed(0) }}% Winrate
                    </div>
                </div>
            </div>

            <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div class="p-4 bg-gray-900 border-b border-gray-700 font-bold text-gray-200 flex justify-between">
                    <span>Active Roster</span>
                    <span class="text-xs font-normal text-gray-500 self-center">5 Starters</span>
                </div>
                
                <table class="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr class="bg-gray-900 text-gray-500 text-xs uppercase border-b border-gray-700">
                            <th class="p-3 w-16 text-center">Pos</th>
                            <th class="p-3">Player</th>
                            <th class="p-3 text-center">Age</th>
                            <th class="p-3 text-center">Ovr</th>
                            <th class="p-3 text-center">Pot</th>
                            <th class="p-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-700">
                        <tr v-for="player in roster" :key="player.id" class="hover:bg-gray-700 transition-colors group">
                            <td class="p-3 text-center">
                                <span class="bg-gray-900 text-gray-400 px-2 py-1 rounded text-xs font-mono border border-gray-600 font-bold">
                                    {{ player.role }}
                                </span>
                            </td>
                            
                            <td class="p-3">
                                <div class="font-bold text-white text-lg cursor-pointer hover:underline" @click="openPlayer(player.id)">
                                    {{ player.nickname }}
                                </div>
                                <div class="text-xs text-gray-500">{{ player.name }}</div>
                            </td>

                            <td class="p-3 text-center text-gray-400">{{ player.age }}</td>
                            
                            <td class="p-3 text-center font-bold text-lg">
                                <span :class="getRatingColorClass(player.overall)">{{ player.overall }}</span>
                            </td>
                            
                            <td class="p-3 text-center font-bold text-lg">
                                <span :class="getRatingColorClass(player.potential)">{{ player.potential }}</span>
                            </td>

                            <td class="p-3 text-right">
                                <button @click="openPlayer(player.id)" class="text-blue-400 hover:text-white text-xs underline">
                                    Scout Profile
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div v-if="roster.length < 5" class="p-4 text-center text-red-400 bg-red-900/20">
                    ⚠️ Invalid Roster: This team has less than 5 players.
                </div>
            </div>

        </div>
    </GameLayout>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>