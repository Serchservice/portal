import {
    ActionButton, Column, Container, Image, Notify, Pager, Row,
    SearchBar, SimpleStep, SizedBox, Spacer, Text, useDesign, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import React from "react";
import Assets from "../../assets/Assets";
import Connect from "../../backend/api/Connect";
import Keys from "../../backend/api/Keys";
import authStore from "../../backend/database/auth/AuthStore";
import { AdminProfile } from "../../backend/models/profile/AdminProfile";
import { AdminActivityResponse } from "../../backend/models/team/AdminActivityResponse";
import { AdminGroupResponse } from "../../backend/models/team/AdminGroupResponse";
import { AdminListResponse } from "../../backend/models/team/AdminListResponse";
import { CompanyStructureResponse } from "../../backend/models/team/CompanyStructureResponse";
import { TeamOverviewResponse } from "../../backend/models/team/TeamOverviewResponse";
import { RouteConfig, RouteInterface } from "../../configuration/Route";
import AppTheme from "../../configuration/Theme";
import Utils from "../../utils/Utils";
import { Metric } from "../../widgets/Metrics";
import Title from "../../widgets/Title";
import { TeamActivitiesLoader, TeamHeaderLoader, TeamListLoader, TeamMetricLoader } from "./loader";
import CompanyStructureModal from "./modals/CompanyStructureModal";
import InviteAdminModal from "./modals/InviteAdminModal";
import AdminRoute from "./[slug]/page";
import useAdminUpdate from "../../configuration/hooks/useAdminUpdate";

export default function TeamRoute(): RouteInterface {
    return {
        path: "/team",
        page: (
            <React.Fragment>
                <Title title="Team Overview" useDesktopWidth description="View and manage team information in the portal" />
                <Layout />
            </React.Fragment>
        ),
        children: [
            AdminRoute()
        ]
    }
}

const Layout: React.FC = observer(() => {
    const [totalAdministrators, setTotalAdministrators] = React.useState<number>()
    const [activities, setActivities] = React.useState<AdminActivityResponse[]>()
    const [structure, setStructure] = React.useState<CompanyStructureResponse>()

    return (
        <Column mainAxisSize="max" crossAxisSize="max" mainAxis="flex-start" crossAxis="flex-start" style={{gap: "5px", padding: "8px 8px 0", overflow: "hidden"}}>
            <HeaderView totalAdministrators={totalAdministrators} structure={structure} />
            <MetricView
                onFetchStructure={setStructure}
                onFetchActivities={setActivities}
                onFetchTotalAdministrators={setTotalAdministrators}
            />
            <Column style={{overflow: "scroll"}}>
                <BodyView activities={activities} />
            </Column>
        </Column>
    )
})

interface HeaderViewProps {
    totalAdministrators: number | undefined;
    structure: CompanyStructureResponse | undefined;
}

const HeaderView: React.FC<HeaderViewProps> = observer(({ totalAdministrators, structure }) => {
    const [isCreate, setIsCreate] = React.useState(false);
    const [showStructure, setShowStructure] = React.useState(false);

    const render = (): JSX.Element => {
        if(!totalAdministrators && !structure) {
            return (<TeamHeaderLoader />)
        } else {
            const now = new Date();

            return (
                <React.Fragment>
                    <Column crossAxis="flex-start" crossAxisSize="min">
                        <Text text="Today's Date" color={AppTheme.hint} />
                        <SizedBox height={10} />
                        <Text text={Utility.formatDate(now.toDateString())} color={AppTheme.primary} size={24} />
                    </Column>
                    <SizedBox width={30} />
                    <Column crossAxis="flex-start" crossAxisSize="min">
                        <Text text="Total Administrators" color={AppTheme.hint} />
                        <SizedBox height={10} />
                        <Text text={`${totalAdministrators || 0}`} color={AppTheme.primary} size={24} />
                    </Column>
                    <Spacer />
                    {structure && (
                        <ActionButton
                            padding="8px 12px"
                            backgroundColor={AppTheme.secondary}
                            fontSize={12}
                            color={AppTheme.primary}
                            onClick={() => setShowStructure(true)}
                            title="Show Company tree"
                        />
                    )}
                    {structure && (<SizedBox width={20} />)}
                    {(authStore.read.isSuper || authStore.read.isAdmin || authStore.read.isManager) && (
                        <ActionButton
                            padding="8px 12px"
                            backgroundColor={AppTheme.secondary}
                            fontSize={12}
                            color={AppTheme.primary}
                            onClick={() => setIsCreate(true)}
                            title="Invite new member"
                        />
                    )}
                    <InviteAdminModal isOpen={isCreate} handleClose={() => setIsCreate(false)} />
                    {structure && (<CompanyStructureModal isOpen={showStructure} handleClose={() => setShowStructure(false)} structure={structure} />)}
                </React.Fragment>
            )
        }
    }

    return (
        <Container width="100%" backgroundColor={AppTheme.primaryLight} borderRadius="10px" padding="12px">
            <Row mainAxisSize="max" crossAxis="center">{render()}</Row>
        </Container>
    )
})

interface MetricViewProps {
    onFetchActivities: (activities: AdminActivityResponse[]) => void;
    onFetchStructure: (structure: CompanyStructureResponse) => void;
    onFetchTotalAdministrators: (count: number) => void;
}

const MetricView: React.FC<MetricViewProps> = observer(({ onFetchActivities, onFetchStructure, onFetchTotalAdministrators }) => {
    const connect = new Connect({})

    const { data, isLoading } = useQuery({
        queryKey: [Keys.TEAM_PAGE("Header")],
        queryFn: () => connect.get("/admin/team/overview")
    })

    const [list, setList] = React.useState<TeamOverviewResponse>()
    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                const team = TeamOverviewResponse.fromJson(data.data)
                setList(team);
                onFetchActivities(team.activities)

                const totalCount = team.teams.reduce((sum, item) => {
                    return sum + parseInt(item.count, 10);
                }, 0);
                onFetchTotalAdministrators(totalCount)

                if(team.structure) {
                    onFetchStructure(team.structure)
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    const render = (): JSX.Element => {
        if(isLoading || !data) {
            return (<TeamMetricLoader />)
        } else {
            return (
                <React.Fragment>
                    <Text text="Administrator Analytics" color={AppTheme.hint} />
                    <SizedBox height={20} />
                    <Column mainAxisSize="max" crossAxis="flex-start">
                        <Wrap crossAxisAlignment="center" spacing={10} runSpacing={10}>
                            {list && list.teams.map((team, index) => {
                                return (
                                    <Metric
                                        key={index}
                                        title={team.header}
                                        value={team.count}
                                        valueStyle={{fontSize: "20px"}}
                                        titleStyle={{fontSize: "14px"}}
                                        containerStyle={{width: "160px"}}
                                    />
                                )
                            })}
                        </Wrap>
                        <SizedBox height={10} />
                        <Wrap crossAxisAlignment="center" spacing={10} runSpacing={10}>
                            {list && list.overview.map((view, index) => {
                                return (
                                    <Metric
                                        key={index}
                                        title={view.header}
                                        value={view.count}
                                        valueStyle={{fontSize: "20px"}}
                                        titleStyle={{fontSize: "14px"}}
                                        containerStyle={{width: "160px"}}
                                        iconColor={Utils.getAccountStatusIconInfo(view.header).color}
                                        icon={Utils.getAccountStatusIconInfo(view.header).icon}
                                    />
                                )
                            })}
                        </Wrap>
                    </Column>
                </React.Fragment>
            )
        }
    }

    return (
        <Container width="100%" backgroundColor={AppTheme.primaryLight} borderRadius="10px" padding="12px">{render()}</Container>
    )
})

interface BodyViewProps {
    activities: AdminActivityResponse[] | undefined;
}

const BodyView: React.FC<BodyViewProps> = observer(({ activities }) => {
    const connect = new Connect({})

    const { data, isLoading } = useQuery({
        queryKey: [Keys.TEAM_PAGE("Body")],
        queryFn: () => connect.get("/admin/team/all")
    })

    const [list, setList] = React.useState<AdminListResponse>()

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                const admins = AdminListResponse.fromJson(data.data)
                setList(admins);
            } else {
                Notify.error(data.message);
            }
        }
    }, [data])

    const renderListView = (): JSX.Element => {
        if(isLoading && !data) {
            return (<TeamListLoader />)
        } else if(list) {
            return (<AdminListView admins={list.admins} />)
        } else {
            return(<></>)
        }
    }

    return (
        <Row mainAxisSize="max" crossAxisSize="min" crossAxis="flex-start" style={{overflow: "hidden"}}>
            <Column mainAxisSize="max" crossAxisSize="max" style={{overflow: "scroll"}}>
                <Container width="100%" backgroundColor={AppTheme.primaryLight} borderRadius="10px" padding="12px">
                    {renderListView()}
                </Container>
            </Column>
            <SizedBox width={10} />
            <ActivityView activities={activities} />
        </Row>
    )
})

interface AdminListViewProps {
    admins: AdminGroupResponse[];
}

const AdminListView: React.FC<AdminListViewProps> = observer(({admins}) => {
    const [activeList, setActiveList] = React.useState<AdminProfile[]>(admins?.[0]?.admins ?? []);
    const [filtered, setFiltered] = React.useState<AdminProfile[]>(activeList);

    const handleSearch = React.useCallback((results: AdminProfile[]) => {
        setFiltered(results);
    }, []);

    const { openTeamTab, handleTeamTab } = useAdminUpdate()
    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const view = searchParams.get("view");

        if(view && view !== '') {
            handleTeamTab(view)

            const found = admins.find((i) => i.role.toUpperCase() === view.toUpperCase());
            if(found) {
                setActiveList(found.admins)
            }
        }
    }, [location.search])

    return (
        <React.Fragment>
            <Wrap crossAxisAlignment="center" spacing={10} runSpacing={10}>
                {admins.map((filter, index) => {
                    const isSelected = filter.role.toUpperCase() === openTeamTab.toUpperCase();

                    return (
                        <ActionButton
                            key={index}
                            padding="8px"
                            borderRadius="8px"
                            backgroundColor={isSelected ? AppTheme.primary : AppTheme.appbar}
                            fontSize={11}
                            color={isSelected ? AppTheme.secondary : AppTheme.hint}
                            onClick={() => {
                                handleTeamTab(filter.role)

                                const found = admins.find((i) => i.role === filter.role);
                                if(found) {
                                    setActiveList(found.admins)
                                }
                            }}
                            title={filter.role}
                        />
                    )
                })}
            </Wrap>
            <SizedBox height={10} />
            {admins.length > 0 && (<Container height={1} width="100%" backgroundColor={AppTheme.hint} borderRadius="3px" />)}
            <SearchBar
                onSearch={handleSearch}
                list={activeList}
                placeholder="Search names, ids, email address, roles"
                backgroundColor={AppTheme.appbar}
                inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                boxStyle={{borderRadius: "10px"}}
                textColor={AppTheme.primary}
            />
            <SizedBox height={30} />
            <Wrap crossAxisAlignment="center" spacing={20} runSpacing={20}>
                {filtered.map((admin, index) => <AdminView admin={admin} key={index} />)}
            </Wrap>
            {filtered.length === 0 && (
                <React.Fragment>
                    <SizedBox height={30} />
                    <Row mainAxis="center"><Image image={Assets.auth.administrator} height={120} /></Row>
                    <SizedBox height={30} />
                    <Row mainAxis="center"><Text text="No administrators found" size={16} color={AppTheme.primary} /></Row>
                </React.Fragment>
            )}
            <SizedBox height={10} />
            <Pager onSlice={setFiltered} itemsPerPage={10} items={activeList} />
        </React.Fragment>
    )
})

interface AdminViewProps {
    admin: AdminProfile;
}

const AdminView: React.FC<AdminViewProps> = observer(({admin}) => {
    const [elevation, setElevation] = React.useState(0)
    const { width } = useDesign()

    const renderImage = (): JSX.Element => {
        if(admin.avatar) {
            return (
                <Image image={admin.avatar} height={90} style={{
                    borderRadius: "50%",
                    backgroundColor: AppTheme.appbarDark,
                    padding: "1px"
                }}/>
            )
        } else {
            return (
                <Container borderRadius="50%" height={90} width={90} padding="8px 7px" backgroundColor={Utility.getRandomColor()}>
                    <Column mainAxis="center" mainAxisSize="max">
                        <Text
                            align="center"
                            text={admin.short}
                            size={24}
                            color={Utility.lightenColor(Utility.getRandomColor(), 90)}
                            flow="ellipsis"
                        />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <Container
            backgroundColor={AppTheme.appbar}
            borderRadius="10px"
            padding="12px"
            width={width <= 800 ? "100%" : "250px"}
            link={RouteConfig.getAccountRoute(admin.role, admin.id)}
            elevation={elevation}
            onHover={v => v ? setElevation(4) : setElevation(0)}
        >
            {renderImage()}
            <SizedBox height={10} />
            <Text text={admin.name} flow="ellipsis" size={14} color={AppTheme.primary} />
            <SizedBox height={7} />
            <Text text={Utils.clearRole(admin.role)} size={10} color={AppTheme.primary} />
            <SizedBox height={20} />
            <Text text={admin.emailAddress} size={10} flow="ellipsis" color={AppTheme.primary} />
            <SizedBox height={7} />
            <Text text={admin.lastSignedIn} size={10} color={AppTheme.primary} />
            <SizedBox height={7} />
            <Text text={admin.status} size={10} color={Utils.getAccountStatusIconInfo(admin.status).color} />
        </Container>
    )
})

interface ActivityViewProps {
    activities: AdminActivityResponse[] | undefined;
}

const ActivityView: React.FC<ActivityViewProps> = observer(({activities}) => {
    const [list, setList] = React.useState(activities)

    const renderActivityView = (): JSX.Element => {
        if(list) {
            return (
                <React.Fragment>
                    <Text text="Overall Activities" size={15} color={AppTheme.hint} />
                    <SizedBox height={10} />
                    <Container height={1} width="100%" backgroundColor={AppTheme.hint} borderRadius="3px" />
                    <SizedBox height={10} />
                    {list.map((activity, index) => {
                        return (
                            <SimpleStep
                                key={index}
                                content={
                                    <Container key={index} backgroundColor={AppTheme.appbar} borderRadius="12px" padding="12px" width="100%">
                                        <Text text={activity.label} size={12} color={AppTheme.hint} />
                                        <SizedBox height={6} />
                                        <Text text={activity.activity} size={13} color={AppTheme.primary} />
                                    </Container>
                                }
                                color={AppTheme.hint}
                                showBottom={list.length - 1 !== index}
                            />
                        )
                    })}
                </React.Fragment>
            )
        } else {
            return (<TeamActivitiesLoader />)
        }
    }

    return (
        <Column mainAxisSize="max" crossAxisSize="max" style={{overflow: "scroll", maxWidth: "400px"}}>
            <Container width="100%" backgroundColor={AppTheme.primaryLight} borderRadius="10px" padding="12px">
                {renderActivityView()}
            </Container>
            {activities && (<SizedBox height={10} />)}
            {activities && (<Pager onSlice={setList} itemsPerPage={10} items={activities} />)}
        </Column>
    )
})