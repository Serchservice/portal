import TimeUtils from "../../../utils/TimeUtils";

interface INotification {
    id: number;
    message: string;
    event: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    image: string;
}

class Notification implements INotification {
    id: number;
    message: string;
    event: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    image: string;

    constructor({
        id = 0,
        message = '',
        event = '',
        type = '',
        status = '',
        createdAt = '',
        updatedAt = '',
        image = '',
    }: Partial<INotification> = {}) {
        this.id = id;
        this.message = message;
        this.event = event;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }

    static fromJson(json: any): Notification {
        return new Notification({
            id: json.id || 0,
            message: json.message || '',
            event: json.event || '',
            type: json.type || '',
            status: json.status || '',
            createdAt: json.createdAt || '',
            updatedAt: json.updatedAt || '',
            image: json.image || '',
        });
    }

    toJson(): any {
        return {
            id: this.id,
            message: this.message,
            event: this.event,
            type: this.type,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            image: this.image,
        };
    }

    copyWith({
        id,
        message,
        event,
        type,
        status,
        createdAt,
        updatedAt,
        image,
    }: Partial<INotification> = {}): Notification {
        return new Notification({
            id: id !== undefined ? id : this.id,
            message: message !== undefined ? message : this.message,
            event: event !== undefined ? event : this.event,
            type: type !== undefined ? type : this.type,
            status: status !== undefined ? status : this.status,
            createdAt: createdAt !== undefined ? createdAt : this.createdAt,
            updatedAt: updatedAt !== undefined ? updatedAt : this.updatedAt,
            image: image !== undefined ? image : this.image,
        });
    }

    get isRead(): boolean {
        return this.status === 'READ'
    }

    get isDefault(): boolean {
        return this.type === 'DEFAULT'
    }

    get label(): string {
        return TimeUtils.chat(this.updatedAt);
    }
}

export default Notification;