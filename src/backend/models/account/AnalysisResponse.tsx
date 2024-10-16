import ChartMetrics from "../metric/ChartMetricResponse";

export interface IAnalysisResponse {
    status: ChartMetrics[];
    years: number[];
    auth: ChartMetrics[];
}

class AnalysisResponse implements IAnalysisResponse {
    constructor(
        public status: ChartMetrics[],
        public years: number[],
        public auth: ChartMetrics[]
    ) { }

    static fromJson(data: any): AnalysisResponse {
        return new AnalysisResponse(
            data.status.map((status: any) => ChartMetrics.fromJson(status)),
            data.years,
            data.auth.map((auth: any) => ChartMetrics.fromJson(auth))
        );
    }

    toJson(): any {
        return {
            status: this.status.map((status) => status.toJson()),
            years: this.years,
            auth: this.auth.map((auth) => auth.toJson()),
        };
    }

    copyWith(updatedData: Partial<IAnalysisResponse>): AnalysisResponse {
        return new AnalysisResponse(
            updatedData.status ?? this.status,
            updatedData.years ?? this.years,
            updatedData.auth ?? this.auth
        );
    }
}

export default AnalysisResponse