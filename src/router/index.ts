import { createRouter, createWebHistory } from "vue-router";
import { useGameStore } from "@/ui/stores/gameStore"; 
import MarketView from "@/ui/views/MarketView.vue"; 
import MyTeamView from "@/ui/views/MyTeamView.vue";
import MatchDetailsView from "@/ui/views/MatchDetailsView.vue";
import PlayerView from "@/ui/views/PlayerView.vue";
import TeamView from "@/ui/views/TeamView.vue";
import DashboardView from "@/ui/views/DashboardView.vue";
import StandingsView from "@/ui/views/StandingsView.vue";
import MatchLobbyView from "@/ui/views/MatchLobbyView.vue";
import ScheduleView from "@/ui/views/ScheduleView.vue";
import LeagueStatsView from "@/ui/views/LeagueStatsView.vue";
import NewGameView from "@/ui/views/NewGameView.vue"; 

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'dashboard', component: DashboardView },
        { path: '/new-game', name: 'new-game', component: NewGameView }, 
        { path: '/my-team', name: 'my-team', component: MyTeamView },
        { path: '/market', name: 'market', component: MarketView },
        { path: '/player/:id', name: 'player', component: PlayerView },
        { path: '/standings', name: 'standings', component: StandingsView },
        { path: '/team/:id', name: 'team', component: TeamView },
        { path: '/match/:id', name: 'match-details', component: MatchDetailsView },
        { path: '/lobby', name: 'lobby', component: MatchLobbyView },
        { path: '/schedule', name: 'schedule', component: ScheduleView },
        { path: '/stats', name: 'league-stats', component: LeagueStatsView },
    ]
});

router.beforeEach((to, from, next) => {
    const store = useGameStore();
    if (to.name !== 'new-game' && !store.isGameStarted) {
        const save = localStorage.getItem('summoners-manager-save');
        if (!save) {
            next({ name: 'new-game' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;