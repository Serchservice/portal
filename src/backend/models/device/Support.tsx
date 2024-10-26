import ComplaintScopeResponse from "../support/ComplaintScopeResponse";
import SpeakWithSerchResponse from "../support/SpeakWithSerchResponse";

interface ISupport {
    ticket: string;
    emailAddress: string;
    complaint: ComplaintScopeResponse;
    speakWithSerch: SpeakWithSerchResponse;
}

class Support implements ISupport {
    ticket: string;
    emailAddress: string;
    complaint: ComplaintScopeResponse;
    speakWithSerch: SpeakWithSerchResponse;

    constructor({
        ticket = '',
        emailAddress = '',
        complaint = new ComplaintScopeResponse(),
        speakWithSerch = new SpeakWithSerchResponse(),
    }: Partial<ISupport> = {}) {
        this.ticket = ticket;
        this.emailAddress = emailAddress;
        this.complaint = complaint;
        this.speakWithSerch = speakWithSerch;
    }

    static fromJson(json: any): Support {
        return new Support({
            ticket: json.ticket || '',
            emailAddress: json.emailAddress || '',
            complaint: ComplaintScopeResponse.fromJson(json.complaint || {}),
            speakWithSerch: SpeakWithSerchResponse.fromJson(json.speakWithSerch || {}),
        });
    }

    toJson(): any {
        return {
            ticket: this.ticket,
            emailAddress: this.emailAddress,
            complaint: this.complaint.toJson(),
            speakWithSerch: this.speakWithSerch.toJson(),
        };
    }

    copyWith({
        ticket,
        emailAddress,
        complaint,
        speakWithSerch,
    }: Partial<ISupport> = {}): Support {
        return new Support({
            ticket: ticket !== undefined ? ticket : this.ticket,
            emailAddress: emailAddress !== undefined ? emailAddress : this.emailAddress,
            complaint: complaint !== undefined ? complaint : this.complaint,
            speakWithSerch: speakWithSerch !== undefined ? speakWithSerch : this.speakWithSerch,
        });
    }
}

export default Support;