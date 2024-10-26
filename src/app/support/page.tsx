import { PieChart } from "@mui/x-charts"
import { Column, Container, ExtraButton, Notify, Row, Shimmer, SizedBox, Spacer, StyledMenu, Text, Wrap } from "@serchservice/web-ui-kit"
import { useQuery } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React from "react"
import Connect from "../../backend/api/Connect"
import Keys from "../../backend/api/Keys"
import preferenceStore from "../../backend/database/device/PreferenceStore"
import ChartMetricResponse from "../../backend/models/metric/ChartMetricResponse"
import { MetricResponse } from "../../backend/models/metric/MetricResponse"
import { SupportResponse } from "../../backend/models/support/SupportResponse"
import { RouteInterface } from "../../configuration/Route"
import AppTheme from "../../configuration/Theme"
import { Metric } from "../../widgets/Metrics"
import Title from "../../widgets/Title"
import { SupportChartLoader, SupportMetricLoader } from "./loader"

export default function SupportRoute(): RouteInterface {
    return {
        path: "/support",
        page: (
            <React.Fragment>
                <Title title="Support" description="Where customer support gets it insights" useDesktopWidth />
                <Column
                    mainAxisSize="max"
                    crossAxisSize="max"
                    mainAxis="flex-start"
                    crossAxis="flex-start"
                    style={{overflow: "scroll", gap: "5px", padding: "12px"}}
                >
                    <View />
                </Column>
            </React.Fragment>
        ),
    }
}

const View: React.FC = observer(() => {
    const connect = new Connect({})

    const { data, isLoading } = useQuery({
        queryKey: [Keys.SUPPORT_PAGE("SUPER")],
        queryFn: () => connect.get("/scope/support")
    });

    const [support, setSupport] = React.useState<SupportResponse>();

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                const response = SupportResponse.fromJson(data.data)
                setSupport(response);
            } else {
                Notify.error(data.message);
            }
        }
    }, [data])

    const buildComplaintMetricView = () => {
        if(isLoading || !data || !support) {
            return (<SupportMetricLoader />)
        } else {
            return (<SupportMetric title="Complaint Analytics" metrics={support.complaintMetrics} />)
        }
    }

    const buildSpeakWithSerchMetricView = () => {
        if(isLoading || !data || !support) {
            return (<SupportMetricLoader />)
        } else {
            return (<SupportMetric title="Speak With Serch Ticketing Analytics" metrics={support.speakWithSerchMetrics} />)
        }
    }

    async function fetchComplaintChart(year: number): Promise<ChartMetricResponse[]> {
        const chart: ChartMetricResponse[] = []

        const response = await connect.get(`/scope/support/chart/complaint?year=${year}`)
        if (response) {
            if (response.isSuccess) {
                if (Array.isArray(response.data)) {
                    return response.data.map(chart => ChartMetricResponse.fromJson(chart))
                }
                Notify.success(response.message)
            } else {
                Notify.error(response.message);
            }
        }

        return chart;
    }

    async function fetchSpeakWithSerchChart(year: number): Promise<ChartMetricResponse[]> {
        const chart: ChartMetricResponse[] = []

        const response = await connect.get(`/scope/support/chart/speak-with-serch?year=${year}`)
        if (response) {
            if (response.isSuccess) {
                if (Array.isArray(response.data)) {
                    return response.data.map(chart => ChartMetricResponse.fromJson(chart))
                }
                Notify.success(response.message)
            } else {
                Notify.error(response.message);
            }
        }

        return chart;
    }

    const buildComplaintChartView = () => {
        if(isLoading || !data || !support) {
            return (<SupportChartLoader />)
        } else {
            return (
                <SupportChart
                    initialChart={support.complaintChart}
                    years={support.years}
                    title="Complaint Overview"
                    description="Complaints logged and acted upon in Serch "
                    onUpdated={fetchComplaintChart}
                />
            )
        }
    }

    const buildSpeakWithSerchChartView = () => {
        if(isLoading || !data || !support) {
            return (<SupportChartLoader />)
        } else {
            return (
                <SupportChart
                    initialChart={support.speakWithSerchChart}
                    years={support.years}
                    title="Speak With Serch Overview"
                    description="Issue tickets for Serch platforms"
                    onUpdated={fetchSpeakWithSerchChart}
                />
            )
        }
    }

    return (
        <Column style={{gap: "12px"}}>
            {[buildSpeakWithSerchMetricView(), buildComplaintMetricView()].map((view, index) => {
                return <Container key={index} backgroundColor={AppTheme.appbar} padding="10px" borderRadius="6px">{view}</Container>
            })}
            <Row mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start" gap="20px">
                {[buildComplaintChartView(), buildSpeakWithSerchChartView()].map((view, i) => {
                    return (
                        <Container
                            key={i}
                            backgroundColor={AppTheme.appbar}
                            padding="12px"
                            borderRadius="12px"
                            width="50%"
                        >{view}</Container>
                    )
                })}
            </Row>
        </Column>
    )
})

interface SupportMetricProps {
    title: string;
    metrics: MetricResponse[];
}

const SupportMetric: React.FC<SupportMetricProps> = observer(({ title, metrics }) => {
    const render = () => {
        if(metrics && metrics.length > 0) {
            return (
                <Wrap runSpacing={10} spacing={10}>
                    {metrics.map((metric, i) => {
                        return (
                            <Metric
                                key={i}
                                title={metric.header}
                                value={metric.count}
                                icon="duo-icons:world"
                                iconColor={AppTheme.hint}
                                valueStyle={{fontSize: "20px"}}
                                titleStyle={{fontSize: "14px"}}
                                containerStyle={{width: "160px", backgroundColor: AppTheme.background}}
                            />)
                    })}
                </Wrap>
            )
        } else {
            return (
                <Row mainAxis="center">
                    <Text text="No metric data" color={AppTheme.hint} size={12} />
                </Row>
            )
        }
    }

    return (
        <React.Fragment>
            <Text text={title} color={AppTheme.primary} size={14} />
            <SizedBox height={10} />
            {render()}
        </React.Fragment>
    )
})

interface SupportChartProps {
    initialChart: ChartMetricResponse[];
    years: number[];
    title: string;
    description: string;
    onUpdated: (year: number) => Promise<ChartMetricResponse[]>
}

const SupportChart: React.FC<SupportChartProps> = observer(({ initialChart, years, onUpdated, title, description }) => {
    const [year, setYear] = React.useState<number>(years[0])
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);
    const [chart, setChart] = React.useState(initialChart)
    const [isLoading, setIsLoading] = React.useState(false)

    async function handleYearClick(value: number) {
        setAnchor(undefined)
        if(year === value) {
            return
        }

        setYear(value)

        setIsLoading(true)
        const response = await onUpdated(value)
        setIsLoading(false)

        setChart(response)
    }

    const chartStyle = {
        '& .MuiResponsiveChart-container': {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        '& .MuiChartsSurface-root': {
            width: '100% !important',
            height: '100% !important',
        },
    };

    const pieParams = {
        slotProps: { legend: { hidden: true } },
    };

    const render = () => {
        if(isLoading) {
            return (
                <Row mainAxis="center" crossAxis="center">
                    <Shimmer height={300} width={300} type="circular" dimmed={preferenceStore.read.isDark} />
                </Row>
            )
        } else {
            return (
                <Row mainAxis="center" crossAxis="center">
                    <PieChart
                        colors={chart.map((d) => d.color ?? 'orange')}
                        series={[{
                            data: chart.map((d) => ({value: d.value, label: d.label, color: d.color || 'orange'})),
                            innerRadius: 30,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                            startAngle: -45,
                            endAngle: 225,
                            cx: 150,
                            cy: 150,
                        }]}
                        height={300}
                        sx={chartStyle}
                        {...pieParams}
                    />
                </Row>
            )
        }
    }

    return (
        <React.Fragment>
            <Row crossAxis="center">
                <Column crossAxis="flex-start" mainAxisSize="min">
                    <Text text={title} size={15} color={AppTheme.primary} />
                    <SizedBox height={3} />
                    <Text text={description} size={12} color={AppTheme.hint} />
                </Column>
                <Spacer />
                <ExtraButton
                    open={Boolean(anchor)}
                    title={`${year}`}
                    padding="4px"
                    fontSize="12px"
                    icon="duo-icons:chart-pie"
                    iconSize={1}
                    tip="Pick year"
                    placement="top"
                    color={AppTheme.hint}
                    borderRadius="8px"
                    backgroundColor={AppTheme.background}
                    onClick={event => setAnchor(event.currentTarget)}
                    rootStyle={{width: "auto", minWidth: "auto"}}
                    hoverColor={AppTheme.hover}
                    iconStyle={{marginRight: "4px"}}
                />
            </Row>
            <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.background} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                {years.map((year, index) => {
                    return (
                        <Container
                            key={index}
                            padding="10px"
                            onClick={() => handleYearClick(year)}
                            hoverBackgroundColor={AppTheme.hover}
                            backgroundColor={"transparent"}
                        >
                            <Text text={`${year}`} size={14} color={AppTheme.primary} />
                        </Container>
                    )
                })}
            </StyledMenu>
            <SizedBox height={10} />
            <Wrap spacing={10} runSpacing={10}>
                {chart.map((item, index) => {
                    return (
                        <Row crossAxis="center" mainAxisSize="min" key={index}>
                            <Container backgroundColor={item.color || 'orange'} borderRadius="4px" height={15} width={15} />
                            <SizedBox width={6} />
                            <Column style={{paddingTop: "3px"}} crossAxisSize="min">
                                <Text text={item.label} size={12} color={AppTheme.primary} />
                            </Column>
                        </Row>
                    )
                })}
            </Wrap>
            <SizedBox height={50} />
            {render()}
        </React.Fragment>
    )
})