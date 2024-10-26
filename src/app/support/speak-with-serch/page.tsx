import { Icon } from "@iconify/react/dist/iconify.js"
import {
    ActionButton, Column, Container, Image, Notify, Pager, Row, SearchBar,
    SizedBox, Spacer, StyledMenu, Text, Utility, Wrap
} from "@serchservice/web-ui-kit"
import { useQuery } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React from "react"
import Connect from "../../../backend/api/Connect"
import Keys from "../../../backend/api/Keys"
import supportStore from "../../../backend/database/device/SupportStore"
import SpeakWithSerchOverviewResponse from "../../../backend/models/support/SpeakWithSerchOverviewResponse"
import SpeakWithSerchResponse from "../../../backend/models/support/SpeakWithSerchResponse"
import { RouteInterface } from "../../../configuration/Route"
import AppTheme from "../../../configuration/Theme"
import Filters, { IFilter, IFilterOption } from "../../../utils/Filters"
import Utils from "../../../utils/Utils"
import Title from "../../../widgets/Title"
import SpeakWithSerchChatView from "./chat"
import { SpeakWithSerchListViewLoader } from "./loader"

export default function SpeakWithSerchRoute(): RouteInterface {
    return {
        path: "/support/speak-with-serch",
        page: (
            <React.Fragment>
                <Title title="Speak With Serch" description="Handle issues and tickets here" useDesktopWidth/>
                <View />
            </React.Fragment>
        ),
        pathView: ({slug}) => `/support/speak-with-serch/${slug}`
    }
}

const View: React.FC = observer(() => {
    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.SUPPORT_PAGE("SPEAK_WITH_SERCH")],
        queryFn: () => connect.get("/scope/support/speak-with-serch")
    });

    const [response, setResponse] = React.useState<SpeakWithSerchOverviewResponse>();

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                setResponse(SpeakWithSerchOverviewResponse.fromJson(data.data));
            } else {
                Notify.error(data.message);
            }
        }
    }, [data]);

    const handleTicketUpdate = (update: SpeakWithSerchResponse) => {
        if (response) {
            const updateTicketInList = (list: SpeakWithSerchResponse[]): SpeakWithSerchResponse[] => {
                return list.map(ticket => ticket.ticket === update.ticket ? update : ticket);
            };

            const updatedAssigned = updateTicketInList(response.assigned).filter(a => a.updatedAt).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            const updatedOthers = updateTicketInList(response.others).filter(a => a.updatedAt).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

            setResponse(response.copyWith({
                assigned: updatedAssigned,
                others: updatedOthers
            }))
        }
    };

    const tabs = ["Assigned", "Unassigned"]
    const [tabValue, setTabValue] = React.useState(tabs[0]);

    const buildAssignedTickets = () => {
        if(isLoading || !data || !response) {
            return (<SpeakWithSerchListViewLoader />)
        } else {
            return (<SpeakWithSerchListView tickets={response.assigned} />)
        }
    }

    const buildUnAssignedTickets = () => {
        if(isLoading || !data || !response) {
            return (<SpeakWithSerchListViewLoader />)
        } else {
            return (<SpeakWithSerchListView tickets={response.others} />)
        }
    }

    const buildPages = () => {
        const pages: React.ReactNode[] = [
            buildAssignedTickets(),
            buildUnAssignedTickets()
        ]

        return (pages[tabs.indexOf(tabValue)])
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
                                <Text text="Speak With Serch | Tickets" size={14} color={AppTheme.primary} />
                            </Row>
                            <Container height={2} width="100%" backgroundColor={AppTheme.hint} />
                            <Row crossAxis="center" style={{ width: "75%", gap: "6px", backgroundColor: AppTheme.background, borderRadius: "24px", padding: "4px", margin: "6px",}}>
                                {tabs.map((tab, index) => {
                                    const isSelected = tab === tabValue;
                                    return (
                                        <ActionButton
                                            key={index}
                                            padding="6px"
                                            borderRadius="16px"
                                            backgroundColor={isSelected ? "#161313FF" : AppTheme.background}
                                            fontSize={12}
                                            hoverBackgroundColor={isSelected ? "#161313FF" : undefined}
                                            hoverColor={isSelected ? "#ffffff" : undefined}
                                            color={isSelected ? "#ffffff" : AppTheme.hint}
                                            onClick={() => setTabValue(tab)}
                                            title={tab}
                                        />
                                    )
                                })}
                            </Row>
                            {buildPages()}
                        </Column>
                    </Container>
                </Column>
                <Column mainAxisSize="max" crossAxisSize="max" style={{paddingBottom: "12px"}}>
                    <Container elevation={3} height="100%" width="100%" borderRadius="16px">
                        <SpeakWithSerchChatView onTicketUpdated={handleTicketUpdate} />
                    </Container>
                </Column>
            </Row>
        </Column>
    )
})

interface SpeakWithSerchListViewProps {
    tickets: SpeakWithSerchResponse[];
}

const SpeakWithSerchListView: React.FC<SpeakWithSerchListViewProps> = observer(({ tickets }) => {
    const [list, setList] = React.useState(tickets)
    const [filtered, setFiltered] = React.useState(list)
    const [filter, setFilter] = React.useState<string>()
    const [openFilter, setOpenFilter] = React.useState<IFilter>()

    const handleSearch = React.useCallback((results: SpeakWithSerchResponse[]) => {
        setList(results);
    }, []);

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const handleFilter = (option: IFilterOption, filter: string) => {
        setFilter(`${filter} - ${option.title}`)
        setAnchor(undefined)

        let result = tickets;

        switch(filter) {
            case Filters.byIssueStatus.header:
                result = tickets.filter(speak => speak.status === option.value).filter(speak => speak.issues.length > 0);
                break;
            case Filters.byMessageStatus.header:
                if (option.value === "UNREAD") {
                    result = tickets.filter(speak => speak.pendingCount > 0).filter(speak => speak.issues.length > 0);
                } else {
                    result = tickets.filter(speak => speak.pendingCount <= 0).filter(speak => speak.issues.length > 0);
                }
                break;
            case Filters.byCreatedAt.header:
                result = tickets.filter((challenge) => Filters.filteredByDate(challenge.createdAt, option.value));
                break;
            case Filters.byUpdatedAt.header:
                result = tickets.filter((challenge) => Filters.filteredByDate(challenge.updatedAt, option.value));
                break;
            default:
                break;
        }

        setList(result)
    }

    const removeFilter = () => {
        setFilter(undefined)
        setOpenFilter(undefined)
        setList(tickets)
    }

    const buildResult = () => {
        if(filtered.length > 0) {
            return (
                <React.Fragment>{filtered.map((ticket, index) => <SpeakWithSerch key={index} ticket={ticket} />)}</React.Fragment>
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
                    list={tickets}
                    placeholder="Search names, emails, dates, ids, tickets..."
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

interface SpeakWithSerchProps {
    ticket: SpeakWithSerchResponse;
}

const SpeakWithSerch: React.FC<SpeakWithSerchProps> = observer(({ ticket }) => {
    const isSelected = ticket.ticket === supportStore.read.ticket || ticket.ticket === supportStore.read.speakWithSerch.ticket;

    const handleSelect = () => {
        supportStore.set(supportStore.read.copyWith({
            ticket: ticket.ticket,
            speakWithSerch: ticket
        }))
    }

    return (
        <Container
            hoverBackgroundColor={ isSelected ? AppTheme.primary : AppTheme.hover}
            backgroundColor={ isSelected ? AppTheme.primary : AppTheme.appbar}
            padding="12px"
            borderRadius="12px"
            onClick={handleSelect}
            link={`${SpeakWithSerchRoute().path}?ticket=${ticket.ticket}`}
        >
            <Row crossAxis="flex-start" gap="10px">
                <Image image={ticket.user.avatar || Utility.DEFAULT_IMAGE} height={30} style={{ borderRadius: "50%" }}/>
                <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                    <Row crossAxis="center" style={{gap: "4px"}}>
                        <Text text={ticket.user.name} size={14} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                        <Container backgroundColor={Utils.supportIconInfo(ticket.status).color} height={6} borderRadius="50%" width={6} />
                    </Row>
                    <Text text={ticket.user.emailAddress} size={12} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                </Column>
                <Spacer />
                {ticket.pendingCount > 0 && (<Text text={`${ticket.pendingCount}`} size={13} color={AppTheme.pending}  />)}
            </Row>
        </Container>
    )
})