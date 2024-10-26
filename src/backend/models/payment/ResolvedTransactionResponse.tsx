import { ICommonProfile, CommonProfile } from "../profile/CommonProfile";
import { ITransactionScopeResponse, TransactionScopeResponse } from "./TransactionScopeResponse";

// Interface for ResolvedTransactionResponse
export interface IResolvedTransactionResponse {
    id: number;
    transaction: ITransactionScopeResponse;
    status: string;
    admin: ICommonProfile;
    createdAt: string;
    updatedAt: string;
}

// Class implementation for ResolvedTransactionResponse
export class ResolvedTransactionResponse implements IResolvedTransactionResponse {
    id: number;
    transaction: TransactionScopeResponse;
    status: string;
    admin: CommonProfile;
    createdAt: string;
    updatedAt: string;

    constructor(data: Partial<IResolvedTransactionResponse> = {}) {
        this.id = data.id || 0;
        this.transaction = data.transaction ? new TransactionScopeResponse(data.transaction) : new TransactionScopeResponse();
        this.status = data.status || '';
        this.admin = data.admin ? new CommonProfile(data.admin) : new CommonProfile();
        this.createdAt = data.createdAt || '';
        this.updatedAt = data.updatedAt || '';
    }

    static fromJson(json: any): ResolvedTransactionResponse {
        return new ResolvedTransactionResponse({
            id: json.id || 0,
            transaction: json.transaction ? TransactionScopeResponse.fromJson(json.transaction) : undefined,
            status: json.status || '',
            admin: json.admin ? CommonProfile.fromJson(json.admin) : undefined,
            createdAt: json.created_at || '',
            updatedAt: json.updated_at || '',
        });
    }

    toJson() {
        return {
            id: this.id,
            transaction: this.transaction.toJson(),
            status: this.status,
            admin: this.admin.toJson(),
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    copyWith(changes: Partial<IResolvedTransactionResponse>): ResolvedTransactionResponse {
        return new ResolvedTransactionResponse({
            id: changes.id ?? this.id,
            transaction: changes.transaction ? new TransactionScopeResponse(changes.transaction) : this.transaction,
            status: changes.status ?? this.status,
            admin: changes.admin ? new CommonProfile(changes.admin) : this.admin,
            createdAt: changes.createdAt ?? this.createdAt,
            updatedAt: changes.updatedAt ?? this.updatedAt,
        });
    }
}