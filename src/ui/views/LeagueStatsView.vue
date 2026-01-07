<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { CHAMPIONS_DB } from '@/core/domain/Champions';

const store = useGameStore();

const championStats = computed(() => {
    const stats = new Map<string, {
        games: number, wins: number, kills: number, deaths: number, assists: number, cs: number
    }>();

    store.matchArchive.forEach(match => {
        match.playerStats.forEach(pStat => {
            const name = pStat.championName;
            if (!stats.has(name)) {
                stats.set(name, { games: 0, wins: 0, kills: 0, deaths: 0, assists: 0, cs: 0 });
            }
            const entry = stats.get(name)!;
            entry.games++;
            if (pStat.result === 'WIN') entry.wins++;
            entry.kills += pStat.kills;
            entry.deaths += pStat.deaths;
            entry.assists += pStat.assists;
            entry.cs += pStat.cs;
        });
    });

    return Array.from(stats.entries()).map(([name, data]) => ({
        name,
        games: data.games,
        winrate: (data.wins / data.games) * 100,
        kda: ((data.kills + data.assists) / Math.max(1, data.deaths)).toFixed(2),
        avgCs: (data.cs / data.games).toFixed(1),
        pickrate: ((data.games / (store.matchArchive.length * 10 || 1)) * 100).toFixed(1)
    })).sort((a, b) => b.games - a.games);
});

// --- CORREÇÃO DE IMAGEM ---
const getChampImage = (champName: string) => {
    // 1. Tenta achar o boneco na nossa Database Oficial
    const champ = CHAMPIONS_DB.find(c => c.name === champName);
    
    // 2. Se achar, usa o ID oficial (ex: MonkeyKing). 
    // Se não achar (save antigo ou nome errado), tenta o fallback de limpar string.
    const validId = champ ? champ.id : champName.replace(/[^a-zA-Z0-9]/g, '');
    
    return `https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/${validId}.png`;
};
</script>

<template>
    <GameLayout>
        <h1 class="text-3xl font-bold text-white mb-6">CBLOL Champion Statistics</h1>

        <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
            <table class="w-full text-left text-sm border-collapse">
                <thead class="bg-gray-900 text-gray-400 text-xs uppercase font-bold">
                    <tr>
                        <th class="p-4">Champion</th>
                        <th class="p-4 text-center">Games</th>
                        <th class="p-4 text-center">Pick %</th>
                        <th class="p-4 text-center">Win %</th>
                        <th class="p-4 text-center">KDA</th>
                        <th class="p-4 text-center">CS/m</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="champ in championStats" :key="champ.name" class="hover:bg-gray-700 transition-colors">
                        <td class="p-3 pl-4 flex items-center gap-4">
                            <img 
                                :src="getChampImage(champ.name)" 
                                class="w-10 h-10 rounded-md border border-gray-600 object-cover"
                                alt=""
                            >
                            <span class="font-bold text-white text-lg">{{ champ.name }}</span>
                        </td>
                        <td class="p-3 text-center text-white">{{ champ.games }}</td>
                        <td class="p-3 text-center text-gray-400">{{ champ.pickrate }}%</td>
                        <td class="p-3 text-center font-bold" :class="champ.winrate >= 50 ? 'text-blue-400' : 'text-red-400'">
                            {{ champ.winrate.toFixed(1) }}%
                        </td>
                        <td class="p-3 text-center font-mono text-yellow-500">{{ champ.kda }}</td>
                        <td class="p-3 text-center text-gray-400">{{ (parseFloat(champ.avgCs) / 30).toFixed(1) }}</td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="championStats.length === 0" class="p-10 text-center text-gray-500 italic">
                No matches played yet. Play some games to generate meta stats!
            </div>
        </div>
    </GameLayout>
</template>