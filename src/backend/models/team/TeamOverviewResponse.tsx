import { MetricResponse } from '../metric/MetricResponse';
import { AdminActivityResponse } from './AdminActivityResponse';
import { CompanyStructureResponse } from './CompanyStructureResponse';

export interface ITeamOverviewResponse {
    overview: MetricResponse[];
    teams: MetricResponse[];
    activities: AdminActivityResponse[];
    structure: CompanyStructureResponse | null;
}

export class TeamOverviewResponse implements ITeamOverviewResponse {
    overview: MetricResponse[];
    teams: MetricResponse[];
    activities: AdminActivityResponse[];
    structure: CompanyStructureResponse | null;

    constructor({ overview = [], teams = [], activities = [], structure = null }: Partial<ITeamOverviewResponse> = {}) {
        this.overview = overview;
        this.teams = teams;
        this.activities = activities;
        this.structure = structure;
    }

    copyWith({ overview, teams, activities, structure }: Partial<ITeamOverviewResponse> = {}): TeamOverviewResponse {
        return new TeamOverviewResponse({
            overview: overview || this.overview,
            teams: teams || this.teams,
            activities: activities || this.activities,
            structure: structure || this.structure,
        });
    }

    static fromJson(json: any): TeamOverviewResponse {
        return new TeamOverviewResponse({
            overview: json.overview ? json.overview.map((metric: any) => MetricResponse.fromJson(metric)) : [],
            teams: json.teams ? json.teams.map((metric: any) => MetricResponse.fromJson(metric)) : [],
            activities: json.activities ? json.activities.map((activity: any) => AdminActivityResponse.fromJson(activity)) : [],
            structure: json.structure ? CompanyStructureResponse.fromJson(json.structure) : null,
        });
    }

    toJson(): any {
        return {
            overview: this.overview.map(metric => metric.toJson()),
            teams: this.teams.map(metric => metric.toJson()),
            activities: this.activities.map(activity => activity.toJson()),
            structure: this.structure ? this.structure.toJson() : null,
        };
    }
}