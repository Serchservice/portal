import ComplaintResponse from "./ComplaintResponse";

export interface IComplaintScopeResponse {
    emailAddress: string;
    firstName: string;
    lastName: string;
    complaints: ComplaintResponse[];
}

class ComplaintScopeResponse implements IComplaintScopeResponse {
    emailAddress: string;
    firstName: string;
    lastName: string;
    complaints: ComplaintResponse[];

    constructor({
        emailAddress = '',
        firstName = '',
        lastName = '',
        complaints = [],
    }: Partial<IComplaintScopeResponse> = {}) {
        this.emailAddress = emailAddress;
        this.firstName = firstName;
        this.lastName = lastName;
        this.complaints = complaints;
    }

    static fromJson(json: any): ComplaintScopeResponse {
        return new ComplaintScopeResponse({
            emailAddress: json.emailAddress || '',
            firstName: json.firstName || '',
            lastName: json.lastName || '',
            complaints: json.complaints ? json.complaints.map((c: any) => ComplaintResponse.fromJson(c)) : [],
        });
    }

    toJson(): any {
        return {
            emailAddress: this.emailAddress,
            firstName: this.firstName,
            lastName: this.lastName,
            complaints: this.complaints.map(c => c.toJson()),
        };
    }

    copyWith({
        emailAddress = this.emailAddress,
        firstName = this.firstName,
        lastName = this.lastName,
        complaints = this.complaints,
    }: Partial<IComplaintScopeResponse> = {}): ComplaintScopeResponse {
        return new ComplaintScopeResponse({
            emailAddress,
            firstName,
            lastName,
            complaints,
        });
    }

    get name(): string {
        return this.firstName + " " + this.lastName;
    }

    get pendingCount(): number {
        return this.complaints.filter(complaint => complaint.status !== 'RESOLVED').length
    }

    get totalCount(): number {
        return this.complaints.length
    }
}

export default ComplaintScopeResponse