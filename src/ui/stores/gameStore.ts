import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { generatePlayer } from "@/core/generators/playerGenerator";
import { generateLeagueTeams } from "@/core/generators/teamGenerator";
import { generateSchedule } from "@/core/generators/scheduleGenerator";
import type { Player, PlayerAttributes, ChampionMastery } from "@/core/domain/Player";
import type { Team } from "@/core/domain/Team";
import type { ScheduleMatch } from "@/core/domain/Schedule";
import { type FullMatchResult, simulateMatch } from "@/core/simulation/MatchEngine";
import type { GameTactics } from "@/core/domain/Tactics";
import { simulateDraft, type DraftOrders } from "@/core/simulation/DraftEngine";
import { CHAMPIONS_DB } from "@/core/domain/Champions";
import { REAL_PLAYERS_2026 } from "@/core/data/RealPlayers2026";
import type { Manager } from "@/core/domain/Manager"; 
import { v4 as uuidv4 } from 'uuid';
import { initializeSoloQ, simulateDailySoloQ } from "@/core/simulation/SoloQEngine";

export const useGameStore = defineStore("game", () => {
    const manager = ref<Manager | null>(null); 
    const players = ref<Player[]>([]);
    const teams = ref<Team[]>([]);
    const day = ref(1);
    const budget = ref(5000000);
    const myTeamId = ref("");
    const schedule = ref<ScheduleMatch[]>([]);
    const matchArchive = ref<FullMatchResult[]>([]);
    const lastMatchResult = ref<FullMatchResult | null>(null);
    const newsFeed = ref<string[]>([]);
    const isGameStarted = ref(false);

    const currentWeekday = computed(() => (day.value + 2) % 7);
    const nextMatch = computed(() => schedule.value.filter(m => !m.played && (m.homeTeamId === myTeamId.value || m.awayTeamId === myTeamId.value)).sort((a, b) => a.day - b.day)[0]);
    const myTeamName = computed(() => teams.value.find(t => t.id === myTeamId.value)?.name || "My Team");
    const getTeamName = (id: string) => teams.value.find(t => t.id === id)?.name || "Unknown";
    const myRoster = computed(() => players.value.filter(p => p.team === myTeamId.value));
    const marketPlayers = computed(() => players.value.filter(p => p.team === 'Free Agent'));
    
    function createRealPlayer(realData: typeof REAL_PLAYERS_2026[0], teamId: string): Player {
        const base = realData.overall;
        const attr = (mod: number) => Math.max(1, Math.min(99, base + Math.floor(Math.random() * mod * 2) - mod));
        
        const attributes: PlayerAttributes = {
            laning: attr(5), farming: attr(5), roaming: attr(10),
            mechanics: attr(5), reflexes: attr(5), aggression: attr(15),
            macro: attr(5), vision: attr(10), shotcalling: attr(15), teamfight: attr(5)
        };

        const validChamps = CHAMPIONS_DB.filter(c => c.roles.includes(realData.role));
        const championPool: ChampionMastery[] = [];
        for(let i=0; i<6; i++) {
            if (validChamps.length > i) {
                championPool.push({
                    championName: validChamps[Math.floor(Math.random() * validChamps.length)].name,
                    masteryLevel: Math.floor(Math.random() * 40) + 60
                });
            }
        }

        return {
           id: uuidv4(),
            name: realData.name,
            nickname: realData.nickname,
            gender: 'MALE', 
            role: realData.role,
            age: realData.age,
            country: realData.country,
            team: teamId,
            overall: realData.overall,
            potential: realData.potential,
            attributes,
            championPool,
            contract: { salary: Math.floor(realData.overall * 15000), expires: 1 },
            matchHistory: [],
        };
    }

    function startCareer(newManager: Manager, selectedTeamAcronym: string) {
        console.log("Starting Career...");
        
        manager.value = newManager;
        teams.value = generateLeagueTeams();
        
        const starterTeam = teams.value.find(t => t.acronym === selectedTeamAcronym);

        if (!starterTeam) {
            console.error("Available teams:", teams.value.map(t => t.acronym));
            throw new Error(`Team not found with acronym: ${selectedTeamAcronym}`);
        }
        
        myTeamId.value = starterTeam.id;
        budget.value = starterTeam.budget;
        
        players.value = [];
        
        teams.value.forEach(team => {
            const teamRealPlayers = REAL_PLAYERS_2026.filter(p => p.teamId === team.acronym);
            teamRealPlayers.forEach(rp => players.value.push(createRealPlayer(rp, team.id)));

            const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'] as const;
            roles.forEach(role => {
                const hasRole = players.value.some(p => p.team === team.id && p.role === role);
                if (!hasRole) {
                    const p = generatePlayer(role);
                    p.team = team.id;
                    players.value.push(p);
                }
            });
        });

        const realFreeAgents = REAL_PLAYERS_2026.filter(p => p.teamId === 'Free Agent');
        realFreeAgents.forEach(rp => players.value.push(createRealPlayer(rp, 'Free Agent')));
        while(players.value.filter(p => p.team === 'Free Agent').length < 30) {
             players.value.push(generatePlayer());
        }

        players.value.forEach(p => initializeSoloQ(p));

        schedule.value = generateSchedule(teams.value);
        day.value = 1;
        matchArchive.value = [];
        newsFeed.value = [];
        isGameStarted.value = true;
        
        addNews(`Welcome, ${manager.value.name}! The new Head Coach of ${starterTeam.name}.`);
    }
    
    function processMatchResult(result: FullMatchResult, homeId: string, awayId: string) {
        const homeTeam = teams.value.find(t => t.id === homeId);
        const awayTeam = teams.value.find(t => t.id === awayId);
        if (homeTeam && awayTeam) {
            if (result.winner === 'BLUE') { homeTeam.stats.wins++; awayTeam.stats.losses++; } 
            else { homeTeam.stats.losses++; awayTeam.stats.wins++; }
        }
        result.playerStats.forEach((stats, playerId) => {
            const player = players.value.find(p => p.id === playerId);
            if (player) {
                stats.opponentTeamId = player.team === homeId ? awayId : homeId;
                if (!player.matchHistory) player.matchHistory = [];
                player.matchHistory.unshift(stats);
                const champName = stats.championName;
                const poolIndex = player.championPool.findIndex(c => c.championName === champName);
                if (poolIndex === -1 && champName !== 'Unknown' && champName !== 'Random') {
                    const champDb = CHAMPIONS_DB.find(c => c.name === champName);
                    let baseMastery = 10;
                    if (stats.rating >= 7.5) baseMastery += 15;
                    player.championPool.push({ championName: champName, masteryLevel: baseMastery });
                    if (player.team === myTeamId.value) addNews(`${player.nickname} added ${champName} to their Pool!`);
                } else if (poolIndex !== -1) {
                    const xpGain = Math.floor(stats.rating * 2);
                    player.championPool[poolIndex].masteryLevel = Math.min(100, player.championPool[poolIndex].masteryLevel + xpGain);
                }
            }
        });
    }

    function playLeagueMatch(tactics?: GameTactics, draftOrders?: DraftOrders, customLineup?: Player[]) {
        const match = nextMatch.value;
        if (!match || match.day !== day.value) { alert("No match today!"); return; }
        const enemyId = match.homeTeamId === myTeamId.value ? match.awayTeamId : match.homeTeamId;
        
        let myTeamSorted: Player[];
        if (customLineup && customLineup.length === 5) {
            myTeamSorted = customLineup;
        } else {
            const roleOrder = { 'TOP': 1, 'JUNGLE': 2, 'MID': 3, 'ADC': 4, 'SUPPORT': 5 };
            myTeamSorted = players.value.filter(p => p.team === myTeamId.value).sort((a, b) => (roleOrder[a.role as keyof typeof roleOrder] || 9) - (roleOrder[b.role as keyof typeof roleOrder] || 9)).slice(0, 5);
        }
        const roleOrder = { 'TOP': 1, 'JUNGLE': 2, 'MID': 3, 'ADC': 4, 'SUPPORT': 5 };
        const enemyTeamSorted = players.value.filter(p => p.team === enemyId).sort((a, b) => (roleOrder[a.role as keyof typeof roleOrder] || 9) - (roleOrder[b.role as keyof typeof roleOrder] || 9)).slice(0, 5);

        const draft = simulateDraft(myTeamSorted, enemyTeamSorted, draftOrders);
        const result = simulateMatch(myTeamSorted, enemyTeamSorted, day.value, myTeamId.value, enemyId, tactics, draft);
        result.matchId = match.id; 
        processMatchResult(result, myTeamId.value, enemyId);
        lastMatchResult.value = result;
        archiveMatch(result);
        match.played = true;
        match.winnerId = result.winner === 'BLUE' ? match.homeTeamId : match.awayTeamId;
        addNews(`Match vs ${getTeamName(enemyId)}: ${match.winnerId === myTeamId.value ? "VICTORY" : "DEFEAT"} (${result.blueScore}-${result.redScore})`);
        advanceDay();
    }

    function archiveMatch(result: FullMatchResult) {
        matchArchive.value.push(result);
        if (matchArchive.value.length > 50) matchArchive.value.shift();
    }

    function advanceDay() {
        console.log(`Simulating Day ${day.value}...`);
        simulateDailySoloQ(players.value);
        const todayMatches = schedule.value.filter(m => m.day === day.value && !m.played);
        todayMatches.forEach(match => {
            if (match.homeTeamId === myTeamId.value || match.awayTeamId === myTeamId.value) return; 
            const homePlayers = players.value.filter(p => p.team === match.homeTeamId).slice(0, 5);
            const awayPlayers = players.value.filter(p => p.team === match.awayTeamId).slice(0, 5);
            const draft = simulateDraft(homePlayers, awayPlayers);
            const result = simulateMatch(homePlayers, awayPlayers, day.value, match.homeTeamId, match.awayTeamId, undefined, draft);
            result.matchId = match.id; 
            match.played = true;
            match.winnerId = result.winner === 'BLUE' ? match.homeTeamId : match.awayTeamId;
            processMatchResult(result, match.homeTeamId, match.awayTeamId);
            archiveMatch(result); 
        });
        const myMatchToday = schedule.value.find(m => m.day === day.value && (m.homeTeamId === myTeamId.value || m.awayTeamId === myTeamId.value));
        if (!myMatchToday || myMatchToday.played) day.value++;
    }

    function addNews(text: string) {
        newsFeed.value.unshift(`[Day ${day.value}] ${text}`);
        if (newsFeed.value.length > 20) newsFeed.value.pop();
    }
    
    function signPlayer(id: string) { 
        const p = players.value.find(p => p.id === id);
        if(p && budget.value >= p.contract.salary) {
            p.team = myTeamId.value;
            budget.value -= p.contract.salary;
            addNews(`Signed ${p.nickname} for $${p.contract.salary}`);
        }
    }

    function releasePlayer(id: string) {
        const p = players.value.find(p => p.id === id);
        if(p) { p.team = 'Free Agent'; addNews(`Released ${p.nickname}`); }
    }

    function playScrim() { console.log("Scrim not implemented yet"); }
    function simulateWeek() { let safe = 0; while(safe < 7 && (!nextMatch.value || nextMatch.value.day > day.value)) { advanceDay(); safe++; } }

    async function loadGame() {
        const save = localStorage.getItem('summoners-manager-save');
        if (save) {
            try {
                const data = JSON.parse(save);
                manager.value = data.manager || null; // <--- LOAD MANAGER
                players.value = data.players;
                teams.value = data.teams;
                day.value = data.day;
                budget.value = data.budget;
                myTeamId.value = data.myTeamId;
                schedule.value = data.schedule;
                matchArchive.value = data.matchArchive || [];
                newsFeed.value = data.newsFeed || [];
                isGameStarted.value = true;
                console.log("Game loaded.");
            } catch(e) { console.error("Save error", e); }
        }
    }
    loadGame();

    watch([day, budget, myTeamId, players, teams, schedule, matchArchive, newsFeed, manager], () => {
        if (!isGameStarted.value) return; 
        const stateToSave = {
            manager: manager.value,
            players: players.value, teams: teams.value, day: day.value, budget: budget.value,
            myTeamId: myTeamId.value, schedule: schedule.value, matchArchive: matchArchive.value, newsFeed: newsFeed.value
        };
        localStorage.setItem('summoners-manager-save', JSON.stringify(stateToSave));
    }, { deep: true });

    return {
        manager, players, teams, day, budget, myTeamId, myTeamName, schedule, matchArchive, lastMatchResult, newsFeed, isGameStarted,
        startCareer, signPlayer, releasePlayer, playLeagueMatch, playScrim, advanceDay, simulateWeek,
        nextMatch, currentWeekday, getTeamName, myRoster, marketPlayers
    };
});