<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/ui/stores/gameStore';
import { generateLeagueTeams } from '@/core/generators/teamGenerator';

const store = useGameStore();
const router = useRouter();

const currentStep = ref(1);

// --- MANAGER FORM ---
const name = ref('');
const nationality = ref('Brazil');
const background = ref<'EX_PLAYER' | 'ANALYST' | 'BUSINESS' | 'ROOKIE'>('ROOKIE');

// ALTERAÇÃO 1: Atributos começam em 5
const attributes = ref({
    man_management: 5,
    training: 5,
    tactical: 5,
    negotiation: 5,
    scouting: 5
});

const pointsLeft = ref(10); // Pontos livres para distribuir

// Configuração dos Backgrounds e seus Bônus
const backgrounds = {
    'EX_PLAYER': { 
        label: 'Ex-Pro Player', 
        desc: 'Respected by players. Bonus to Man Management.', 
        bonusAttr: 'man_management',
        bonusVal: 5 
    },
    'ANALYST': { 
        label: 'Analyst', 
        desc: 'Tactical genius. Bonus to Tactics & Scouting.', 
        bonusAttr: 'tactical',
        bonusVal: 5 
    },
    'BUSINESS': { 
        label: 'Suit & Tie', 
        desc: 'Great with money. Bonus to Negotiation.', 
        bonusAttr: 'negotiation',
        bonusVal: 5 
    },
    'ROOKIE': { 
        label: 'SoloQ Hero', 
        desc: 'Starting from scratch. No initial reputation.', 
        bonusAttr: null,
        bonusVal: 0 
    }
};

// Função auxiliar para pegar o bônus atual
const getBonus = (attrKey: string) => {
    const bg = backgrounds[background.value];
    // Se for ANALYST, dá bonus em Tactical e Scouting (exemplo de bonus duplo se quiser)
    // Mas simplificando conforme a estrutura:
    if (background.value === 'ANALYST' && (attrKey === 'tactical' || attrKey === 'scouting')) return 3; // Exemplo: Analista ganha +3 em dois
    
    // Lógica Padrão:
    return bg.bonusAttr === attrKey ? bg.bonusVal : 0;
};

const updateAttr = (key: keyof typeof attributes.value, delta: number) => {
    const currentVal = attributes.value[key];
    
    // Limite máximo de 20 contando com o bônus? Ou só os pontos base?
    // Vamos limitar os pontos base a 15, para que com bônus chegue a 20 max.
    
    if (delta > 0 && pointsLeft.value > 0 && currentVal < 15) {
        attributes.value[key]++;
        pointsLeft.value--;
    } else if (delta < 0 && currentVal > 1) { // Mínimo 1 ponto base
        attributes.value[key]--;
        pointsLeft.value++;
    }
};

// --- TEAM SELECTION ---
const availableTeams = ref(generateLeagueTeams());
const selectedTeamAcronym = ref(availableTeams.value[0].acronym);

// --- ACTIONS ---
const nextStep = () => {
    if (!name.value) return alert("Please enter your name.");
    currentStep.value = 2;
};

const startGame = () => {
    // Calcula os atributos finais (Base + Bonus) antes de salvar
    const finalAttributes = { ...attributes.value };
    (Object.keys(finalAttributes) as Array<keyof typeof finalAttributes>).forEach(key => {
        finalAttributes[key] += getBonus(key);
    });

    const newManager = {
        name: name.value,
        age: 25,
        nationality: nationality.value,
        background: background.value,
        attributes: finalAttributes, // Salva já somado
        reputation: background.value === 'EX_PLAYER' ? 50 : 10
    };

    store.startCareer(newManager, selectedTeamAcronym.value);
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen bg-[#0f1115] text-white flex items-center justify-center p-4">
        <div class="max-w-4xl w-full bg-[#161920] rounded-xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            <div class="w-full md:w-1/3 bg-linear-to-br from-blue-900 to-gray-900 p-8 flex flex-col justify-between relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Swain_0.jpg')] opacity-20 bg-cover bg-center grayscale mix-blend-overlay"></div>
                
                <div class="relative z-10">
                    <h1 class="text-4xl font-black mb-2 tracking-tighter">NEW CAREER</h1>
                    <p class="text-blue-200 text-sm">Season 2026</p>
                </div>

                <div class="relative z-10 mt-10">
                    <div class="text-8xl mb-4">👔</div>
                    <div class="font-bold text-xl">{{ name || 'Manager Name' }}</div>
                    <div class="text-sm text-gray-400">{{ backgrounds[background].label }}</div>
                </div>

                <div class="relative z-10 mt-auto pt-10">
                    <div class="flex gap-2 mb-2">
                        <div v-for="i in 3" :key="i" class="h-1 flex-1 rounded-full" :class="currentStep >= i ? 'bg-blue-500' : 'bg-gray-700'"></div>
                    </div>
                    <div class="text-xs text-gray-400 uppercase tracking-widest">Step {{ currentStep }} of 2</div>
                </div>
            </div>

            <div class="flex-1 p-8">
                
                <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
                    <h2 class="text-xl font-bold border-b border-gray-800 pb-2">Create Your Profile</h2>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                            <input v-model="name" type="text" class="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" placeholder="Enter name...">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nationality</label>
                            <select v-model="nationality" class="w-full bg-gray-900 border border-gray-700 rounded p-2 outline-none">
                                <option>Brazil</option> <option>South Korea</option> <option>China</option> <option>Europe</option> <option>North America</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Background</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button v-for="(bg, key) in backgrounds" :key="key"
                                @click="background = key as any"
                                class="p-3 rounded border text-left transition-all relative overflow-hidden"
                                :class="background === key ? 'bg-blue-900/30 border-blue-500' : 'bg-gray-900 border-gray-700 hover:border-gray-500'"
                            >
                                <div class="font-bold text-sm relative z-10" :class="background === key ? 'text-blue-400' : 'text-gray-300'">{{ bg.label }}</div>
                                <div class="text-[10px] text-gray-500 leading-tight mt-1 relative z-10">{{ bg.desc }}</div>
                                
                                <div v-if="background === key" class="absolute top-0 right-0 p-1">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase">Attributes</label>
                            <span class="text-xs font-bold" :class="pointsLeft > 0 ? 'text-blue-400' : 'text-gray-500'">Points: {{ pointsLeft }}</span>
                        </div>
                        
                        <div class="space-y-3 bg-gray-900 p-4 rounded border border-gray-800">
                            <div v-for="(val, key) in attributes" :key="key" class="flex items-center gap-3">
                                <span class="w-32 text-xs font-bold text-gray-400 uppercase">{{ key.replace('_', ' ') }}</span>
                                
                                <button @click="updateAttr(key, -1)" class="w-6 h-6 bg-gray-800 rounded hover:bg-red-900/50 text-red-400 font-bold flex items-center justify-center transition-colors">-</button>
                                
                                <div class="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden flex relative">
                                    <div class="h-full bg-blue-600 transition-all duration-300" :style="{ width: (val/20)*100 + '%' }"></div>
                                    
                                    <div v-if="getBonus(key) > 0" 
                                         class="h-full bg-yellow-500 transition-all duration-300 relative pattern-diagonal-lines" 
                                         :style="{ width: (getBonus(key)/20)*100 + '%' }"
                                    ></div>
                                </div>
                                
                                <div class="w-10 text-center font-mono font-bold flex items-center justify-center gap-1">
                                    <span class="text-white">{{ val }}</span>
                                    <span v-if="getBonus(key) > 0" class="text-xs text-yellow-500">+{{ getBonus(key) }}</span>
                                </div>

                                <button @click="updateAttr(key, 1)" class="w-6 h-6 bg-gray-800 rounded hover:bg-green-900/50 text-green-400 font-bold flex items-center justify-center transition-colors" :disabled="pointsLeft === 0">+</button>
                            </div>
                        </div>
                        <div class="text-[10px] text-gray-500 mt-2 text-right">* Yellow bars indicate background bonuses</div>
                    </div>

                    <div class="pt-4 text-right">
                        <button @click="nextStep" class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded font-bold shadow-lg transition-transform active:scale-95">NEXT STEP -></button>
                    </div>
                </div>

                <div v-else class="space-y-6 animate-fade-in h-full flex flex-col">
                    <h2 class="text-xl font-bold border-b border-gray-800 pb-2">Select Your Team</h2>
                    
                    <div class="flex-1 overflow-y-auto pr-2 grid grid-cols-1 gap-3 max-h-100">
                        <div v-for="team in availableTeams" :key="team.id"
                             @click="selectedTeamAcronym = team.acronym"
                             class="p-4 rounded border flex items-center gap-4 cursor-pointer transition-all group"
                             :class="selectedTeamAcronym === team.acronym ? 'bg-gray-800 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-900 border-gray-700 hover:border-gray-500'"
                        >
                            <div class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center font-bold text-lg" :class="team.primaryColor">
                                {{ team.acronym }}
                            </div>
                            <div class="flex-1">
                                <div class="font-bold text-white text-lg">{{ team.name }}</div>
                                <div class="text-xs text-gray-500 uppercase font-bold">CBLOL • Budget: ${{ (team.budget/1000000).toFixed(1) }}M</div>
                            </div>
                            <div v-if="selectedTeamAcronym === team.acronym" class="text-blue-500 text-2xl">✓</div>
                        </div>
                    </div>

                    <div class="pt-4 flex justify-between items-center">
                        <button @click="currentStep = 1" class="text-gray-500 hover:text-white font-bold text-sm">BACK</button>
                        <button @click="startGame" class="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded font-bold shadow-lg animate-pulse transition-transform active:scale-95">
                            START CAREER
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }

/* Efeito visual para a barra de bônus */
.pattern-diagonal-lines {
  background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px);
}
</style>