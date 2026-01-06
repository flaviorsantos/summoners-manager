export interface ScheduleMatch {
    id: string;
    day: number;
    homeTeamId: string;
    awayTeamId: string;
    played: boolean;
    winnerId?: string;
}