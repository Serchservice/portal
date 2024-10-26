// Interface for TransactionTypeResponse
export interface ITransactionTypeResponse {
    name: string;
    type: string;
}

// Class implementation for TransactionTypeResponse
export class TransactionTypeResponse implements ITransactionTypeResponse {
    name: string;
    type: string;

    constructor(data: Partial<ITransactionTypeResponse> = {}) {
        this.name = data.name || '';
        this.type = data.type || '';
    }

    static fromJson(json: any): TransactionTypeResponse {
        return new TransactionTypeResponse({
            name: json.name || '',
            type: json.type || '',
        });
    }

    toJson(): ITransactionTypeResponse {
        return {
            name: this.name,
            type: this.type,
        };
    }

    copyWith(changes: Partial<ITransactionTypeResponse>): TransactionTypeResponse {
        return new TransactionTypeResponse({
            ...this.toJson(),
            ...changes,
        });
    }
}