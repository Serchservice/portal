import React from "react";
import { AdminInterface } from "../page";
import { observer } from "mobx-react-lite";
import { Column, Container, ExtraButton, Notify, Row, Shimmer, SizedBox, Spacer, StyledMenu, Text, Utility, Wrap } from "@serchservice/web-ui-kit";
import Connect from "../../../../backend/api/Connect";
import ChartMetricResponse from "../../../../backend/models/metric/ChartMetricResponse";
import AppTheme from "../../../../configuration/Theme";
import preferenceStore from "../../../../backend/database/device/PreferenceStore";
import { LineChart } from "@mui/x-charts";

const AdminAccountAnalyticsView: React.FC<AdminInterface> = observer(({ admin, onAdminUpdated }) => {
    return (
        <React.Fragment>
            <StatusView admin={admin} onAdminUpdated={onAdminUpdated} />
            <SizedBox height={10} />
            <AuthView admin={admin} onAdminUpdated={onAdminUpdated} />
        </React.Fragment>
    )
})

const StatusView: React.FC<AdminInterface> = observer(({ admin }) => {
    const dimmed = preferenceStore.read.isDark;

    const connect = new Connect({})

    const years = admin?.analysis.years ?? []
    const status = admin?.analysis.status ?? []
    const [activeYear, setActiveYear] = React.useState(new Date().getFullYear())
    const [chart, setChart] = React.useState<ChartMetricResponse[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    async function updateChart(year: number) {
        setAnchor(undefined)
        if(year === activeYear) {
            return
        }

        setIsLoading(true)
        setActiveYear(year)

        const response = await connect.get(`/scope/admin/chart/account/status?id=${admin?.profile.id}&year=${year}`)
        setIsLoading(false)
        if(response) {
            if(response.isSuccess) {
                if(Array.isArray(response.data)) {
                    setChart(response.data.map(chart => ChartMetricResponse.fromJson(chart)))
                }
            } else {
                Notify.error(response.message);
            }
        }
    }

    const render = () => {
        if(isLoading) {
            return (
                <React.Fragment>
                    <Row crossAxis="flex-start" mainAxisSize="max">
                        <Column crossAxis="flex-start" mainAxisSize="min">
                            <Shimmer height={14} width={200} radius={6} dimmed={dimmed} />
                            <SizedBox height={3} />
                            <Shimmer height={12} width={100} radius={6} dimmed={dimmed} />
                        </Column>
                        <Spacer />
                        <Shimmer height={30} width={100} radius={6} dimmed={dimmed} />
                    </Row>
                    <SizedBox height={20} />
                    <Wrap spacing={10} runSpacing={10}>
                        {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={26} width={100} />)}
                    </Wrap>
                    <SizedBox height={20} />
                    <Row crossAxis="center" mainAxis="center">
                        <Wrap crossAxisAlignment="center" spacing={40}>
                            {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={100} width={100} />)}
                        </Wrap>
                    </Row>
                </React.Fragment>
            )
        } else {
            const data = chart.length > 0 ? chart : status
            return (
                <React.Fragment>
                    <Row crossAxis="flex-start" mainAxisSize="max">
                        <Column crossAxis="flex-start" mainAxisSize="min">
                            <Text text="Account Status" size={15} color={AppTheme.primary} />
                            <SizedBox height={3} />
                            <Text
                                text={`This shows how ${admin.profile.firstName}'s account has thrived within ${activeYear}`}
                                size={12}
                                color={AppTheme.hint}
                            />
                        </Column>
                        <Spacer />
                        <ExtraButton
                            open={Boolean(anchor)}
                            title={`${activeYear}`}
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
                    <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                        {years.map((year, index) => {
                            return (
                                <Container
                                    key={index}
                                    padding="10px"
                                    onClick={() => updateChart(year)}
                                    hoverBackgroundColor={AppTheme.hover}
                                    backgroundColor={"transparent"}
                                >
                                    <Text text={`${year}`} size={14} color={AppTheme.primary} />
                                </Container>
                            )
                        })}
                    </StyledMenu>
                    <SizedBox height={20} />
                    <Wrap spacing={10} runSpacing={10}>
                        {data.map((item, index) => {
                            return (
                                <Container key={index} backgroundColor={AppTheme.background} padding="6px 6px 4px" borderRadius="6px">
                                    <Row crossAxis="center" mainAxisSize="min">
                                        <Container backgroundColor={item.color} borderRadius="4px" padding="6px" margin="0 0 2px 0" />
                                        <SizedBox width={6} />
                                        <Text text={item.label} size={12} color={AppTheme.primary} />
                                    </Row>
                                </Container>
                            )
                        })}
                    </Wrap>
                    <SizedBox height={20} />
                    <Row crossAxis="center" mainAxis="center">
                        <Wrap crossAxisAlignment="center" spacing={40}>
                            {data.map((item, index) => {
                                return (
                                    <Container key={index} padding="10px" borderRadius="10px" backgroundColor={item.color} height={120} width={120}>
                                        <Column mainAxis="center" mainAxisSize="max">
                                            <Text align="center" text={`${item.value}`} size={40} color={Utility.lightenColor(item.color, 80)} />
                                        </Column>
                                    </Container>
                                )
                            })}
                        </Wrap>
                    </Row>
                </React.Fragment>
            )
        }
    }

    return (
        <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
            {render()}
        </Container>
    )
})

const AuthView: React.FC<AdminInterface> = observer(({ admin }) => {
    const dimmed = preferenceStore.read.isDark;

    const connect = new Connect({})

    const years = admin?.analysis.years ?? []
    const auth = admin?.analysis.auth ?? []

    const [activeYear, setActiveYear] = React.useState(new Date().getFullYear())
    const [chart, setChart] = React.useState<ChartMetricResponse[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    async function updateChart(year: number) {
        setAnchor(undefined)
        if(year === activeYear) {
            return
        }

        setIsLoading(true)
        setActiveYear(year)

        const response = await connect.get(`/scope/admin/chart/auth?id=${admin?.profile.id}&year=${year}`)
        setIsLoading(false)
        if(response) {
            if(response.isSuccess) {
                if(Array.isArray(response.data)) {
                    setChart(response.data.map(chart => ChartMetricResponse.fromJson(chart)))
                }
            } else {
                Notify.error(response.message);
            }
        }
    }

    const render = () => {
        if(isLoading) {
            return (
                <React.Fragment>
                    <Row crossAxis="flex-start" mainAxisSize="max">
                        <Column crossAxis="flex-start" mainAxisSize="min">
                            <Shimmer height={14} width={200} radius={6} dimmed={dimmed} />
                            <SizedBox height={3} />
                            <Shimmer height={12} width={100} radius={6} dimmed={dimmed} />
                        </Column>
                        <Spacer />
                        <Shimmer height={30} width={100} radius={6} dimmed={dimmed} />
                    </Row>
                    <SizedBox height={20} />
                    <Wrap spacing={10} runSpacing={10}>
                        {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={26} width={100} />)}
                    </Wrap>
                    <SizedBox height={20} />
                    <Shimmer height={500} width="100%" radius={6} dimmed={dimmed} />
                </React.Fragment>
            )
        } else {
            const data = chart.length > 0 ? chart : auth

            return (
                <React.Fragment>
                    <Row crossAxis="flex-start" mainAxisSize="max">
                        <Column crossAxis="flex-start" mainAxisSize="min">
                            <Text text="Authentication Overview" size={15} color={AppTheme.primary} />
                            <SizedBox height={3} />
                            <Text
                                text={`This shows ${admin.profile.firstName}'s authenticated times and periods for the year, ${activeYear}`}
                                size={12}
                                color={AppTheme.hint}
                            />
                        </Column>
                        <Spacer />
                        <ExtraButton
                            open={Boolean(anchor)}
                            title={`${activeYear}`}
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
                    <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                        {years.map((year, index) => {
                            return (
                                <Container
                                    key={index}
                                    padding="10px"
                                    onClick={() => updateChart(year)}
                                    hoverBackgroundColor={AppTheme.hover}
                                    backgroundColor={"transparent"}
                                >
                                    <Text text={`${year}`} size={14} color={AppTheme.primary} />
                                </Container>
                            )
                        })}
                    </StyledMenu>
                    <SizedBox height={20} />
                    <Wrap spacing={10} runSpacing={10}>
                        {data.map((item, index) => {
                            return (
                                <Container key={index} backgroundColor={AppTheme.background} padding="6px 6px 4px" borderRadius="6px">
                                    <Row crossAxis="center" mainAxisSize="min">
                                        <Container backgroundColor={item.color} borderRadius="4px" padding="6px" margin="0 0 2px 0" />
                                        <SizedBox width={6} />
                                        <Text text={item.label} size={12} color={AppTheme.primary} />
                                    </Row>
                                </Container>
                            )
                        })}
                    </Wrap>
                    <SizedBox height={20} />
                    <Container>
                        <LineChart
                            height={500}
                            series={[
                                {
                                    id: 'Session',
                                    label: 'Sessions per month',
                                    data: data.map(mon => mon.challenges),
                                    stack: 'total',
                                    // area: true,
                                    showMark: false,
                                },
                                {
                                    id: 'MFA Challenge',
                                    label: 'Multi-Factor Challenges per month',
                                    data: data.map(mon => mon.challenges),
                                    stack: 'total',
                                    // area: true,
                                    showMark: false,
                                },
                                {
                                    id: 'Devices',
                                    label: 'Devices per month',
                                    data: data.map(mon => mon.devices),
                                    stack: 'total',
                                    // area: true,
                                    showMark: false,
                                },
                            ]}
                            xAxis={[{
                                id: 'Month',
                                data: data.map(mon => mon.label.substring(0, 3)),
                                scaleType: 'band',
                            }]}
                            sx={{
                                '& .MuiResponsiveChart-container': {
                                    width: '100%',
                                },
                                '& .MuiChartsAxis-tickLabel': {
                                    color: `${AppTheme.primary} !important`,
                                    fill: `${AppTheme.primary} !important`,
                                },
                                '& .MuiChartsAxis-line': {
                                    stroke: `${AppTheme.primary} !important`,
                                },
                                '& .MuiChartsAxis-tick': {
                                    stroke: `${AppTheme.primary} !important`,
                                },
                                '& .MuiChartsLegend-series': {
                                    'text': {
                                        fill: `${AppTheme.primary} !important`,
                                        fontSize: `${14}px !important`
                                    },
                                },
                                '& .MuiChartsAxisHighlight-root': {
                                    stroke: `${AppTheme.primary} !important`
                                }
                                // '& .MuiChartsLegend-series > text': {
                                //     stroke: AppTheme.primary,
                                //     fontSize: 14
                                // },
                            }}
                        />
                    </Container>
                </React.Fragment>
            )
        }
    }

    return (
        <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
            {render()}
        </Container>
    )
})

export default AdminAccountAnalyticsView