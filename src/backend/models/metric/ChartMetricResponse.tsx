export interface IChartMetricResponse {
    value: number;
    amount: number;
    challenges: number;
    devices: number;
    sessions: number;
    color: string;
    image: string;
    label: string;
    users: number;
    providers: number;
    associates: number;
    businesses: number;
    guests: number;
}

class ChartMetricResponse implements IChartMetricResponse {
    constructor(
        public value: number,
        public amount: number,
        public challenges: number,
        public devices: number,
        public sessions: number,
        public color: string,
        public image: string,
        public label: string,
        public users: number,
        public providers: number,
        public associates: number,
        public businesses: number,
        public guests: number
    ) { }

    static fromJson(data: any): ChartMetricResponse {
        return new ChartMetricResponse(
            data.value || 0,
            data.amount || 0,
            data.challenges || 0,
            data.devices || 0,
            data.sessions || 0,
            data.color || "",
            data.image || "",
            data.label || "",
            data.users || 0,
            data.providers || 0,
            data.associates || 0,
            data.businesses || 0,
            data.guests || 0
        );
    }

    toJson(): any {
        return {
            value: this.value,
            amount: this.amount,
            challenges: this.challenges,
            devices: this.devices,
            sessions: this.sessions,
            color: this.color,
            image: this.image,
            label: this.label,
            users: this.users,
            providers: this.providers,
            associates: this.associates,
            businesses: this.businesses,
            guests: this.guests
        };
    }

    copyWith(updatedData: Partial<IChartMetricResponse>): ChartMetricResponse {
        return new ChartMetricResponse(
            updatedData.value ?? this.value,
            updatedData.amount ?? this.amount,
            updatedData.challenges ?? this.challenges,
            updatedData.devices ?? this.devices,
            updatedData.sessions ?? this.sessions,
            updatedData.color ?? this.color,
            updatedData.image ?? this.image,
            updatedData.label ?? this.label,
            updatedData.users ?? this.users,
            updatedData.providers ?? this.providers,
            updatedData.associates ?? this.associates,
            updatedData.businesses ?? this.businesses,
            updatedData.guests ?? this.guests
        );
    }
}

export default ChartMetricResponse;