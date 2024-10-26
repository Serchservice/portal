// Interface for WalletResponse data
export interface IWalletResponse {
    wallet: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    balance: string;
    deposit: string;
    payout: string;
    uncleared: string;
    payday: number;
    nextPayday: string;
    payoutOnPayday: boolean;
}

// Class implementation for WalletResponse
export class WalletResponse implements IWalletResponse {
    wallet: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    balance: string;
    deposit: string;
    payout: string;
    uncleared: string;
    payday: number;
    nextPayday: string;
    payoutOnPayday: boolean;

    constructor(data: Partial<IWalletResponse> = {}) {
        this.wallet = data.wallet || '';
        this.accountName = data.accountName || '';
        this.accountNumber = data.accountNumber || '';
        this.bankName = data.bankName || '';
        this.balance = data.balance || '';
        this.deposit = data.deposit || '';
        this.payout = data.payout || '';
        this.uncleared = data.uncleared || '';
        this.payday = data.payday || 0;
        this.nextPayday = data.nextPayday || '';
        this.payoutOnPayday = data.payoutOnPayday ?? false;
    }

    static fromJson(json: any): WalletResponse {
        return new WalletResponse({
            wallet: json.wallet || '',
            accountName: json.accountName || '',
            accountNumber: json.accountNumber || '',
            bankName: json.bankName || '',
            balance: json.balance || '',
            deposit: json.deposit || '',
            payout: json.payout || '',
            uncleared: json.uncleared || '',
            payday: json.payday || 0,
            nextPayday: json.next_payday || '',
            payoutOnPayday: json.payout_on_payday ?? false,
        });
    }

    toJson(): any {
        return {
            wallet: this.wallet,
            accountName: this.accountName,
            accountNumber: this.accountNumber,
            bankName: this.bankName,
            balance: this.balance,
            deposit: this.deposit,
            payout: this.payout,
            uncleared: this.uncleared,
            payday: this.payday,
            next_payday: this.nextPayday,
            payout_on_payday: this.payoutOnPayday,
        };
    }

    copyWith(changes: Partial<IWalletResponse>): WalletResponse {
        return new WalletResponse({
            ...this.toJson(),
            ...changes,
        });
    }
}