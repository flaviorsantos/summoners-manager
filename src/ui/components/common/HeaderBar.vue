<script setup lang="ts">
    import { useGameStore } from '@/ui/stores/gameStore';
    import { formatDate, formatMoney } from '@/core/utils/formatters';

    const store = useGameStore();
</script>

<template>
    <header class="h-16 bg-[#161920]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
        
        <div class="flex items-center gap-6">
            <div class="flex flex-col">
                <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Managing</span>
                <span class="font-bold text-white text-lg tracking-tight">{{ store.myTeamName }}</span> 
            </div>
            
            <div class="h-8 w-px bg-gray-700 mx-2"></div> 
            
            <div class="flex flex-col">
                <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Budget</span>
                <span class="font-mono text-green-400 font-bold tracking-tight">
                    {{ formatMoney(store.budget) }} 
                </span>
            </div>
        </div>

        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center group cursor-default">
            <div class="text-[10px] text-gray-500 uppercase font-bold tracking-widest group-hover:text-blue-400 transition-colors">Season 2026</div>
            <div class="text-xl font-black text-gray-200 tracking-widest group-hover:text-white transition-colors">
                {{ formatDate(store.day) }}
            </div>
        </div>

        <div class="flex items-center gap-4">
            <button 
                @click="store.advanceDay()"
                class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg shadow-blue-900/20 font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center gap-2"
            >
                <span>CONTINUE</span>
                <span class="text-blue-200">▶</span>
            </button>
        </div>
    </header>
</template>