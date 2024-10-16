import { AdminActivityResponse } from "../team/AdminActivityResponse";
import { AdminProfile } from "./AdminProfile";
import { TeamResponse } from "./TeamResponse";

export interface IAdmin {
    profile: AdminProfile;
    team: TeamResponse;
    activities: AdminActivityResponse[];
}

class Admin implements IAdmin {
    profile: AdminProfile;
    team: TeamResponse;
    activities: AdminActivityResponse[];

    constructor({
        profile = {} as AdminProfile,
        team = {} as TeamResponse,
        activities = []
    }: Partial<IAdmin> = {}) {
        this.profile = profile;
        this.team = team;
        this.activities = activities;
    }

    static empty(): Admin {
        return new Admin();
    }

    copyWith({
        profile,
        team,
        activities
    }: Partial<IAdmin> = {}): Admin {
        return new Admin({
            profile: profile || this.profile,
            team: team || this.team,
            activities: activities || this.activities
        });
    }

    static fromJson(json: any): Admin {
        return new Admin({
            profile: json.profile ? AdminProfile.fromJson(json.profile) : new AdminProfile(),
            team: json.team ? TeamResponse.fromJson(json.team) : new TeamResponse(),
            activities: json.activities ? json.activities.map((a: any) => AdminActivityResponse.fromJson(a)) : [],
        });
    }

    toJson() {
        return {
            profile: this.profile.toJson(),
            team: this.team.toJson(),
            activities: this.activities.map(a => a.toJson())
        };
    }

    get name() {
        return this.profile.firstName + ' ' + this.profile.lastName;
    }

    get short(): string {
        if(this.profile.firstName && this.profile.lastName) {
            return (this.profile.firstName.charAt(0) + this.profile.lastName.charAt(0)).toUpperCase();
        } else if(this.profile.firstName) {
            return this.profile.firstName.charAt(0).toUpperCase();
        } else if(this.profile.lastName) {
            return this.profile.lastName.charAt(0).toUpperCase();
        }
        return "";
    }
}

export default Admin;