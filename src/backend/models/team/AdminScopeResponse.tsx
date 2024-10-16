import AccountAuthResponse from "../account/AccountAuthResponse";
import AccountMFAChallengeResponse from "../account/AccountMFAChallengeResponse";
import AccountMFAResponse from "../account/AccountMFAResponse";
import AccountSessionResponse from "../account/AccountSessionResponse";
import AnalysisResponse from "../account/AnalysisResponse";
import { IAdmin } from "../profile/Admin";
import { AdminProfile } from "../profile/AdminProfile";
import { TeamResponse } from "../profile/TeamResponse";
import { AdminActivityResponse } from "./AdminActivityResponse";
import { CompanyStructureResponse } from "./CompanyStructureResponse";

interface IAdminScopeResponse extends IAdmin {
    auth: AccountAuthResponse;
    structure: CompanyStructureResponse;
    mfa: AccountMFAResponse;
    challenges: AccountMFAChallengeResponse[];
    sessions: AccountSessionResponse[];
    analysis: AnalysisResponse;
}

class AdminScopeResponse implements IAdminScopeResponse {
    constructor(
        public profile: AdminProfile,
        public team: TeamResponse,
        public activities: AdminActivityResponse[],
        public auth: AccountAuthResponse,
        public structure: CompanyStructureResponse,
        public mfa: AccountMFAResponse,
        public challenges: AccountMFAChallengeResponse[],
        public sessions: AccountSessionResponse[],
        public analysis: AnalysisResponse
    ) { }

    static fromJson(data: any): AdminScopeResponse {
        return new AdminScopeResponse(
            AdminProfile.fromJson(data.profile),
            TeamResponse.fromJson(data.team),
            data['activities']
                ? data['activities'].map((activity: any) => AdminActivityResponse.fromJson(activity))
                : [],
            AccountAuthResponse.fromJson(data.auth),
            CompanyStructureResponse.fromJson(data.structure),
            AccountMFAResponse.fromJson(data.mfa),
            data.challenges
                ? data.challenges.map((challenge: any) => AccountMFAChallengeResponse.fromJson(challenge))
                : [],
            data.sessions
                ? data.sessions.map((session: any) => AccountSessionResponse.fromJson(session))
                : [],
            AnalysisResponse.fromJson(data.analysis)
        );
    }

    toJson(): any {
        return {
            profile: this.profile.toJson(),
            team: this.team.toJson(),
            activites: this.activities.map((activity) => activity.toJson()),
            auth: this.auth.toJson(),
            structure: this.structure.toJson(),
            mfa: this.mfa.toJson(),
            challenges: this.challenges.map((challenge) => challenge.toJson()),
            sessions: this.sessions.map((session) => session.toJson()),
            analysis: this.analysis.toJson(),
        };
    }

    copyWith(updatedData: Partial<IAdminScopeResponse>): AdminScopeResponse {
        return new AdminScopeResponse(
            updatedData.profile || this.profile,
            updatedData.team || this.team,
            updatedData.activities || this.activities,
            updatedData.auth || this.auth,
            updatedData.structure || this.structure,
            updatedData.mfa || this.mfa,
            updatedData.challenges || this.challenges,
            updatedData.sessions || this.sessions,
            updatedData.analysis || this.analysis
        );
    }
}

export default AdminScopeResponse