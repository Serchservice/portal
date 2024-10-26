import { Icon } from "@iconify/react/dist/iconify.js"
import { ActionButton, Column, Container, Notify, Pager, Row, SearchBar, SizedBox, Spacer, StyledMenu, Text, Wrap } from "@serchservice/web-ui-kit"
import { useQuery } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React from "react"
import Connect from "../../../backend/api/Connect"
import Keys from "../../../backend/api/Keys"
import supportStore from "../../../backend/database/device/SupportStore"
import ComplaintScopeResponse from "../../../backend/models/support/ComplaintScopeResponse"
import { RouteInterface } from "../../../configuration/Route"
import AppTheme from "../../../configuration/Theme"
import Filters, { IFilter, IFilterOption } from "../../../utils/Filters"
import Title from "../../../widgets/Title"
import ComplaintChatView from "./chat"
import { ComplaintsListViewLoader } from "./loader"

export default function ComplaintsRoute(): RouteInterface {
    return {
        path: "/support/complaints",
        page: (
            <React.Fragment>
                <Title title="Complaints" description="Handle customer complaints here" useDesktopWidth/>
                <View />
            </React.Fragment>
        ),
        pathView: ({emailAddress}) => `/support/complaints/${emailAddress}`
    }
}

const View: React.FC = observer(() => {
    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.SUPPORT_PAGE("COMPLAINTS")],
        queryFn: () => connect.get("/scope/support/complaint/all")
    });

    const [response, setResponse] = React.useState<ComplaintScopeResponse[]>();

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (Array.isArray(data.data)) {
                    setResponse(data.data.map(data => ComplaintScopeResponse.fromJson(data)));
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [data]);

    const buildView = () => {
        if(isLoading || !data || !response) {
            return (<ComplaintsListViewLoader />)
        } else {
            return (<ComplaintsListView complaints={response} />)
        }
    }

    return (
        <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "12px 12px 0"}}>
            <Row mainAxisSize="max" crossAxis="flex-start" crossAxisSize="max" style={{gap: "12px"}}>
                <Column mainAxisSize="max" style={{maxWidth: "320px", paddingBottom: "12px"}}>
                    <Container backgroundColor={AppTheme.appbar} height="100%" width="100%" borderRadius="16px">
                        <Column mainAxisSize="max">
                            <Row mainAxisSize="max" style={{padding: "12px"}}>
                                <Icon icon="lets-icons:ticket-alt-duotone" width="1.2em" height="1.2em" color={AppTheme.primary} />
                                <SizedBox width={6} />
                                <Text text="Customer Complaints" size={14} color={AppTheme.primary} />
                            </Row>
                            <Container height={2} width="100%" backgroundColor={AppTheme.hint} />
                            {buildView()}
                        </Column>
                    </Container>
                </Column>
                <Column mainAxisSize="max" crossAxisSize="max" style={{paddingBottom: "12px"}}>
                    <Container elevation={3} height="100%" width="100%" borderRadius="16px">
                        <ComplaintChatView onComplaintsUpdated={setResponse} />
                    </Container>
                </Column>
            </Row>
        </Column>
    )
})

interface ComplaintsListViewProps {
    complaints: ComplaintScopeResponse[];
}

const ComplaintsListView: React.FC<ComplaintsListViewProps> = observer(({ complaints }) => {
    const [list, setList] = React.useState(complaints)
    const [filtered, setFiltered] = React.useState(list)
    const [filter, setFilter] = React.useState<string>()
    const [openFilter, setOpenFilter] = React.useState<IFilter>()

    const handleSearch = React.useCallback((results: ComplaintScopeResponse[]) => {
        setList(results);
    }, []);

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const handleFilter = (option: IFilterOption, filter: string) => {
        setFilter(`${filter} - ${option.title}`)
        setAnchor(undefined)

        let result = complaints;

        switch(filter) {
            case Filters.byIssueStatus.header:
                result = complaints.map(complaint => complaint.copyWith({
                    ...complaint,
                    complaints: complaint.complaints.filter(d => d.status === option.value)
                })).filter(scope => scope.complaints.length > 0);
                break;
            case Filters.byCreatedAt.header:
                result = complaints.map(complaint => complaint.copyWith({
                    ...complaint,
                    complaints: complaint.complaints.filter((d) => Filters.filteredByDate(d.createdAt, option.value))
                })).filter(scope => scope.complaints.length > 0);
                break;
            default:
                break;
        }

        setList(result)
    }

    const removeFilter = () => {
        setFilter(undefined)
        setOpenFilter(undefined)
        setList(complaints)
    }

    const buildResult = () => {
        if(filtered.length > 0) {
            return (
                <React.Fragment>{filtered.map((complaint, index) => <Complaint key={index} complaint={complaint} />)}</React.Fragment>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center" style={{gap: "12px"}}>
                        <Icon icon="lets-icons:ticket-alt-duotone" width="5em" height="5em" color={AppTheme.primary} />
                        <Text text={`No tickets found`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    const buttons = [Filters.byIssueStatus, Filters.byMessageStatus, Filters.byCreatedAt, Filters.byUpdatedAt]

    return (
        <React.Fragment>
            <Column crossAxisSize="max" style={{gap: "10px", padding: "12px"}}>
                <SearchBar
                    onSearch={handleSearch}
                    list={complaints}
                    placeholder="Search names, emails, dates..."
                    backgroundColor={AppTheme.background}
                    inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                    boxStyle={{borderRadius: "24px"}}
                    textColor={AppTheme.primary}
                    textFocusedColor={AppTheme.hint}
                    textUnfocusedColor={AppTheme.background}
                    parentStyle={{margin: "0", padding: "0"}}
                />
                <Wrap spacing={10} runSpacing={10}>
                    {buttons.map((button, index) => {
                        return (
                            <ActionButton
                                key={index}
                                padding="6px"
                                borderRadius="6px"
                                backgroundColor={AppTheme.background}
                                fontSize={11}
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
                {filter && (
                    <Row crossAxis="center" gap="10px">
                        <Text text="Current Filter" color={AppTheme.hint} size={13} />
                        <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" style={{backgroundColor: AppTheme.background, borderRadius: "10px", padding: "6px 6px 4px", gap: "10px"}}>
                            <Text text={filter} color={AppTheme.hint} size={13} />
                            <Container hoverBackgroundColor={AppTheme.hover} backgroundColor={"transparent"} padding="3px" borderRadius="50%" onClick={removeFilter}>
                                <Column mainAxis="center" crossAxis="center"><Icon icon="pajamas:close-xs" width="0.8em" height="0.8em" color={AppTheme.primary} /></Column>
                            </Container>
                        </Row>
                    </Row>
                )}
            </Column>
            <Column mainAxisSize="max" style={{overflow: "scroll"}}>
                <Column style={{gap: "6px", padding: "6px"}}>
                    {buildResult()}
                    <Pager items={list} onSlice={setFiltered} itemsPerPage={10} />
                </Column>
            </Column>
            {openFilter && (
                <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.background} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
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
        </React.Fragment>
    )
})

interface ComplaintProps {
    complaint: ComplaintScopeResponse;
}

const Complaint: React.FC<ComplaintProps> = observer(({ complaint }) => {
    const isSelected = complaint.emailAddress === supportStore.read.emailAddress || complaint === supportStore.read.complaint;

    const handleSelect = () => {
        supportStore.set(supportStore.read.copyWith({
            complaint: complaint,
            emailAddress: complaint.emailAddress
        }))
    }

    return (
        <Container
            hoverBackgroundColor={ isSelected ? AppTheme.primary : AppTheme.hover}
            backgroundColor={ isSelected ? AppTheme.primary : AppTheme.appbar}
            padding="12px"
            borderRadius="12px"
            onClick={handleSelect}
            link={`${ComplaintsRoute().path}?from=${complaint.emailAddress}`}
        >
            <Row crossAxis="flex-start" gap="10px">
                <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                    <Text text={complaint.name} size={14} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                    <Text text={complaint.emailAddress} size={12} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                </Column>
                <Spacer />
                {complaint.pendingCount > 0 && (<Text text={`${complaint.pendingCount}`} size={13} color={AppTheme.pending}  />)}
            </Row>
        </Container>
    )
})