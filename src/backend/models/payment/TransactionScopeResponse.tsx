import { ICommonProfile, CommonProfile } from "../profile/CommonProfile";

// Interface for TransactionScopeResponse
export interface ITransactionScopeResponse {
    id: string;
    type: string;
    label: string;
    mode: string;
    amount: string;
    reason: string;
    reference: string;
    event: string;
    verified: boolean;
    status: string;
    sender: ICommonProfile;
    recipient: ICommonProfile;
    createdAt: string;
    updatedAt: string;
    resolution: number;
}

// Class implementation for TransactionScopeResponse
export class TransactionScopeResponse implements ITransactionScopeResponse {
    id: string;
    type: string;
    label: string;
    mode: string;
    amount: string;
    reason: string;
    reference: string;
    event: string;
    verified: boolean;
    status: string;
    sender: CommonProfile;
    recipient: CommonProfile;
    createdAt: string;
    updatedAt: string;
    resolution: number;

    constructor(data: Partial<ITransactionScopeResponse> = {}) {
        this.id = data.id || '';
        this.type = data.type || '';
        this.label = data.label || '';
        this.mode = data.mode || '';
        this.amount = data.amount || '';
        this.reason = data.reason || '';
        this.reference = data.reference || '';
        this.event = data.event || '';
        this.verified = data.verified || false;
        this.status = data.status || '';
        this.sender = data.sender ? new CommonProfile(data.sender) : new CommonProfile();
        this.recipient = data.recipient ? new CommonProfile(data.recipient) : new CommonProfile();
        this.createdAt = data.createdAt || '';
        this.updatedAt = data.updatedAt || '';
        this.resolution = data.resolution || 0;
    }

    static fromJson(json: any): TransactionScopeResponse {
        return new TransactionScopeResponse({
            id: json.id || '',
            type: json.type || '',
            label: json.label || '',
            mode: json.mode || '',
            amount: json.amount || '',
            reason: json.reason || '',
            reference: json.reference || '',
            event: json.event || '',
            verified: json.verified || false,
            status: json.status || '',
            sender: json.sender ? CommonProfile.fromJson(json.sender) : undefined,
            recipient: json.recipient ? CommonProfile.fromJson(json.recipient) : undefined,
            createdAt: json.created_at || json.createdAt || '',
            updatedAt: json.updated_at || json.updatedAt || '',
            resolution: json.resolution || 0
        });
    }

    toJson() {
        return {
            id: this.id,
            type: this.type,
            label: this.label,
            mode: this.mode,
            amount: this.amount,
            reason: this.reason,
            reference: this.reference,
            event: this.event,
            verified: this.verified,
            status: this.status,
            sender: this.sender.toJson(),
            recipient: this.recipient.toJson(),
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            resolution: this.resolution
        };
    }

    copyWith(changes: Partial<ITransactionScopeResponse>): TransactionScopeResponse {
        return new TransactionScopeResponse({
            id: changes.id ?? this.id,
            type: changes.type ?? this.type,
            label: changes.label ?? this.label,
            mode: changes.mode ?? this.mode,
            amount: changes.amount ?? this.amount,
            reason: changes.reason ?? this.reason,
            reference: changes.reference ?? this.reference,
            event: changes.event ?? this.event,
            verified: changes.verified ?? this.verified,
            status: changes.status ?? this.status,
            sender: changes.sender ?
                new CommonProfile(changes.sender)
                : this.sender,
            recipient: changes.recipient ?
                new CommonProfile(changes.recipient)
                : this.recipient,
            createdAt: changes.createdAt ?? this.createdAt,
            updatedAt: changes.updatedAt ?? this.updatedAt,
            resolution: changes.resolution ?? this.resolution,
        });
    }

    get isPending(): boolean {
        return this.status === "PENDING"
    }

    get isFailed(): boolean {
        return this.status === "FAILED"
    }

    get isSuccess(): boolean {
        return this.status === "SUCCESSFUL"
    }
}