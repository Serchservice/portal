import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionButton, Column, Container, Pager, Row, SearchBar, SizedBox, Spacer, StyledMenu, Text, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import AccountSessionResponse from "../../../../backend/models/account/AccountSessionResponse";
import AdminScopeResponse from "../../../../backend/models/team/AdminScopeResponse";
import AppTheme from "../../../../configuration/Theme";
import Filters, { IFilter, IFilterOption } from "../../../../utils/Filters";
import { AdminInterface } from "../page";
import AdminSessionDetails from "../modals/AdminSessionDetails";

const AdminSessionView: React.FC<AdminInterface> = observer(({ admin, onAdminUpdated }) => {
    const [list, setList] = React.useState<AccountSessionResponse[]>(admin.sessions)
    const [filtered, setFiltered] = React.useState<AccountSessionResponse[]>(admin.sessions);
    const [filter, setFilter] = React.useState<string>()
    const [openFilter, setOpenFilter] = React.useState<IFilter>()

    const handleSearch = React.useCallback((results: AccountSessionResponse[]) => {
        setList(results);
    }, []);

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const handleFilter = (option: IFilterOption, filter: string) => {
        setFilter(`${filter} - ${option.title}`)
        setAnchor(undefined)

        let result = admin.sessions;

        switch(filter) {
            case Filters.bySessionStatus.header:
                result = admin.sessions.filter(session => session.revoked === (option.value === "INACTIVE"));
                break;
            case Filters.byCreatedAt.header:
                result = admin.sessions.filter((session) => Filters.filteredByDate(session.createdAt, option.value));
                break;
            case Filters.byUpdatedAt.header:
                result = admin.sessions.filter((session) => Filters.filteredByDate(session.updatedAt, option.value));
                break;
            default:
                break;
        }

        setList(result)
    }

    const removeFilter = () => {
        setFilter(undefined)
        setOpenFilter(undefined)
        setList(admin.sessions)
    }

    const buildResult = () => {
        if(filtered.length > 0) {
            return (
                <Wrap spacing={20} runSpacing={20}>
                    {filtered.map((session, index) => <Session
                        key={index}
                        session={session}
                        admin={admin}
                        onAdminUpdated={onAdminUpdated}
                    />)}
                </Wrap>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`No sessions for ${admin.profile.name}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    const buttons = [Filters.bySessionStatus, Filters.byCreatedAt, Filters.byUpdatedAt]

    return (
        <React.Fragment>
            <Row mainAxisSize="max" crossAxis="center">
                <Container width="750px">
                    <SearchBar
                        onSearch={handleSearch}
                        list={admin.sessions}
                        placeholder="Search dates, devices, tokens, platforms, ids..."
                        backgroundColor={AppTheme.appbar}
                        inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                        boxStyle={{borderRadius: "10px"}}
                        textColor={AppTheme.primary}
                        textFocusedColor={AppTheme.hint}
                        textUnfocusedColor={AppTheme.appbar}
                        parentStyle={{margin: "0", padding: "0"}}
                    />
                </Container>
                <Spacer />
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
            </Row>
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
            {filter && (<SizedBox height={10} />)}
            {filter && (
                <Row crossAxis="center" style={{gap: "10px"}}>
                    <Text text="Current Filter" color={AppTheme.hint} size={13} />
                    <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" style={{backgroundColor: AppTheme.appbar, borderRadius: "10px", padding: "6px 6px 4px", gap: "10px"}}>
                        <Text text={filter} color={AppTheme.hint} size={13} />
                        <Container hoverBackgroundColor={AppTheme.hover} backgroundColor={"transparent"} padding="3px" borderRadius="50%" onClick={removeFilter}>
                            <Column mainAxis="center" crossAxis="center"><Icon icon="pajamas:close-xs" width="0.8em" height="0.8em" color={AppTheme.primary} /></Column>
                        </Container>
                    </Row>
                </Row>
            )}
            <SizedBox height={30} />
            {buildResult()}
            <Pager items={list} onSlice={setFiltered} itemsPerPage={10} />
        </React.Fragment>
    )
})

type SessionProps = {
    session: AccountSessionResponse;
    admin: AdminScopeResponse;
    onAdminUpdated: (admin: AdminScopeResponse) => void
}

const Session: React.FC<SessionProps> = observer(({ session, admin, onAdminUpdated }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <React.Fragment>
            <Container backgroundColor={ isOpen ? AppTheme.hover : AppTheme.appbar} width="250px" borderRadius="10px" padding="12px">
                <Row crossAxis="flex-start" mainAxisSize="max">
                    <Column crossAxis="flex-start" crossAxisSize="max">
                        <Text text={session.name} size={14} color={AppTheme.primary} flow="ellipsis" />
                        <SizedBox height={4} />
                        <Text text={Utility.capitalizeFirstLetter(session.platform)} size={12} color={AppTheme.primary} flow="ellipsis" />
                    </Column>
                    <Spacer />
                    <Icon icon="duo-icons:chip" height="2em" width="2em" color={AppTheme.primary} />
                </Row>
                <SizedBox height={8} />
                <Container backgroundColor={AppTheme.background} borderRadius="0px" padding="6px">
                    <Text text={session.id} size={11} color={AppTheme.primary} flow="ellipsis" wrap={false} autoSize={false} />
                </Container>
                <SizedBox height={10} />
                <Text text={`${session.refreshTokens.length}`} color={AppTheme.primary} size={28} />
                <SizedBox height={10} />
                <Row crossAxis="center">
                    <Container padding="6px 6px 4px" backgroundColor={session.revoked ? AppTheme.error : AppTheme.success} borderRadius="10px">
                        <Text text={session.revoked ? "INACTIVE" : "ACTIVE"} color='#fff' size={11} />
                    </Container>
                    <Spacer />
                    <Container padding="6px 6px 4px" backgroundColor={AppTheme.background} borderRadius="24px" onClick={() => setIsOpen(true)} hoverBackgroundColor={AppTheme.hover}>
                        <Text text="View details" color={AppTheme.hint} size={11} />
                    </Container>
                </Row>
            </Container>
            <AdminSessionDetails
                session={session}
                admin={admin.profile}
                isOpen={isOpen}
                onSessionUpdated={sessions => onAdminUpdated(admin.copyWith({ sessions: sessions }))}
                handleClose={() => setIsOpen(false)}
            />
        </React.Fragment>
    )
})

export default AdminSessionView