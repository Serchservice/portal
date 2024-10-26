import { ICommonProfile, CommonProfile } from '../profile/CommonProfile';
import { IWalletResponse, WalletResponse } from './WalletResponse';

// Main interface for the entire model
export interface IWalletScopeResponse {
    profile: ICommonProfile;
    wallet: IWalletResponse;
    created_at: string;
    updated_at: string;
    lastPayoutDate: string;
}

// Class implementation for the main model
export class WalletScopeResponse implements IWalletScopeResponse {
    profile: CommonProfile;
    wallet: WalletResponse;
    created_at: string;
    updated_at: string;
    lastPayoutDate: string;

    constructor(data: Partial<IWalletScopeResponse> = {}) {
        this.profile = data.profile ? new CommonProfile(data.profile) : new CommonProfile();
        this.wallet = data.wallet ? new WalletResponse(data.wallet) : new WalletResponse();
        this.created_at = data.created_at || '';
        this.updated_at = data.updated_at || '';
        this.lastPayoutDate = data.lastPayoutDate || '';
    }

    static fromJson(json: any): WalletScopeResponse {
        return new WalletScopeResponse({
            profile: json.profile ? CommonProfile.fromJson(json.profile) : undefined,
            wallet: json.wallet ? WalletResponse.fromJson(json.wallet) : undefined,
            created_at: json.created_at || '',
            updated_at: json.updated_at || '',
            lastPayoutDate: json.last_payout_date || '',
        });
    }

    toJson(): any {
        return {
            profile: this.profile.toJson(),
            wallet: this.wallet.toJson(),
            created_at: this.created_at,
            updated_at: this.updated_at,
            last_payout_date: this.lastPayoutDate,
        };
    }

    copyWith(changes: Partial<IWalletScopeResponse>): WalletScopeResponse {
        return new WalletScopeResponse({
            ...this.toJson(),
            profile: changes.profile ? new CommonProfile(changes.profile) : this.profile,
            wallet: changes.wallet ? new WalletResponse(changes.wallet) : this.wallet,
            created_at: changes.created_at || this.created_at,
            updated_at: changes.updated_at || this.updated_at,
            lastPayoutDate: changes.lastPayoutDate || this.lastPayoutDate,
        });
    }
}