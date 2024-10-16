import { useQuery } from "@tanstack/react-query";
import Connect from "../../../../backend/api/Connect";
import Keys from "../../../../backend/api/Keys";
import { RouteConfig, RouteInterface } from "../../../../configuration/Route";
import React from "react";
import GroupRequestedPermission from "../../../../backend/models/permission/GroupRequestedPermission";
import {
    ActionButton, Column, Container, Notify, Pager, Row, SearchBar,
    Shimmer, SizedBox, Spacer, StyledMenu, Text, useDesign, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { Icon } from "@iconify/react/dist/iconify.js";
import authStore from "../../../../backend/database/auth/AuthStore";
import AppTheme from "../../../../configuration/Theme";
import preferenceStore from "../../../../backend/database/device/PreferenceStore";
import Filters, { IFilter, IFilterOption } from "../../../../utils/Filters";
import { observer } from "mobx-react-lite";
import RequestedPermission from "../../../../backend/models/permission/RequestedPermission";
import { PermissionExpiration } from "../../../../widgets/PermissionTable";
import { AdminRoute } from "../../../team/[slug]/page";
import RequestedPermissionView from "./modal/RequestedPermissionView";
import Utils from "../../../../utils/Utils";
import { PermissionStatus } from "../../../../utils/Enums";

export const RequestedPermissionRoute: RouteInterface = {
    path: "/profile/permission/requested",
    page: <RequestedPermissionPage />,
}

export default function RequestedPermissionPage() {
    const { isMobile } = useDesign();
    const dimmed = preferenceStore.read.isDark;

    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.LOGGED_IN_ADMIN_REQUESTED_PERMISSIONS],
        queryFn: () => connect.get("/admin/permission/requests")
    })

    const [requests, setRequests] = React.useState<GroupRequestedPermission[]>();

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data && Array.isArray(data.data)) {
                    const list = data.data?.map(group => GroupRequestedPermission.fromJson(group))
                    setRequests(list);
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    const buildView = () => {
        const loading = isLoading || !data;

        if(loading) {
            return (
                <Column style={{gap: "20px"}}>
                    <SizedBox height={10} />
                    <Column crossAxis="flex-start">
                        <Shimmer height={50} width="100%" radius={12} dimmed={dimmed} />
                        <SizedBox height={20} />
                        <Wrap spacing={10} runSpacing={10}>
                            {Utility.itemGenerate(3).map((_, index) => <Shimmer key={index} height={30} radius={12} width={100} dimmed={dimmed} />)}
                        </Wrap>
                    </Column>
                    {Utility.itemGenerate(10).map((_, index) => <Shimmer key={index} height={100} radius={12} width="100%" dimmed={dimmed} />)}
                </Column>
            )
        } else if(requests && requests.length > 0) {
            return (
                <Column style={{gap: "20px"}}>
                    <RequestListView requests={requests} onUpdated={setRequests} />
                </Column>
            )
        } else {
            return (
                <Column crossAxis="flex-start" mainAxis="center" crossAxisSize="max" mainAxisSize="max">
                    <Icon icon="duo-icons:alert-octagon" color={AppTheme.hint} width="4em" />
                    <SizedBox height={20} />
                    <Text text={`Hello ${authStore.read.name},`} color={AppTheme.primary} size={isMobile ? 16 : 18} />
                    <SizedBox height={10} />
                    <Text text={`You do not have any requested permission`} color={AppTheme.hint} size={14} />
                </Column>
            )
        }
    }

    return (
        <Column crossAxisSize="max" mainAxisSize="max" style={{padding: "20px", overflow: "scroll"}}>
            <Text text="Requested Permissions" size={16} color={AppTheme.primary} />
            <SizedBox height={20} />
            {buildView()}
        </Column>
    )
}

interface RequestListViewProps {
    requests: GroupRequestedPermission[];
    onUpdated: (groups: GroupRequestedPermission[]) => void
}

const RequestListView: React.FC<RequestListViewProps> = observer(({ requests, onUpdated }) => {
    const [list, setList] = React.useState<GroupRequestedPermission[]>(requests);
    const [filtered, setFiltered] = React.useState<GroupRequestedPermission[]>([]);
    const [filter, setFilter] = React.useState<string>()
    const [openFilter, setOpenFilter] = React.useState<IFilter>()

    const handleSearch = React.useCallback((results: GroupRequestedPermission[]) => {
        setList(results);
    }, []);

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const handleFilter = (option: IFilterOption, filter: string) => {
        setFilter(`${filter} - ${option.title}`)
        setAnchor(undefined)

        let result = requests;

        switch(filter) {
            case Filters.byRequest.header:
                result = requests.map(req => req.copyWith({
                    ...req,
                    requests: req.requests.filter(r => {
                        if(option.value === "ME") {
                            return r.details && r.details.admin === authStore.read.id;
                        } else {
                            return r.details && r.details.admin !== authStore.read.id;
                        }
                    })
                }))
                break;
            case Filters.byPermissionStatus.header:
                result = requests.map(req => req.copyWith({
                    ...req,
                    requests: req.requests.filter(r => (r.isGranted && option.value === PermissionStatus.APPROVED)
                        || (r.isPending && option.value === PermissionStatus.PENDING)
                        || (r.isRevoked && option.value === PermissionStatus.REVOKED)
                        || (r.isDeclined && option.value === PermissionStatus.REJECTED)
                    )
                }))
                break;
            case Filters.byCreatedAt.header:
                result = requests.filter((req) => Filters.filteredByDate(req.createdAt, option.value));
                break;
            default:
                break;
        }

        setList(result)
    }

    const removeFilter = () => {
        setFilter(undefined)
        setOpenFilter(undefined)
        setList(requests)
    }

    const buildResult = () => {
        if(filtered.length > 0) {
            return (
                <Wrap spacing={20} runSpacing={20}>
                    {filtered.map((request, index) => {
                        if(request.requests && request.requests.length > 0) {
                            return (<RequestView onUpdated={onUpdated} request={request} key={index} />)
                        } else {
                            return (<React.Fragment key={index}></React.Fragment>)
                        }
                    })}
                </Wrap>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`No permission request found`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    const buttons = [Filters.byRequest, Filters.byCreatedAt, Filters.byPermissionStatus]

    return (
        <React.Fragment>
            <Column crossAxis="flex-start">
                <SearchBar
                    onSearch={handleSearch}
                    list={requests}
                    placeholder="Search names, ids, and other keywords..."
                    backgroundColor={AppTheme.appbar}
                    inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                    boxStyle={{borderRadius: "10px"}}
                    textColor={AppTheme.primary}
                    textFocusedColor={AppTheme.hint}
                    textUnfocusedColor={AppTheme.appbar}
                    parentStyle={{margin: "0", padding: "0"}}
                />
                <SizedBox height={20} />
                <Row crossAxis="center">
                    <Wrap spacing={10}>
                        {buttons.map((button, index) => {
                            return (
                                <ActionButton
                                    key={index}
                                    padding="6px"
                                    borderRadius="6px"
                                    backgroundColor={AppTheme.appbar}
                                    fontSize={12}
                                    color={AppTheme.primary}
                                    onClick={e => {
                                        setOpenFilter(button)
                                        setAnchor(e.currentTarget)
                                    }}
                                    title={button.header}
                                />
                            )
                        })}
                    </Wrap>
                    <Spacer />
                    {filter && (
                        <Row crossAxis="center" mainAxisSize="min" style={{gap: "10px"}}>
                            <Text text="Current Filter" color={AppTheme.hint} size={13} />
                            <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" style={{backgroundColor: AppTheme.appbar, borderRadius: "10px", padding: "6px 6px 4px", gap: "10px"}}>
                                <Text text={filter} color={AppTheme.hint} size={13} />
                                <Container hoverBackgroundColor={AppTheme.hover} backgroundColor={"transparent"} padding="3px" borderRadius="50%" onClick={removeFilter}>
                                    <Column mainAxis="center" crossAxis="center"><Icon icon="pajamas:close-xs" width="0.8em" height="0.8em" color={AppTheme.primary} /></Column>
                                </Container>
                            </Row>
                        </Row>
                    )}
                </Row>
            </Column>
            {openFilter && (
                <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.appbar} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                    {openFilter.options.map((option, index) => {
                        return (
                            <Container
                                key={index}
                                padding="10px"
                                onClick={() => handleFilter(option, openFilter.header)}
                                hoverBackgroundColor={AppTheme.hover}
                                backgroundColor={"transparent"}
                            >
                                <Text text={option.title} size={12} color={AppTheme.primary} />
                            </Container>
                        )
                    })}
                </StyledMenu>
            )}
            {buildResult()}
            <Pager items={list} onSlice={setFiltered} itemsPerPage={10} />
        </React.Fragment>
    )
})

interface RequestViewProps {
    request: GroupRequestedPermission;
    onUpdated: (list: GroupRequestedPermission[]) => void
}

const RequestView: React.FC<RequestViewProps> = observer(({ request, onUpdated }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Column style={{gap: "10px", width: "100%", transition: "all 0.4s", height: "auto"}} crossAxis="flex-start">
            <Container
                width="100%"
                padding="6px"
                backgroundColor={AppTheme.hover}
                hoverBackgroundColor={Utility.lightenColor(AppTheme.hover, 10)}
                borderRadius="12px" onClick={() => setIsOpen(!isOpen)}
            >
                <Row mainAxisSize="max" crossAxis="center">
                    <Text text={request.label} color={AppTheme.hint} size={14} />
                    <Spacer />
                    <Icon icon="ep:arrow-right" height="1.2em" width="1.2em" color={AppTheme.primary} style={{
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: "all 0.4s"
                    }} />
                </Row>
            </Container>
            {isOpen && (request.requests.map((permission, i) => <Request key={i} permission={permission} onUpdated={onUpdated} />))}
        </Column>
    )
})

interface RequestProps {
    permission: RequestedPermission;
    onUpdated: (list: GroupRequestedPermission[]) => void
}

const Request: React.FC<RequestProps> = observer(({ permission, onUpdated }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const isSpecific = permission.account && permission.account.account !== ""
    const notMe = permission.details && permission.details.admin !== authStore.read.id;
    const link = notMe ? RouteConfig.getRoute(AdminRoute, {slug: permission.details.admin}) : undefined
    const color = permission.isGranted ? AppTheme.success : permission.isPending ? AppTheme.pending : AppTheme.error
    const icon = permission.isGranted ? "duo-icons:check-circle" : permission.isRevoked ? "lets-icons:cancel-duotone" : "solar:clock-circle-bold-duotone"

    return (
        <React.Fragment>
            <Container width="100%" padding="12px" borderRadius="6px" backgroundColor={isOpen ? AppTheme.hover : AppTheme.appbar} hoverBackgroundColor={AppTheme.hover} onClick={() => setIsOpen(true)}>
                <Column style={{gap: "5px"}}>
                    <Row crossAxis="center" mainAxisSize="max">
                        <Column style={{gap: "4px"}}>
                            <Text text={isSpecific ? "SPECIFIC" : "CLUSTER"} color={AppTheme.hint} size={11} />
                            <Text
                                text={`${Utils.clearRole(permission.scope)} ::: ${permission.permission}`}
                                color={AppTheme.primary}
                                opacity={8}
                                size={12}
                            />
                        </Column>
                        <Spacer />
                        <Icon icon={icon} height="2.5em" width="2.5em" color={ color } />
                    </Row>
                    <Container backgroundColor={AppTheme.primary} height="1px" width="50%" padding="1px" borderRadius="12px" />
                    {(permission.expiration && !permission.isRevoked) && (<PermissionExpiration message={permission.expiration} />)}
                    <Row crossAxis="center">
                        <Container borderRadius="6px" backgroundColor={AppTheme.background} padding="5px" link={link}>
                            <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" style={{gap: "10px"}}>
                                <Text text={`Requesting Admin: ${permission.details.name}`} size={12} color={AppTheme.hint} />
                                {notMe && (<Icon icon="fluent:open-20-filled" width="1em" height="1em" style={{color: AppTheme.hint}} />)}
                            </Row>
                        </Container>
                        <Spacer />
                        <Text text="View details" color={AppTheme.hint} size={12} />
                    </Row>
                </Column>
            </Container>
            <RequestedPermissionView isOpen={isOpen} handleClose={() => setIsOpen(false)} permission={permission} onUpdated={onUpdated} />
        </React.Fragment>
    )
})