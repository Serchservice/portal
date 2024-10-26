import ChartMetricResponse from "../metric/ChartMetricResponse";
import { MetricResponse } from "../metric/MetricResponse";

export interface ISupportResponse {
    complaintMetrics: MetricResponse[],
    complaintChart: ChartMetricResponse[],
    speakWithSerchMetrics: MetricResponse[],
    speakWithSerchChart: ChartMetricResponse[],
    years: number[];
}

export class SupportResponse implements ISupportResponse {
    complaintMetrics: MetricResponse[];
    complaintChart: ChartMetricResponse[];
    speakWithSerchMetrics: MetricResponse[];
    speakWithSerchChart: ChartMetricResponse[];
    years: number[];

    constructor({
        complaintMetrics = [],
        complaintChart = [],
        speakWithSerchMetrics = [],
        speakWithSerchChart = [],
        years = [],
    }: Partial<ISupportResponse> = {}) {
        this.complaintMetrics = complaintMetrics;
        this.complaintChart = complaintChart;
        this.speakWithSerchMetrics = speakWithSerchMetrics;
        this.speakWithSerchChart = speakWithSerchChart;
        this.years = years;
    }

    copyWith({
        complaintMetrics,
        complaintChart,
        speakWithSerchMetrics,
        speakWithSerchChart,
        years,
    }: Partial<ISupportResponse> = {}): SupportResponse {
        return new SupportResponse({
            complaintMetrics: complaintMetrics || this.complaintMetrics,
            complaintChart: complaintChart || this.complaintChart,
            speakWithSerchMetrics: speakWithSerchMetrics || this.speakWithSerchMetrics,
            speakWithSerchChart: speakWithSerchChart || this.speakWithSerchChart,
            years: years || this.years,
        });
    }

    static fromJson(json: any): SupportResponse {
        return new SupportResponse({
            complaintMetrics: json.complaintMetrics
                ? json.complaintMetrics.map((metric: any) => MetricResponse.fromJson(metric))
                : [],
            complaintChart: json.complaintChart
                ? json.complaintChart.map((chartMetric: any) => ChartMetricResponse.fromJson(chartMetric))
                : [],
            speakWithSerchMetrics: json.speakWithSerchMetrics
                ? json.speakWithSerchMetrics.map((metric: any) => MetricResponse.fromJson(metric))
                : [],
            speakWithSerchChart: json.speakWithSerchChart
                ? json.speakWithSerchChart.map((chartMetric: any) => ChartMetricResponse.fromJson(chartMetric))
                : [],
            years: json.years || []
        });
    }

    toJson(): any {
        return {
            complaintMetrics: this.complaintMetrics.map(metric => metric.toJson()),
            complaintChart: this.complaintChart.map(chartMetric => chartMetric.toJson()),
            speakWithSerchMetrics: this.speakWithSerchMetrics.map(metric => metric.toJson()),
            speakWithSerchChart: this.speakWithSerchChart.map(chartMetric => chartMetric.toJson()),
            years: this.years,
        };
    }
}