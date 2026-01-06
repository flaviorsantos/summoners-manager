<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';

const store = useGameStore();

const selectedDay = ref(store.day); 

const matchesByDay = computed(() => {
    return store.schedule.filter(m => m.day === selectedDay.value);
});

const maxDay = computed(() => {
    if (store.schedule.length === 0) return 18;
    return Math.max(...store.schedule.map(m => m.day));
});

const prevDay = () => { 
    let d = selectedDay.value - 1;
    while (d > 0) {
        if (store.schedule.some(m => m.day === d)) {
            selectedDay.value = d;
            return;
        }
        d--;
    }
};

const nextDay = () => { 
    let d = selectedDay.value + 1;
    while (d <= maxDay.value) {
        if (store.schedule.some(m => m.day === d)) {
            selectedDay.value = d;
            return;
        }
        d++;
    }
};

const getMatchStatus = (match: any) => {
    if (match.played) return 'FINISHED';
    if (match.day === store.day) return 'TODAY';
    return 'UPCOMING';
};

onMounted(() => {
    const hasGamesToday = store.schedule.some(m => m.day === selectedDay.value);
    
    if (!hasGamesToday) {
        const nextGame = store.schedule.find(m => m.day > selectedDay.value);
        if (nextGame) {
            selectedDay.value = nextGame.day;
        } else {
            const prevGame = [...store.schedule].reverse().find(m => m.day < selectedDay.value);
            if (prevGame) selectedDay.value = prevGame.day;
        }
    }
});
</script>

<template>
    <GameLayout>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-white">Season Schedule</h1>
            
            <div class="flex items-center gap-4 bg-gray-800 p-2 rounded border border-gray-700 select-none">
                <button @click="prevDay" class="text-gray-400 hover:text-white px-3 py-1 text-xl font-bold bg-gray-700 rounded hover:bg-gray-600 transition-colors">←</button>
                <div class="text-center w-40">
                    <div class="text-xs text-gray-500 uppercase font-bold">Round / Day</div>
                    <div class="text-xl font-bold text-white">Day {{ selectedDay }}</div>
                </div>
                <button @click="nextDay" class="text-gray-400 hover:text-white px-3 py-1 text-xl font-bold bg-gray-700 rounded hover:bg-gray-600 transition-colors">→</button>
            </div>
        </div>

        <div class="space-y-3">
            <div v-for="match in matchesByDay" :key="match.id" 
                 class="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors">
                
                <div class="flex-1 flex items-center justify-end gap-4">
                    <span class="text-xl font-bold text-white text-right" :class="match.winnerId === match.homeTeamId ? 'text-green-400' : ''">
                        {{ store.getTeamName(match.homeTeamId) }}
                    </span>
                    <div class="w-4 h-4 rounded-full shadow border border-gray-600" :class="store.teams.find(t => t.id === match.homeTeamId)?.primaryColor"></div>
                </div>

                <div class="w-40 text-center px-2">
                    <div v-if="match.played" class="flex flex-col items-center">
                        <router-link 
                            :to="{name: 'match-details', params: {id: match.id}}" 
                            class="bg-gray-900 hover:bg-blue-900 border border-gray-600 hover:border-blue-500 text-blue-300 hover:text-white px-4 py-1 rounded text-sm font-bold transition-all"
                        >
                            View Result
                        </router-link>
                        <div class="text-[10px] mt-1 font-bold uppercase tracking-wider truncate max-w-35 mx-auto"
                            :class="match.winnerId === store.myTeamId ? 'text-green-400' : 'text-gray-400'">
                            {{ store.getTeamName(match.winnerId!) }} WINS!
                        </div>
                    </div>
                    <div v-else class="text-gray-500 font-bold bg-gray-900/50 py-2 rounded border border-dashed border-gray-700 text-xs uppercase tracking-wider">
                        {{ getMatchStatus(match) }}
                    </div>
                </div>

                <div class="flex-1 flex items-center justify-start gap-4">
                    <div class="w-4 h-4 rounded-full shadow border border-gray-600" :class="store.teams.find(t => t.id === match.awayTeamId)?.primaryColor"></div>
                    <span class="text-xl font-bold text-white text-left" :class="match.winnerId === match.awayTeamId ? 'text-green-400' : ''">
                        {{ store.getTeamName(match.awayTeamId) }}
                    </span>
                </div>

            </div>
            
            <div v-if="matchesByDay.length === 0" class="text-center text-gray-500 mt-10 p-10 border-2 border-dashed border-gray-800 rounded-xl">
                No matches scheduled for Day {{ selectedDay }}.
            </div>
        </div>
    </GameLayout>
</template>