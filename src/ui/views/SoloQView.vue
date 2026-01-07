<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';

const store = useGameStore();
const router = useRouter();

const selectedRole = ref('ALL');

const leaderboard = computed(() => {
    let list = [...store.players].filter(p => p.soloQ);
    
    if (selectedRole.value !== 'ALL') {
        list = list.filter(p => p.role === selectedRole.value);
    }

    return list.sort((a, b) => (b.soloQ!.lp) - (a.soloQ!.lp)).slice(0, 50);
});

const getWinrate = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
};

const getRankColor = (tier: string) => {
    if (tier === 'CHALLENGER') return 'text-yellow-400';
    if (tier === 'GRANDMASTER') return 'text-red-400';
    return 'text-purple-400';
};
</script>

<template>
    <GameLayout>
        <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-white">Challenger Ladder</h1>
                <p class="text-gray-400 text-sm">Top 50 Solo Queue players. Updates daily.</p>
            </div>
            
            <select v-model="selectedRole" class="bg-gray-800 text-white text-sm px-4 py-2 rounded border border-gray-700 outline-none focus:border-blue-500 cursor-pointer">
                <option value="ALL">All Roles</option>
                <option value="TOP">Top</option>
                <option value="JUNGLE">Jungle</option>
                <option value="MID">Mid</option>
                <option value="ADC">ADC</option>
                <option value="SUPPORT">Support</option>
            </select>
        </div>

        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
            <table class="w-full text-left text-sm border-collapse">
                <thead>
                    <tr class="bg-gray-900 text-gray-500 text-xs uppercase border-b border-gray-700">
                        <th class="p-4 w-16 text-center">Rank</th>
                        <th class="p-4">Player</th>
                        <th class="p-4 text-center">Role</th>
                        <th class="p-4 text-right">LP</th>
                        <th class="p-4 text-center">W/L</th>
                        <th class="p-4 text-center">Winrate</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="(player, idx) in leaderboard" :key="player.id" class="hover:bg-gray-750 transition-colors">
                        <td class="p-4 text-center font-mono text-gray-400 font-bold">
                            {{ idx + 1 }}
                        </td>
                        <td class="p-4">
                            <div @click="router.push({name: 'player', params: { id: player.id }})" class="font-bold text-white text-base hover:text-blue-400 cursor-pointer flex items-center gap-2">
                                {{ player.nickname }}
                                
                                <span v-if="player.team !== 'Free Agent'" class="text-[10px] bg-gray-700 text-gray-300 px-1 rounded uppercase border border-gray-600">
                                    {{ store.getTeamName(player.team) }}
                                </span>
                                <span v-else class="text-[10px] bg-green-900/30 text-green-400 px-1 rounded uppercase border border-green-800">
                                    FA
                                </span>
                            </div>
                        </td>
                        <td class="p-4 text-center">
                            <span class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                {{ player.role }}
                            </span>
                        </td>
                        <td class="p-4 text-right font-mono font-bold text-lg">
                            <span :class="getRankColor(player.soloQ!.rankTier)">{{ player.soloQ!.lp }} LP</span>
                        </td>
                        <td class="p-4 text-center text-gray-400 font-mono">
                            <span class="text-green-400">{{ player.soloQ!.wins }}W</span> - <span class="text-red-400">{{ player.soloQ!.losses }}L</span>
                        </td>
                        <td class="p-4 text-center font-bold">
                            <span :class="getWinrate(player.soloQ!.wins, player.soloQ!.losses) >= 50 ? 'text-blue-400' : 'text-gray-500'">
                                {{ getWinrate(player.soloQ!.wins, player.soloQ!.losses) }}%
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </GameLayout>
</template>