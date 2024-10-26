import { IPayoutResponse, PayoutResponse } from "./PayoutResponse";

export interface IPayoutScopeResponse {
    label: string;
    payouts: IPayoutResponse[];
}

// Class implementation for PayoutScopeResponse
export class PayoutScopeResponse implements IPayoutScopeResponse {
    label: string;
    payouts: PayoutResponse[];

    constructor(data: Partial<IPayoutScopeResponse> = {}) {
        this.label = data.label || '';
        this.payouts = (data.payouts || []).map(payout => new PayoutResponse(payout));
    }

    static fromJson(json: any): PayoutScopeResponse {
        return new PayoutScopeResponse({
            label: json.label || '',
            payouts: (json.payouts || []).map((payout: any) => PayoutResponse.fromJson(payout)),
        });
    }

    toJson(): IPayoutScopeResponse {
        return {
            label: this.label,
            payouts: this.payouts.map(payout => payout.toJson()),
        };
    }

    copyWith(changes: Partial<IPayoutScopeResponse>): PayoutScopeResponse {
        return new PayoutScopeResponse({
            ...this.toJson(),
            ...changes,
        });
    }
}