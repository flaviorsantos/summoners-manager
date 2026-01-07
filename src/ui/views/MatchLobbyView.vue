<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import GameLayout from '../layouts/GameLayout.vue';
import { CHAMPIONS_DB } from '@/core/domain/Champions';
import { type PlayStyle, type FocusLane } from '@/core/domain/Tactics';
import { getRatingColorClass } from '@/core/utils/formatters';
import type { Player } from '@/core/domain/Player';
import { getSmartBan, getSmartPick } from '@/core/simulation/DraftEngine';

const store = useGameStore();
const router = useRouter();

const TURN_TIME = 30; 
const MY_SIDE = 'BLUE';

const lobbyPhase = ref<'ROSTER' | 'DRAFT' | 'PREP'>('ROSTER');
const selectedLineup = ref<Map<string, string>>(new Map()); 

type DraftStep = { side: 'BLUE' | 'RED', type: 'BAN' | 'PICK', slotIdx: number };
const DRAFT_SEQUENCE: DraftStep[] = [
    { side: 'BLUE', type: 'BAN', slotIdx: 0 }, { side: 'RED',  type: 'BAN', slotIdx: 0 },
    { side: 'BLUE', type: 'BAN', slotIdx: 1 }, { side: 'RED',  type: 'BAN', slotIdx: 1 },
    { side: 'BLUE', type: 'BAN', slotIdx: 2 }, { side: 'RED',  type: 'BAN', slotIdx: 2 },
    { side: 'BLUE', type: 'PICK', slotIdx: 0 }, { side: 'RED',  type: 'PICK', slotIdx: 0 },
    { side: 'RED',  type: 'PICK', slotIdx: 1 }, { side: 'BLUE', type: 'PICK', slotIdx: 1 },
    { side: 'BLUE', type: 'PICK', slotIdx: 2 }, { side: 'RED',  type: 'PICK', slotIdx: 2 },
    { side: 'RED',  type: 'BAN', slotIdx: 3 }, { side: 'BLUE', type: 'BAN', slotIdx: 3 },
    { side: 'RED',  type: 'BAN', slotIdx: 4 }, { side: 'BLUE', type: 'BAN', slotIdx: 4 },
    { side: 'RED',  type: 'PICK', slotIdx: 3 }, { side: 'BLUE', type: 'PICK', slotIdx: 3 },
    { side: 'BLUE', type: 'PICK', slotIdx: 4 }, { side: 'RED',  type: 'PICK', slotIdx: 4 },
];

const currentStepIndex = ref(0);
const timer = ref(TURN_TIME);
let timerInterval: any = null;

const blueBans = ref<string[]>([null, null, null, null, null] as any);
const redBans  = ref<string[]>([null, null, null, null, null] as any);
const bluePicks = ref<Map<number, string>>(new Map()); 
const redPicks  = ref<Map<number, string>>(new Map());

const hoveredChampId = ref<string | null>(null);
const searchQuery = ref('');
const selectedFocus = ref<FocusLane>('STANDARD');
const selectedStyle = ref<PlayStyle>('BALANCED');
const isSwapMode = ref(false);
const swapSourceSlot = ref<number | null>(null);

const match = computed(() => store.nextMatch);
const enemyTeam = computed(() => store.teams.find(t => t.id === (match.value?.homeTeamId === store.myTeamId ? match.value?.awayTeamId : match.value?.homeTeamId)));

// IMPORTANTE: Ordem fixa para garantir consistência (Top, Jg, Mid, Adc, Sup)
const enemyRoster = computed(() => {
    if (!enemyTeam.value) return [];
    const roster: Player[] = [];
    const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
    roles.forEach(r => {
        const p = store.players.find(pl => pl.team === enemyTeam.value!.id && pl.role === r);
        if (p) roster.push(p);
    });
    return roster;
});

onBeforeRouteLeave((to, from, next) => {
    if (lobbyPhase.value === 'DRAFT' || lobbyPhase.value === 'PREP') {
        if (confirm("If you leave now, you will dodge the match. Are you sure?")) next();
        else next(false);
    } else next();
});

const availablePlayersByRole = computed(() => {
    const grouped = { 'TOP': [], 'JUNGLE': [], 'MID': [], 'ADC': [], 'SUPPORT': [] } as Record<string, Player[]>;
    store.players.filter(p => p.team === store.myTeamId).forEach(p => { if (grouped[p.role]) grouped[p.role].push(p); });
    return grouped;
});

const activeRoster = computed(() => {
    const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
    const players: Player[] = [];
    roles.forEach(role => {
        const playerId = selectedLineup.value.get(role);
        if (playerId) {
            const p = store.players.find(pl => pl.id === playerId);
            if (p) players.push(p);
        }
    });
    return players;
});

const statusMessage = computed(() => {
    if (lobbyPhase.value === 'ROSTER') return "SELECT STARTING LINEUP";
    if (lobbyPhase.value === 'PREP') return "PREPARATION PHASE";
    if (isMyTurn.value) return `YOUR TURN TO ${currentStep.value.type}`;
    return `ENEMY IS ${currentStep.value.type}ING...`;
});

const currentStep = computed(() => DRAFT_SEQUENCE[currentStepIndex.value]);
const isMyTurn = computed(() => lobbyPhase.value === 'DRAFT' && currentStep.value?.side === MY_SIDE);

const takenChamps = computed(() => new Set([
    ...blueBans.value.filter(x => x), ...redBans.value.filter(x => x),
    ...Array.from(bluePicks.value.values()), ...Array.from(redPicks.value.values())
]));

const filteredChampions = computed(() => {
    let list = CHAMPIONS_DB.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    list = list.filter(c => !takenChamps.value.has(c.id));
    return list.sort((a, b) => a.name.localeCompare(b.name));
});

const selectStarter = (role: string, playerId: string) => { selectedLineup.value.set(role, playerId); }

const confirmRoster = () => {
    if (selectedLineup.value.size < 5) { alert("You must select a player for every role!"); return; }
    lobbyPhase.value = 'DRAFT';
    startTimer();
}

onMounted(() => {
    if (!store.nextMatch || store.nextMatch.day !== store.day) router.push('/');
    const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
    roles.forEach(role => {
        const candidates = availablePlayersByRole.value[role] || [];
        if (candidates.length > 0) {
            const best = candidates.reduce((prev, curr) => (prev.overall > curr.overall) ? prev : curr);
            selectedLineup.value.set(role, best.id);
        }
    });
});

const startTimer = () => {
    clearInterval(timerInterval);
    timer.value = TURN_TIME;
    timerInterval = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) handleTimeout();
    }, 1000);
};

// --- FUNÇÕES DE LÓGICA DE JOGO ---

// 1. REORDENAÇÃO (SWAP) - Definida antes para ser usada no advanceTurn
const reorderEnemyComp = (picksMap: Map<number, string>, roster: Player[]): Map<number, string> => {
    const finalPicks = new Map<number, string>();
    const availableChamps = Array.from(picksMap.values());
    const assignedChamps = new Set<string>();

    // Passo 1: Match Perfeito (Role Principal)
    roster.forEach((player, rosterIdx) => {
        const perfectMatch = availableChamps.find(cId => {
            if (assignedChamps.has(cId)) return false;
            const c = CHAMPIONS_DB.find(db => db.id === cId);
            return c && c.roles.includes(player.role as any);
        });

        if (perfectMatch) {
            finalPicks.set(rosterIdx, perfectMatch);
            assignedChamps.add(perfectMatch);
        }
    });

    // Passo 2: Match Secundário (Off-role ou Flex)
    roster.forEach((player, rosterIdx) => {
        if (finalPicks.has(rosterIdx)) return;

        // Pega qualquer um que sobrou
        const leftover = availableChamps.find(cId => !assignedChamps.has(cId));
        if (leftover) {
            finalPicks.set(rosterIdx, leftover);
            assignedChamps.add(leftover);
        }
    });

    return finalPicks;
};

// 2. TIMEOUT / AUTO PICK
const handleTimeout = () => {
    if (lobbyPhase.value !== 'DRAFT') return;
    
    if (isMyTurn.value) {
        if (hoveredChampId.value) {
            confirmSelection();
        } else {
            const player = activeRoster.value[currentStep.value.slotIdx];
            const myPicksArr = Array.from(bluePicks.value.values());
            
            if (currentStep.value.type === 'BAN') {
                const random = filteredChampions.value[0];
                if(random) { hoveredChampId.value = random.id; confirmSelection(); }
            } else {
                const smartResult = getSmartPick(player, takenChamps.value, myPicksArr);
                if(smartResult && smartResult.id) { 
                    hoveredChampId.value = smartResult.id; 
                    confirmSelection(); 
                }
            }
        }
    } else {
        triggerAiTurn();
    }
};

const selectChamp = (champId: string) => { if (isMyTurn.value) hoveredChampId.value = champId; };

const confirmSelection = () => {
    if (!hoveredChampId.value) return;
    const step = currentStep.value;
    if (step.side === 'BLUE') {
        if (step.type === 'BAN') blueBans.value[step.slotIdx] = hoveredChampId.value;
        else bluePicks.value.set(step.slotIdx, hoveredChampId.value);
    } else {
        if (step.type === 'BAN') redBans.value[step.slotIdx] = hoveredChampId.value;
        else redPicks.value.set(step.slotIdx, hoveredChampId.value);
    }
    hoveredChampId.value = null;
    searchQuery.value = '';
    advanceTurn();
};

const advanceTurn = () => {
    if (currentStepIndex.value < DRAFT_SEQUENCE.length - 1) {
        currentStepIndex.value++;
        startTimer();
        if (!isMyTurn.value) {
            const thinkTime = Math.floor(Math.random() * 1500) + 500; 
            setTimeout(triggerAiTurn, thinkTime);
        }
    } else {
        // DRAFT ACABOU - ENTRANDO EM PREP
        clearInterval(timerInterval);
        
        // 👇 AQUI ACONTECE A MÁGICA VISUAL
        // O Draft termina e a IA instantaneamente organiza os picks para a role certa.
        redPicks.value = reorderEnemyComp(redPicks.value, enemyRoster.value);
        
        lobbyPhase.value = 'PREP';
    }
};

// 3. IA TURNO
const triggerAiTurn = () => {
    if (lobbyPhase.value !== 'DRAFT' || isMyTurn.value) return;
    
    const step = currentStep.value;
    let choiceId = '';

    if (step.type === 'BAN') {
        const enemyPicksMap = new Map<string, string>();
        bluePicks.value.forEach((champId, slot) => enemyPicksMap.set(String(slot), champId));
        choiceId = getSmartBan(activeRoster.value, takenChamps.value, enemyPicksMap);
        
        if (choiceId) redBans.value[step.slotIdx] = choiceId;
        else {
            const rnd = filteredChampions.value[0];
            if (rnd) redBans.value[step.slotIdx] = rnd.id;
        }
        advanceTurn();
    } else {
        const currentRedPicks = Array.from(redPicks.value.values());
        const satisfiedPlayerIndices = new Set<number>();
        
        currentRedPicks.forEach(champId => {
            const champ = CHAMPIONS_DB.find(c => c.id === champId);
            if (!champ) return;
            let bestOwnerIdx = -1;
            enemyRoster.value.forEach((player, idx) => {
                if (satisfiedPlayerIndices.has(idx)) return;
                if (champ.roles.includes(player.role as any)) { bestOwnerIdx = idx; }
            });
            if (bestOwnerIdx === -1) {
                enemyRoster.value.forEach((player, idx) => { if (!satisfiedPlayerIndices.has(idx)) bestOwnerIdx = idx; });
            }
            if (bestOwnerIdx !== -1) satisfiedPlayerIndices.add(bestOwnerIdx);
        });

        let bestMove = { slotIdx: step.slotIdx, champId: '', score: -1 };
        enemyRoster.value.forEach((player, rosterIdx) => {
            if (satisfiedPlayerIndices.has(rosterIdx)) return;
            const result = getSmartPick(player, takenChamps.value, currentRedPicks);
            if (result.score > bestMove.score) {
                bestMove = { slotIdx: rosterIdx, champId: result.id, score: result.score };
            }
        });

        if (bestMove.champId) {
            redPicks.value.set(step.slotIdx, bestMove.champId);
        } else {
            const rnd = filteredChampions.value[0];
            if (rnd) redPicks.value.set(step.slotIdx, rnd.id);
        }
        advanceTurn();
    }
};

const handleSlotClick = (slotIdx: number) => {
    if (!isSwapMode.value) return;
    if (swapSourceSlot.value === null) {
        swapSourceSlot.value = slotIdx;
    } else {
        const champA = bluePicks.value.get(swapSourceSlot.value);
        const champB = bluePicks.value.get(slotIdx);
        if (champA && champB) {
            bluePicks.value.set(swapSourceSlot.value, champB);
            bluePicks.value.set(slotIdx, champA);
        }
        swapSourceSlot.value = null;
        isSwapMode.value = false;
    }
};

const handleStartMatch = () => {
    const finalPicks = new Map<string, string>();
    activeRoster.value.forEach((player, idx) => {
        const champId = bluePicks.value.get(idx);
        if (champId) finalPicks.set(player.id, champId);
    });

    // Como já organizamos no 'advanceTurn' (Visual), apenas enviamos o estado atual.
    store.playLeagueMatch(
        { focus: selectedFocus.value, style: selectedStyle.value },
        { 
            myBans: blueBans.value.filter(b => b), 
            myPicks: finalPicks, 
            enemyPicks: redPicks.value, // Já está organizado!
            enemyBans: redBans.value.filter(b => b) 
        },
        activeRoster.value
    );
    
    if (store.lastMatchResult) {
         router.replace({ name: 'match-details', params: { id: store.lastMatchResult.matchId } });
    } else {
         router.push('/');
    }
};

onUnmounted(() => clearInterval(timerInterval));
const getChampImage = (champId: string) => `https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/${champId}.png`;
const getChampBack = (champId: string) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champId}_0.jpg`;
const getSlotClass = (side: string, type: string, idx: number) => {
    const isActive = lobbyPhase.value === 'DRAFT' && currentStep.value.side === side && currentStep.value.type === type && currentStep.value.slotIdx === idx;
    if (isActive) return 'ring-2 ring-yellow-400 animate-pulse bg-gray-700';
    return 'bg-gray-800 opacity-60';
};
</script>

<template>
    <GameLayout>
        <div class="flex justify-between items-end mb-4 px-2">
            <div class="flex items-center gap-4">
                <div class="text-3xl font-bold text-white">
                    {{ lobbyPhase === 'ROSTER' ? 'LINEUP SELECTION' : (lobbyPhase === 'DRAFT' ? (isMyTurn ? 'YOUR TURN' : 'ENEMY TURN') : 'TACTICAL PHASE') }}
                </div>
                <div class="text-sm font-bold bg-gray-800 px-3 py-1 rounded text-gray-300 border border-gray-600">
                    {{ statusMessage }}
                </div>
            </div>
            <div v-if="lobbyPhase === 'DRAFT'" class="flex flex-col items-center">
                <div class="text-6xl font-black font-mono leading-none" :class="timer <= 10 ? 'text-red-500 animate-ping' : 'text-white'">
                    {{ timer }}
                </div>
                <div class="text-[10px] uppercase tracking-widest text-gray-500">Seconds</div>
            </div>
        </div>

        <div v-if="lobbyPhase === 'ROSTER'" class="max-w-4xl mx-auto py-8">
             <div class="bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-2xl">
                <h2 class="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Who will start today?</h2>
                <div class="space-y-6">
                    <div v-for="role in ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']" :key="role" class="flex items-center gap-6">
                        <div class="w-24 text-right font-bold text-gray-400 text-lg">{{ role }}</div>
                        <div class="flex-1 flex gap-4 overflow-x-auto pb-2">
                            <div v-for="player in availablePlayersByRole[role] || []" :key="player.id"
                                 @click="selectStarter(role, player.id)"
                                 class="cursor-pointer border-2 rounded-lg p-3 w-40 transition-all relative group"
                                 :class="selectedLineup.get(role) === player.id ? 'border-blue-500 bg-blue-900/30' : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'"
                            >
                                <div class="font-bold text-white truncate">{{ player.nickname }}</div>
                                <div class="text-xs text-gray-400">OVR: <span :class="getRatingColorClass(player.overall)">{{ player.overall }}</span></div>
                                <div v-if="selectedLineup.get(role) === player.id" class="absolute top-2 right-2 text-blue-400">●</div>
                            </div>
                            <div v-if="(!availablePlayersByRole[role] || availablePlayersByRole[role].length === 0)" class="text-red-500 text-sm italic py-4">No player!</div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 flex justify-end">
                    <button @click="confirmRoster" class="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded font-bold text-xl shadow-lg">CONFIRM LINEUP -></button>
                </div>
             </div>
        </div>

        <div v-else class="grid grid-cols-12 gap-4 h-[75vh]">
            <div class="col-span-3 flex flex-col gap-2">
                <div class="flex gap-1 mb-2 justify-start">
                    <div v-for="(ban, idx) in blueBans" :key="'b-ban-'+idx" class="w-10 h-10 border border-gray-600 rounded overflow-hidden relative" :class="getSlotClass('BLUE', 'BAN', idx)">
                         <img v-if="ban" :src="getChampImage(ban)" class="w-full h-full object-cover grayscale">
                         <div v-if="ban" class="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-lg">/</div>
                    </div>
                </div>
                <div class="flex-1 flex flex-col gap-2">
                    <div v-for="(player, idx) in activeRoster" :key="'b-pick-'+idx" @click="handleSlotClick(idx)" class="flex-1 rounded border relative overflow-hidden flex items-center p-2 transition-all cursor-default" :class="[getSlotClass('BLUE', 'PICK', idx), isSwapMode ? 'cursor-pointer hover:border-yellow-400' : 'border-gray-700', swapSourceSlot === idx ? 'border-yellow-500 bg-yellow-900/30' : '']">
                        <div v-if="bluePicks.has(idx)" class="absolute inset-0 z-0"><img :src="getChampBack(bluePicks.get(idx)!)" class="w-full h-full object-cover object-[80%_20%] opacity-50"></div>
                        <div v-else-if="lobbyPhase === 'DRAFT' && isMyTurn && currentStep.type === 'PICK' && currentStep.slotIdx === idx && hoveredChampId" class="absolute inset-0 z-0"><img :src="getChampBack(hoveredChampId)" class="w-full h-full object-cover object-[80%_20%] opacity-20 animate-pulse"></div>
                        <div class="relative z-10 flex items-center gap-3 w-full">
                            <div class="w-12 h-12 bg-gray-900 rounded-full border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                                <img v-if="bluePicks.has(idx)" :src="getChampImage(bluePicks.get(idx)!)" class="w-full h-full object-cover">
                                <span v-else class="text-gray-500 font-bold text-lg">{{ idx + 1 }}</span>
                            </div>
                            <div>
                                <div class="text-[10px] text-blue-300 font-bold uppercase">{{ player.role }} | {{ player.nickname }}</div>
                                <div class="font-bold text-white text-lg shadow-black drop-shadow-md leading-none">{{ bluePicks.get(idx) ? CHAMPIONS_DB.find(c => c.id === bluePicks.get(idx))?.name : '...' }}</div>
                            </div>
                        </div>
                        <div v-if="isSwapMode" class="absolute right-2 text-yellow-500 animate-bounce">⇄</div>
                    </div>
                </div>
            </div>
            <div class="col-span-6 bg-gray-800 rounded-lg border border-gray-700 flex flex-col overflow-hidden relative">
                <div v-if="lobbyPhase === 'DRAFT'" class="flex flex-col h-full">
                    <div class="p-3 bg-gray-900 border-b border-gray-700 flex gap-4">
                        <input v-model="searchQuery" type="text" placeholder="Search..." class="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 w-full focus:border-blue-500 outline-none" :disabled="!isMyTurn">
                        <button @click="confirmSelection" :disabled="!isMyTurn || !hoveredChampId" class="px-6 py-2 font-bold rounded uppercase transition-all" :class="isMyTurn && hoveredChampId ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gray-700 text-gray-500 cursor-not-allowed'">LOCK IN</button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4">
                        <div class="grid grid-cols-10 gap-2">
                            <div v-for="champ in filteredChampions" :key="champ.id" @click="selectChamp(champ.id)" class="aspect-square bg-gray-900 border border-gray-700 rounded cursor-pointer relative group overflow-hidden transition-all" :class="hoveredChampId === champ.id ? 'ring-2 ring-blue-500 border-transparent' : 'hover:border-gray-500'">
                                <img :src="getChampImage(champ.id)" class="w-full h-full object-cover">
                                <div class="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-center text-white py-1 truncate px-1">{{ champ.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="flex flex-col h-full p-8 items-center justify-center space-y-8 animate-fade-in">
                    <div class="text-center space-y-2">
                        <h2 class="text-3xl font-bold text-white">Draft Completed</h2>
                        <p class="text-gray-400">Review your lineup, swap champions if needed, and set your tactics.</p>
                    </div>
                    <button @click="isSwapMode = !isSwapMode" class="px-6 py-3 rounded border font-bold transition-all flex items-center gap-3 text-lg" :class="isSwapMode ? 'bg-yellow-600 text-black border-yellow-500 ring-4 ring-yellow-500/20' : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'">
                        <span class="text-2xl">⇄</span><span>{{ isSwapMode ? 'SELECT PLAYERS TO SWAP' : 'ENABLE SWAP MODE' }}</span>
                    </button>
                    <div class="w-full h-px bg-gray-700"></div>
                    <div class="w-full grid grid-cols-2 gap-8">
                        <div>
                            <label class="block text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Focus Lane</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button v-for="opt in ['TOP', 'MID', 'BOT']" :key="opt" @click="selectedFocus = opt as FocusLane" class="py-3 rounded text-sm font-bold border transition-all" :class="selectedFocus === opt ? 'bg-green-600 text-white border-green-500' : 'bg-gray-700 text-gray-400 border-gray-600'">{{ opt }}</button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">Playstyle</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button v-for="opt in ['BALANCED', 'AGGRESSIVE']" :key="opt" @click="selectedStyle = opt as PlayStyle" class="py-3 rounded text-sm font-bold border transition-all" :class="selectedStyle === opt ? 'bg-purple-600 text-white border-purple-500' : 'bg-gray-700 text-gray-400 border-gray-600'">{{ opt }}</button>
                            </div>
                        </div>
                    </div>
                    <button @click="handleStartMatch" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg shadow-xl text-xl tracking-widest transition-transform active:scale-95 mt-auto">START MATCH</button>
                </div>
            </div>
            <div class="col-span-3 flex flex-col gap-2">
                <div class="flex gap-1 mb-2 justify-end">
                    <div v-for="(ban, idx) in redBans" :key="'r-ban-'+idx" class="w-10 h-10 border border-gray-600 rounded overflow-hidden relative" :class="getSlotClass('RED', 'BAN', idx)">
                         <img v-if="ban" :src="getChampImage(ban)" class="w-full h-full object-cover grayscale">
                         <div v-if="ban" class="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-lg">/</div>
                    </div>
                </div>
                <div class="flex-1 flex flex-col gap-2">
                    <div v-for="i in 5" :key="'r-pick-'+(i-1)" class="flex-1 rounded border border-gray-700 relative overflow-hidden flex items-center p-2 justify-end transition-all" :class="getSlotClass('RED', 'PICK', i-1)">
                        <div v-if="redPicks.has(i-1)" class="absolute inset-0 z-0"><img :src="getChampBack(redPicks.get(i-1)!)" class="w-full h-full object-cover object-[80%_20%] opacity-50"></div>
                        <div class="relative z-10 flex items-center gap-3 w-full flex-row-reverse text-right">
                            <div class="w-12 h-12 bg-gray-900 rounded-full border-2 border-gray-600 flex items-center justify-center">
                                <span v-if="!redPicks.has(i-1)" class="text-gray-500 font-bold text-lg">{{ i }}</span>
                                <img v-else :src="getChampImage(redPicks.get(i-1)!)" class="w-full h-full rounded-full object-cover">
                            </div>
                            <div>
                                <div class="text-xs text-red-300 font-bold uppercase">Red Pick {{ i }}</div>
                                <div class="font-bold text-white text-lg shadow-black drop-shadow-md">{{ redPicks.get(i-1) ? CHAMPIONS_DB.find(c => c.id === redPicks.get(i-1))?.name : '...' }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </GameLayout>
</template>