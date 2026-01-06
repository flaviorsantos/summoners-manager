<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';

const store = useGameStore();

const standings = computed(() => {
    return [...store.teams].sort((a, b) => {
        if (a.stats.wins !== b.stats.wins) return b.stats.wins - a.stats.wins;
        return a.stats.losses - b.stats.losses;
    });
});
</script>

<template>
    <GameLayout>
        <h1 class="text-3xl font-bold text-white mb-6">League Standings</h1>

        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                        <th class="p-4 w-12 text-center">#</th>
                        <th class="p-4">Team</th>
                        <th class="p-4 w-24 text-center">W</th>
                        <th class="p-4 w-24 text-center">L</th>
                        <th class="p-4 w-24 text-center">Win %</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr 
                        v-for="(team, index) in standings" 
                        :key="team.id"
                        class="hover:bg-gray-700 transition-colors"
                        :class="team.id === store.myTeamId ? 'bg-blue-900/20' : ''"
                    >
                        <td class="p-4 text-center text-gray-500 font-mono">{{ index + 1 }}</td>
                        <td class="p-4 flex items-center gap-3">
                            <div class="w-4 h-4 rounded-full shadow" :class="team.primaryColor"></div>
                            
                            <router-link 
                                :to="{ name: 'team', params: { id: team.id }}" 
                                class="font-bold text-gray-200 text-lg hover:text-blue-400 hover:underline transition-colors"
                            >
                                {{ team.name }}
                            </router-link>

                            <span v-if="team.id === store.myTeamId" class="text-xs bg-blue-600 px-2 py-0.5 rounded text-white font-bold tracking-wider">YOU</span>
                        </td>
                        <td class="p-4 text-center text-green-400 font-bold text-xl">{{ team.stats.wins }}</td>
                        <td class="p-4 text-center text-red-400 font-bold text-xl">{{ team.stats.losses }}</td>
                        <td class="p-4 text-center text-gray-400 font-mono">
                            {{ ((team.stats.wins / (team.stats.wins + team.stats.losses || 1)) * 100).toFixed(0) }}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </GameLayout>
</template>