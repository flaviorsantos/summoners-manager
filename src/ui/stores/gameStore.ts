import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Team } from '../../core/domain/Team';
import { teamGenerator } from '../../core/generators/teamGenerator';
import { scheduleGenerator } from '../../core/generators/scheduleGenerator';
import { MatchEngine } from '../../core/simulation/MatchEngine';
import { CHAMPIONS_DB } from '../../core/domain/Champions';

export const useGameStore = defineStore('game', () => {
  const teams = ref<Team[]>([]);
  const userTeamId = ref<string | null>(null);
  const currentWeek = ref(1);
  const schedule = ref<any[]>([]);
  const matchHistory = ref<any[]>([]);

  const userTeam = computed(() => teams.value.find(t => t.id === userTeamId.value));
  
  // Tabela de Classificação Robusta
  const standings = computed(() => {
    return [...teams.value].sort((a, b) => {
      // 1. Pontos
      if (b.stats.championshipPoints !== a.stats.championshipPoints) 
          return b.stats.championshipPoints - a.stats.championshipPoints;
      // 2. Vitórias
      if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
      // 3. Saldo de Kills (Tiebreaker comum)
      const kdaDiffA = a.stats.totalKills - a.stats.totalDeaths;
      const kdaDiffB = b.stats.totalKills - b.stats.totalDeaths;
      return kdaDiffB - kdaDiffA;
    });
  });

  function createNewGame(teamName: string, managerName: string) {
    const generatedTeams = teamGenerator.generateLeague();
    const myTeam = generatedTeams[0];
    myTeam.name = teamName;
    userTeamId.value = myTeam.id;
    teams.value = generatedTeams;
    schedule.value = scheduleGenerator.generate(generatedTeams);
    currentWeek.value = 1;
    matchHistory.value = [];
  }

  function playMatch(blueTeam: Team, redTeam: Team, bluePicks: string[], redPicks: string[]) {
    const engine = new MatchEngine();
    
    // Simulação Profunda
    const result = engine.simulate(blueTeam, redTeam, bluePicks, redPicks);

    // Atualização de Tabela (Agregação de Stats)
    const updateStats = (team: Team, isWinner: boolean, score: number, enemyScore: number) => {
        team.stats.matchesPlayed++;
        if (isWinner) {
            team.stats.wins++;
            team.stats.championshipPoints += 3; // 3pts por vitória (Padrão FPS/Futebol)
        } else {
            team.stats.losses++;
        }
        team.stats.totalKills += score;
        team.stats.totalDeaths += enemyScore;
    };

    // Calcula placar total do time baseado na soma dos jogadores
    const bScore = result.playerStats.slice(0, 5).reduce((acc: any, p: { kills: any; }) => acc + p.kills, 0);
    const rScore = result.playerStats.slice(5, 10).reduce((acc: any, p: { kills: any; }) => acc + p.kills, 0);

    // Injeta o placar no resultado (faltava isso antes)
    result.blueScore = bScore;
    result.redScore = rScore;

    updateStats(blueTeam, result.winner === 'BLUE', bScore, rScore);
    updateStats(redTeam, result.winner === 'RED', rScore, bScore);

    matchHistory.value.push(result);
    return result;
  }

  function advanceWeek() {
    const weekData = schedule.value.find(s => s.week === currentWeek.value);
    if (!weekData) return;

    weekData.matches.forEach((m: any) => {
      const blue = teams.value.find(t => t.id === m.blueTeamId);
      const red = teams.value.find(t => t.id === m.redTeamId);
      
      if (blue && red && blue.id !== userTeamId.value && red.id !== userTeamId.value) {
        // Para IAs, escolhe picks baseados na pool do jogador
        const getPicks = (t: Team) => t.roster.slice(0,5).map(p => 
            p.championPool[0]?.championName ? CHAMPIONS_DB.find(c => c.name === p.championPool[0].championName)?.id || 'Garen' : 'Garen'
        );
        playMatch(blue, red, getPicks(blue), getPicks(red));
      }
    });
    currentWeek.value++;
  }

  return { teams, userTeamId, userTeam, currentWeek, schedule, standings, matchHistory, createNewGame, playMatch, advanceWeek };
});