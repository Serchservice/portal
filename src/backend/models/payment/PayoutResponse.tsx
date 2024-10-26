import { ICommonProfile, CommonProfile } from "../profile/CommonProfile";

// Interface for PayoutResponse
export interface IPayoutResponse {
    id: number;
    admin: ICommonProfile;
    user: ICommonProfile;
    status: string;
    type: string;
    transaction: string;
    event: string;
    amount: string;
    updated_at: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}

// Class implementation for PayoutResponse
export class PayoutResponse implements IPayoutResponse {
    id: number;
    admin: CommonProfile;
    user: CommonProfile;
    status: string;
    type: string;
    transaction: string;
    event: string;
    amount: string;
    updated_at: string;
    bankName: string;
    accountName: string;
    accountNumber: string;

    constructor(data: Partial<IPayoutResponse> = {}) {
        this.id = data.id || 0;
        this.admin = data.admin ? new CommonProfile(data.admin) : new CommonProfile();
        this.user = data.user ? new CommonProfile(data.user) : new CommonProfile();
        this.status = data.status || '';
        this.type = data.type || '';
        this.transaction = data.transaction || '';
        this.event = data.event || '';
        this.amount = data.amount || '';
        this.updated_at = data.updated_at || '';
        this.bankName = data.bankName || '';
        this.accountName = data.accountName || '';
        this.accountNumber = data.accountNumber || '';
    }

    static fromJson(json: any): PayoutResponse {
        return new PayoutResponse({
            id: json.id || 0,
            admin: json.admin ? CommonProfile.fromJson(json.admin) : undefined,
            user: json.user ? CommonProfile.fromJson(json.user) : undefined,
            status: json.status || '',
            type: json.type || '',
            transaction: json.transaction || '',
            event: json.event || '',
            amount: json.amount || '',
            updated_at: json.updated_at || '',
            bankName: json.bank_name || '',
            accountName: json.account_name || '',
            accountNumber: json.account_number || '',
        });
    }

    toJson(): any {
        return {
            id: this.id,
            admin: this.admin.toJson(),
            user: this.user.toJson(),
            status: this.status,
            type: this.type,
            transaction: this.transaction,
            event: this.event,
            amount: this.amount,
            updated_at: this.updated_at,
            bank_name: this.bankName,
            account_name: this.accountName,
            account_number: this.accountNumber,
        };
    }

    copyWith(changes: Partial<IPayoutResponse>): PayoutResponse {
        return new PayoutResponse({
            ...this.toJson(),
            ...changes,
        });
    }
}