import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Team } from '../../core/domain/Team';
import type { MatchStats } from '../../core/domain/Stats';
import { teamGenerator } from '../../core/generators/teamGenerator';
import { scheduleGenerator } from '../../core/generators/scheduleGenerator';
import { MatchEngine } from '../../core/simulation/MatchEngine';
import { CHAMPIONS_DB } from '../../core/domain/Champions';

export const useGameStore = defineStore('game', () => {
  // --- ESTADO ---
  const teams = ref<Team[]>([]);
  const userTeamId = ref<string | null>(null);
  const currentWeek = ref(1);
  const schedule = ref<any[]>([]);
  const matchHistory = ref<any[]>([]);

  // --- GETTERS ---
  const userTeam = computed(() => teams.value.find(t => t.id === userTeamId.value));
  
  const standings = computed(() => {
    return [...teams.value].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.points - a.points;
    });
  });

  // --- INICIALIZAÇÃO ---
  function createNewGame(teamName: string, managerName: string) {
    const generatedTeams = teamGenerator.generateLeague();
    
    // O primeiro time gerado vira o do player
    const myTeam = generatedTeams[0];
    myTeam.name = teamName;
    userTeamId.value = myTeam.id;
    
    teams.value = generatedTeams;
    schedule.value = scheduleGenerator.generate(generatedTeams);
    currentWeek.value = 1;
    matchHistory.value = [];
  }

  /**
   * PLAY MATCH
   * Agora recebe os picks decididos no Draft Lobby.
   * Não precisamos mais de 'DraftOrders' ou 'simulateDraft' aqui dentro,
   * pois o Draft interativo já resolveu isso.
   */
  function playMatch(
    blueTeam: Team, 
    redTeam: Team, 
    bluePicks: string[], // IDs vindos do Lobby
    redPicks: string[]   // IDs vindos do Lobby
  ) {
    const engine = new MatchEngine();
    
    // Executa a simulação com os campeões reais
    const result = engine.simulate(
      blueTeam, 
      redTeam, 
      bluePicks, 
      redPicks
    );

    // Atualiza vitórias/derrotas
    if (result.winner === 'BLUE') {
      blueTeam.wins++;
      redTeam.losses++;
    } else {
      redTeam.wins++;
      blueTeam.losses++;
    }

    // Registra no histórico
    const matchRecord = {
      week: currentWeek.value,
      blueTeam: blueTeam.name,
      redTeam: redTeam.name,
      winner: result.winner,
      stats: result.playerStats,
      duration: result.duration
    };

    matchHistory.value.push(matchRecord);
    return matchRecord;
  }

  /**
   * ADVANCE WEEK
   * Simula os outros jogos da liga enquanto o player faz o dele.
   */
  function advanceWeek() {
    const weekData = schedule.value.find(s => s.week === currentWeek.value);
    if (!weekData) return;

    weekData.matches.forEach((m: any) => {
      const blue = teams.value.find(t => t.id === m.blueTeamId)!;
      const red = teams.value.find(t => t.id === m.redTeamId)!;
      
      // Se for um jogo entre IAs, gera picks automáticos baseados na pool
      if (blue.id !== userTeamId.value && red.id !== userTeamId.value) {
        const bluePicks = blue.roster.map(p => p.championPool[0]?.championName || 'Aatrox');
        const redPicks = red.roster.map(p => p.championPool[0]?.championName || 'LeeSin');
        playMatch(blue, red, bluePicks, redPicks);
      }
    });

    currentWeek.value++;
  }

  return {
    teams,
    userTeamId,
    userTeam,
    currentWeek,
    schedule,
    standings,
    matchHistory,
    createNewGame,
    playMatch,
    advanceWeek
  };
});