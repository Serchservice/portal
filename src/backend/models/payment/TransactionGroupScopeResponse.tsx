import { TransactionScopeResponse } from "./TransactionScopeResponse";

// Interface for TransactionGroupScopeResponse
interface ITransactionGroupScopeResponse {
    label: string;
    transactions: TransactionScopeResponse[];
    createdAt: string;
}

// Class implementation for TransactionGroupScopeResponse
export class TransactionGroupScopeResponse implements ITransactionGroupScopeResponse {
    label: string;
    transactions: TransactionScopeResponse[];
    createdAt: string;

    constructor(data: Partial<ITransactionGroupScopeResponse> = {}) {
        this.label = data.label || '';
        this.transactions = (data.transactions || []).map(transaction => transaction);
        this.createdAt = data.createdAt || '';
    }

    static fromJson(json: any): TransactionGroupScopeResponse {
        return new TransactionGroupScopeResponse({
            label: json.label || '',
            transactions: (json.transactions || []).map((transaction: any) => TransactionScopeResponse.fromJson(transaction)),
            createdAt: json.created_at || '',
        });
    }

    toJson(): any {
        return {
            label: this.label,
            transactions: this.transactions.map(transaction => transaction.toJson()),
            created_at: this.createdAt,
        };
    }

    copyWith(changes: Partial<ITransactionGroupScopeResponse>): TransactionGroupScopeResponse {
        return new TransactionGroupScopeResponse({
            label: changes.label ?? this.label,
            transactions: changes.transactions ?
                changes.transactions.map(transaction => transaction instanceof TransactionScopeResponse
                    ? transaction
                    : TransactionScopeResponse.fromJson(transaction)
                )
                : this.transactions,
            createdAt: changes.createdAt ?? this.createdAt,
        });
    }
}