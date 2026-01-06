<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '@/ui/stores/gameStore';
import { useRouter } from 'vue-router';
import GameLayout from '../layouts/GameLayout.vue';
import { formatMoney, getRatingColorClass } from '@/core/utils/formatters';

const store = useGameStore();
const router = useRouter();

// --- STATE DOS FILTROS ---
const searchQuery = ref('');
const selectedRole = ref('ALL');
const sortBy = ref('OVR_DESC'); // OVR_DESC, OVR_ASC, AGE_ASC, SALARY_ASC, POT_DESC

const openPlayerProfile = (playerId: string) => {
    router.push({name: 'player', params: { id: playerId}});
}

const signPlayer = (id: string) => {
    if (confirm("Sign this player? Salary will be deducted from budget.")) {
        store.signPlayer(id);
    }
}

// --- LOGICA DE FILTRO E SORT ---
const filteredPlayers = computed(() => {
    let list = [...store.marketPlayers];

    // 1. Busca Texto
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(p => p.nickname.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
    }

    // 2. Filtro de Role
    if (selectedRole.value !== 'ALL') {
        list = list.filter(p => p.role === selectedRole.value);
    }

    // 3. Ordenação
    list.sort((a, b) => {
        switch (sortBy.value) {
            case 'OVR_DESC': return b.overall - a.overall;
            case 'OVR_ASC': return a.overall - b.overall;
            case 'POT_DESC': return b.potential - a.potential;
            case 'AGE_ASC': return a.age - b.age;
            case 'SALARY_ASC': return a.contract.salary - b.contract.salary;
            case 'SALARY_DESC': return b.contract.salary - a.contract.salary;
            default: return b.overall - a.overall;
        }
    });

    return list;
});
</script>

<template>
    <GameLayout>
        <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-white">Free Agent Market</h1>
                <p class="text-gray-400 text-sm">Scout and sign available players for your roster.</p>
            </div>

            <div class="flex gap-2 w-full md:w-auto">
                <input v-model="searchQuery" type="text" placeholder="Search name..." class="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 outline-none focus:border-blue-500 transition-colors w-full md:w-48">
                
                <select v-model="selectedRole" class="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 outline-none focus:border-blue-500 cursor-pointer">
                    <option value="ALL">All Roles</option>
                    <option value="TOP">Top</option>
                    <option value="JUNGLE">Jungle</option>
                    <option value="MID">Mid</option>
                    <option value="ADC">ADC</option>
                    <option value="SUPPORT">Support</option>
                </select>

                <select v-model="sortBy" class="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 outline-none focus:border-blue-500 cursor-pointer">
                    <option value="OVR_DESC">Highest Overall</option>
                    <option value="POT_DESC">Highest Potential</option>
                    <option value="AGE_ASC">Youngest</option>
                    <option value="SALARY_ASC">Cheapest</option>
                    <option value="SALARY_DESC">Most Expensive</option>
                </select>
            </div>
        </div>

        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
            <table class="w-full text-left text-sm border-collapse">
                <thead>
                    <tr class="bg-gray-900 text-gray-400 text-xs uppercase font-bold border-b border-gray-700">
                        <th class="p-4">Player</th>
                        <th class="p-4 text-center">Role</th>
                        <th class="p-4 text-center">Age</th>
                        <th class="p-4 text-center">Overall</th>
                        <th class="p-4 text-center">Potential</th>
                        <th class="p-4 text-right">Wage (Yearly)</th>
                        <th class="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="player in filteredPlayers" :key="player.id" class="hover:bg-gray-750 transition-colors group">
                        <td class="p-4">
                            <div class="font-bold text-white text-lg group-hover:text-blue-400 transition-colors cursor-pointer" @click="openPlayerProfile(player.id)">
                                {{ player.nickname }}
                            </div>
                            <div class="text-xs text-gray-500">{{ player.name }} <span v-if="player.country">({{ player.country }})</span></div>
                        </td>
                        <td class="p-4 text-center">
                            <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border" 
                                  :class="{
                                    'bg-red-900/20 text-red-400 border-red-900': player.role === 'TOP',
                                    'bg-green-900/20 text-green-400 border-green-900': player.role === 'JUNGLE',
                                    'bg-blue-900/20 text-blue-400 border-blue-900': player.role === 'MID',
                                    'bg-yellow-900/20 text-yellow-400 border-yellow-900': player.role === 'ADC',
                                    'bg-purple-900/20 text-purple-400 border-purple-900': player.role === 'SUPPORT',
                                  }">
                                {{ player.role }}
                            </span>
                        </td>
                        <td class="p-4 text-center text-gray-300">{{ player.age }}</td>
                        <td class="p-4 text-center font-bold text-lg">
                            <span :class="getRatingColorClass(player.overall)">{{ player.overall }}</span>
                        </td>
                        <td class="p-4 text-center font-bold text-lg text-gray-500">
                            <span :class="getRatingColorClass(player.potential)">{{ player.potential }}</span>
                        </td>
                        <td class="p-4 text-right font-mono text-green-400 font-bold">
                            {{ formatMoney(player.contract.salary) }}
                        </td>
                        <td class="p-4 text-center flex justify-center gap-3">
                            <button @click="openPlayerProfile(player.id)" class="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded transition-colors">
                                View
                            </button>
                            <button @click="signPlayer(player.id)" class="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors shadow-lg shadow-blue-900/20" :disabled="store.budget < player.contract.salary">
                                Sign
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="filteredPlayers.length === 0" class="p-12 text-center text-gray-500">
                <div class="text-4xl mb-2">🔍</div>
                <p>No players found matching your criteria.</p>
            </div>
        </div>
    </GameLayout>
</template>