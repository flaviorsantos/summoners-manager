<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { getRatingColorClass } from '@/core/utils/formatters';

const store = useGameStore();
const router = useRouter();

const myRoster = computed(() => {
    const roleOrder = { 'TOP': 1, 'JUNGLE': 2, 'MID': 3, 'ADC': 4, 'SUPPORT': 5 };
    return store.players
        .filter(p => p.team === store.myTeamId)
        .sort((a, b) => (roleOrder[a.role] || 9) - (roleOrder[b.role] || 9));
});

const openPlayer = (id: string) => router.push({ name: 'player', params: { id } });
</script>

<template>
    <GameLayout>
        <div class="mb-6 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-white">Active Roster</h1>
            <div class="text-gray-400 text-sm">
                {{ myRoster.length }} / 15 Players
            </div>
        </div>

        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
            <table class="w-full text-left text-sm border-collapse">
                <thead>
                    <tr class="bg-gray-900 text-gray-500 text-xs uppercase border-b border-gray-700">
                        <th class="p-4 w-16 text-center">Role</th>
                        <th class="p-4">Player Name</th>
                        <th class="p-4 text-center">Age</th>
                        <th class="p-4 text-center">Overall</th>
                        <th class="p-4 text-center">Potential</th>
                        <th class="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="player in myRoster" :key="player.id" class="hover:bg-gray-700 transition-colors group">
                        <td class="p-4 text-center">
                            <span class="font-bold text-xs bg-gray-900 border border-gray-600 px-2 py-1 rounded text-gray-300">
                                {{ player.role }}
                            </span>
                        </td>
                        <td class="p-4">
                            <div @click="openPlayer(player.id)" class="font-bold text-lg text-white cursor-pointer hover:text-blue-400 hover:underline">
                                {{ player.nickname }}
                            </div>
                            <div class="text-xs text-gray-500">{{ player.name }}</div>
                        </td>
                        <td class="p-4 text-center text-gray-400">{{ player.age }}</td>
                        <td class="p-4 text-center text-xl font-bold">
                            <span :class="getRatingColorClass(player.overall)">{{ player.overall }}</span>
                        </td>
                        <td class="p-4 text-center text-xl font-bold">
                            <span :class="getRatingColorClass(player.potential)">{{ player.potential }}</span>
                        </td>
                        <td class="p-4 text-right">
                            <button @click="openPlayer(player.id)" class="text-gray-400 hover:text-white mr-4 text-xs font-bold uppercase tracking-wide">
                                Manage
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="myRoster.length === 0" class="p-8 text-center text-gray-500">
                You have no players. Go to the Market!
            </div>
        </div>
    </GameLayout>
</template>