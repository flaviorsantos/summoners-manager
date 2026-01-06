<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { formatMoney } from '@/core/utils/formatters';

const store = useGameStore();
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Próxima Partida
const nextMatch = computed(() => store.nextMatch);
const enemyTeam = computed(() => {
    if (!nextMatch.value) return null;
    const enemyId = nextMatch.value.homeTeamId === store.myTeamId ? nextMatch.value.awayTeamId : nextMatch.value.homeTeamId;
    return store.teams.find(t => t.id === enemyId);
});

// Top 5 Standings
const topStandings = computed(() => {
    return [...store.teams]
        .sort((a, b) => b.stats.wins - a.stats.wins)
        .slice(0, 5);
});

// Resumo Financeiro
const budgetStatus = computed(() => {
    if (store.budget > 10000000) return 'text-green-400';
    if (store.budget > 2000000) return 'text-yellow-400';
    return 'text-red-400';
});
</script>

<template>
    <GameLayout>
        <div class="flex justify-between items-end mb-8">
            <div>
                <h1 class="text-4xl font-bold text-white mb-1">Coach Dashboard</h1>
                <p class="text-gray-400 text-sm">Season 1 | {{ weekDays[store.currentWeekday] }}, Day {{ store.day }}</p>
            </div>
            <div class="text-right">
                <div class="text-xs text-gray-500 uppercase font-bold">Current Budget</div>
                <div class="text-3xl font-mono font-bold" :class="budgetStatus">{{ formatMoney(store.budget) }}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-2 space-y-6">
                
                <div class="bg-linear-to-r from-blue-900 to-gray-900 rounded-xl border border-blue-800 p-6 shadow-2xl relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <div class="text-blue-300 font-bold text-xs uppercase tracking-widest mb-2">Next Match</div>
                            <div class="flex items-center gap-6">
                                <div class="text-center">
                                    <div class="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold mb-2 shadow-lg">
                                        {{ store.teams.find(t => t.id === store.myTeamId)?.acronym }}
                                    </div>
                                    <div class="text-white font-bold text-lg">YOU</div>
                                </div>
                                
                                <div class="text-4xl font-black text-white/20 italic">VS</div>

                                <div class="text-center" v-if="enemyTeam">
                                    <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 shadow-lg" :class="enemyTeam.primaryColor">
                                        {{ enemyTeam.acronym }}
                                    </div>
                                    <div class="text-gray-200 font-bold text-lg">{{ enemyTeam.acronym }}</div>
                                </div>
                                <div v-else class="text-gray-500 italic">No match scheduled</div>
                            </div>
                        </div>

                        <div class="flex flex-col items-end gap-3" v-if="nextMatch && nextMatch.day === store.day">
                            <button @click="$router.push('/lobby')" 
                                class="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-3 active:scale-95">
                                <span>🏆 PLAY MATCH</span>
                            </button>
                            <span class="text-xs text-green-400 font-bold animate-pulse">MATCH DAY IS LIVE!</span>
                        </div>
                        <div v-else class="flex flex-col items-end">
                            <button @click="store.advanceDay()" class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all">
                                Skip Day
                            </button>
                            <span class="text-xs text-gray-500 mt-2">Next match on Day {{ nextMatch?.day }}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 class="text-gray-200 font-bold text-lg mb-4 flex items-center gap-2">
                        <span>📰 Headlines</span>
                        <div class="h-px bg-gray-700 flex-1"></div>
                    </h2>
                    <div class="space-y-3">
                        <div v-if="store.newsFeed.length === 0" class="text-gray-500 italic text-sm">No news yet.</div>
                        <div v-for="(news, idx) in store.newsFeed.slice(0, 5)" :key="idx" 
                             class="flex gap-3 items-start p-3 bg-gray-900/50 rounded border-l-4 border-blue-500 hover:bg-gray-900 transition-colors">
                             <div class="text-gray-300 text-sm leading-relaxed">{{ news }}</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <button @click="$router.push('/my-team')" class="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-all text-left group">
                        <div class="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">👥</div>
                        <div class="font-bold text-white">Manage Roster</div>
                        <div class="text-xs text-gray-500">Substitutions & Contracts</div>
                    </button>
                    <button @click="$router.push('/market')" class="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-gray-750 transition-all text-left group">
                        <div class="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">💰</div>
                        <div class="font-bold text-white">Transfer Market</div>
                        <div class="text-xs text-gray-500">Scout new players</div>
                    </button>
                    <button @click="$router.push('/stats')" class="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-purple-500 hover:bg-gray-750 transition-all text-left group">
                        <div class="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">📊</div>
                        <div class="font-bold text-white">League Stats</div>
                        <div class="text-xs text-gray-500">Meta & Rankings</div>
                    </button>
                </div>
            </div>

            <div class="space-y-6">
                
                <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div class="p-4 bg-gray-900 border-b border-gray-700 font-bold text-white flex justify-between items-center">
                        <span>Top Teams</span>
                        <router-link to="/standings" class="text-xs text-blue-400 hover:underline">View All</router-link>
                    </div>
                    <table class="w-full text-sm">
                        <tbody class="divide-y divide-gray-700">
                            <tr v-for="(team, idx) in topStandings" :key="team.id" class="hover:bg-gray-700 transition-colors" :class="team.id === store.myTeamId ? 'bg-blue-900/20' : ''">
                                <td class="p-3 text-center text-gray-500 font-mono w-8">{{ idx + 1 }}</td>
                                <td class="p-3 font-bold text-gray-300">
                                    {{ team.acronym }}
                                    <span v-if="team.id === store.myTeamId" class="text-[9px] bg-blue-600 text-white px-1 rounded ml-1">YOU</span>
                                </td>
                                <td class="p-3 text-right font-mono font-bold text-white">{{ team.stats.wins }}-{{ team.stats.losses }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <h3 class="text-gray-400 text-xs font-bold uppercase mb-4">Last Match Performance</h3>
                    
                    <div v-if="store.lastMatchResult">
                        <div class="flex justify-between items-center mb-4">
                            <div class="text-xl font-bold" :class="store.lastMatchResult.winner === 'BLUE' ? 'text-green-400' : 'text-red-400'">
                                {{ store.lastMatchResult.winner === 'BLUE' ? 'VICTORY' : 'DEFEAT' }}
                            </div>
                            <div class="font-mono text-white text-lg">
                                {{ store.lastMatchResult.blueScore }} - {{ store.lastMatchResult.redScore }}
                            </div>
                        </div>
                        <button @click="$router.push(`/match/${store.lastMatchResult.matchId}`)" class="w-full py-2 border border-gray-600 rounded text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition-colors">
                            View Details
                        </button>
                    </div>
                    <div v-else class="text-center py-8 text-gray-600 text-sm italic">
                        No matches played yet.
                    </div>
                </div>

            </div>
        </div>
    </GameLayout>
</template>