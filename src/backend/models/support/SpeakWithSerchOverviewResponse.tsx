import SpeakWithSerchResponse from "./SpeakWithSerchResponse";

export interface ISpeakWithSerchOverviewResponse {
    assigned: SpeakWithSerchResponse[];
    others: SpeakWithSerchResponse[];
}

class SpeakWithSerchOverviewResponse implements ISpeakWithSerchOverviewResponse {
    assigned: SpeakWithSerchResponse[];
    others: SpeakWithSerchResponse[];

    constructor({
        assigned = [],
        others = [],
    }: Partial<ISpeakWithSerchOverviewResponse> = {}) {
        this.assigned = assigned;
        this.others = others;
    }

    static fromJson(json: any): SpeakWithSerchOverviewResponse {
        return new SpeakWithSerchOverviewResponse({
            assigned: json.assigned ? json.assigned.map((c: any) => SpeakWithSerchResponse.fromJson(c)) : [],
            others: json.others ? json.others.map((c: any) => SpeakWithSerchResponse.fromJson(c)) : [],
        });
    }

    toJson(): any {
        return {
            assigned: this.assigned.map(c => c.toJson()),
            others: this.others.map(c => c.toJson()),
        };
    }

    copyWith({
        assigned = this.assigned,
        others = this.others,
    }: Partial<ISpeakWithSerchOverviewResponse> = {}): SpeakWithSerchOverviewResponse {
        return new SpeakWithSerchOverviewResponse({
            assigned,
            others,
        });
    }
}

export default SpeakWithSerchOverviewResponse