export interface IMetricResponse {
    header: string;
    count: string;
    feature: string;
}

export class MetricResponse implements IMetricResponse {
    header: string;
    count: string;
    feature: string;

    constructor({ header = '', count = '', feature = '' }: Partial<IMetricResponse> = {}) {
        this.header = header;
        this.count = count;
        this.feature = feature;
    }

    copyWith({ header, count, feature }: Partial<IMetricResponse> = {}): MetricResponse {
        return new MetricResponse({
            header: header ?? this.header,
            count: count ?? this.count,
            feature: feature ?? this.feature,
        });
    }

    static fromJson(json: any): MetricResponse {
        return new MetricResponse({
            header: json.header || '',
            count: json.count || '',
            feature: json.feature || '',
        });
    }

    toJson(): any {
        return {
            header: this.header,
            count: this.count,
            feature: this.feature,
        };
    }
}