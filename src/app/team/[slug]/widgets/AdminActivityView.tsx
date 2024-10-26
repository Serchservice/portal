import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionButton, Column, Container, Pager, Row, SearchBar, SizedBox, Spacer, StyledMenu, Text, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import { AdminActivityResponse } from "../../../../backend/models/team/AdminActivityResponse";
import AppTheme from "../../../../configuration/Theme";
import Filters, { IFilter, IFilterOption } from "../../../../utils/Filters";
import TimeUtils from "../../../../utils/TimeUtils";
import { AdminInterface } from "../page";
import { RouteConfig } from "../../../../configuration/Route";
import AdminScopeResponse from "../../../../backend/models/team/AdminScopeResponse";

const AdminActivityView: React.FC<AdminInterface> = observer(({ admin }) => {
    const [list, setList] = React.useState<AdminActivityResponse[]>(admin.activities)
    const [filtered, setFiltered] = React.useState<AdminActivityResponse[]>(admin.activities);
    const [filter, setFilter] = React.useState<string>()
    const [openFilter, setOpenFilter] = React.useState<IFilter>()

    const handleSearch = React.useCallback((results: AdminActivityResponse[]) => {
        setList(results);
    }, []);

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const handleFilter = (option: IFilterOption, filter: string) => {
        setFilter(`${filter} - ${option.title}`)
        setAnchor(undefined)

        let result = admin.activities;

        switch(filter) {
            case Filters.byCreatedAt.header:
                result = admin.activities.filter((activity) => Filters.filteredByDate(activity.createdAt, option.value));
                break;
            case Filters.byUpdatedAt.header:
                result = admin.activities.filter((activity) => Filters.filteredByDate(activity.updatedAt, option.value));
                break;
            default:
                break;
        }

        setList(result)
    }

    const removeFilter = () => {
        setFilter(undefined)
        setOpenFilter(undefined)
        setList(admin.activities)
    }

    const buildResult = () => {
        if(filtered.length > 0) {
            return (
                <React.Fragment>
                    {filtered.map((activity, index) =>
                        <Activity key={index} admin={admin} activity={activity} showLine={filtered.length - 1 !== index} />
                    )}
                </React.Fragment>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`No activities for ${admin.profile.name}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    const buttons = [Filters.byCreatedAt, Filters.byUpdatedAt]

    return (
        <React.Fragment>
            <Row mainAxisSize="max" crossAxis="center">
                <Container width="750px">
                    <SearchBar
                        onSearch={handleSearch}
                        list={admin.activities}
                        placeholder="Search names, ids, events, dates"
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
                <Row crossAxis="center" gap="10px">
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

interface ActivityProps {
    activity: AdminActivityResponse;
    admin: AdminScopeResponse;
    showLine: boolean;
}

const Activity: React.FC<ActivityProps> = observer(({ activity, showLine, admin }) => {
    // State to hold the calculated height of the content
    const [calculatedHeight, setCalculatedHeight] = React.useState(50);

    // Reference to the content div for measuring its height
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Effect to calculate the height of the content after it mounts
    React.useEffect(() => {
        if (contentRef.current) {
            // Get the height of the content element
            const { height } = contentRef.current.getBoundingClientRect();
            setCalculatedHeight(height); // Update the state with the content's height
        }
    }, []);

    const showAssociated = activity.associated && activity.associated !== admin.profile.id;

    return (
        <Row crossAxisSize="min" crossAxis="flex-start" mainAxisSize="max" style={{gap: "5px"}}>
            <Column crossAxis="center" mainAxisSize="min" crossAxisSize="min" style={{gap: "4px"}}>
                <Icon icon="solar:route-bold-duotone" width="1.8em" height="1.8em" color={AppTheme.hint} />
                {showLine && (<Container backgroundColor={AppTheme.appbar} height={calculatedHeight} width={4} padding="2px" borderRadius="12px" />)}
            </Column>
            <Container containerRef={contentRef} margin="4px 0 0" backgroundColor={AppTheme.appbar} width="100%" padding="10px" borderRadius="7px">
                <Row crossAxis="center">
                    <Text text={activity.label} color={AppTheme.hint} size={12} />
                    <Spacer />
                    <Text text={TimeUtils.time(activity.createdAt)} color={AppTheme.hint} size={12} />
                </Row>
                <SizedBox height={4} />
                <Text text={activity.header} color={AppTheme.primary} size={14} />
                {activity.activity && (<SizedBox height={20} />)}
                {activity.activity && (<Container backgroundColor={AppTheme.hover} height="2px" width="50%" padding="2px" borderRadius="12px" />)}
                {activity.activity && (<SizedBox height={10} />)}
                {activity.activity && (<Text text={activity.activity} color={AppTheme.primary} size={13} />)}
                {showAssociated && (<SizedBox height={15} />)}
                {showAssociated && (
                    <Row>
                        <Container borderRadius="6px" backgroundColor={AppTheme.background} padding="5px" link={RouteConfig.getAccountRoute("admin", activity.associated)}>
                            <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" gap="10px">
                                <Text text={`Associated Account: ${activity.tag || activity.associated}`} size={12} color={AppTheme.hint} />
                                <Icon icon="fluent:open-20-filled" width="1em" height="1em" style={{color: AppTheme.hint}} />
                            </Row>
                        </Container>
                    </Row>
                )}
            </Container>
        </Row>
    )
})

export default AdminActivityView