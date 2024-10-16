import React from "react";
import { AdminInterface } from "../page";
import { observer } from "mobx-react-lite";
import {
    ActionButton, Column, Container, Padding, Pager, Row, SearchBar,
    SimpleStep, SizedBox, Spacer, StyledMenu, Text, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { Icon } from "@iconify/react/dist/iconify.js";
import AppTheme from "../../../../configuration/Theme";
import Filters, { IFilter, IFilterOption } from "../../../../utils/Filters";
import AccountMFAChallengeResponse from "../../../../backend/models/account/AccountMFAChallengeResponse";
import AccountMFAResponse from "../../../../backend/models/account/AccountMFAResponse";
import TimeUtils from "../../../../utils/TimeUtils";
import AdminChallengeDetails from "../modals/AdminChallengeDetails";

const AdminChallengeView: React.FC<AdminInterface> = observer(({ admin }) => {
    const [list, setList] = React.useState<AccountMFAChallengeResponse[]>(admin.challenges)
    const [filtered, setFiltered] = React.useState<AccountMFAChallengeResponse[]>(admin.challenges);
    const [filter, setFilter] = React.useState<string>()
    const [openFilter, setOpenFilter] = React.useState<IFilter>()

    const handleSearch = React.useCallback((results: AccountMFAChallengeResponse[]) => {
        setList(results);
    }, []);

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const handleFilter = (option: IFilterOption, filter: string) => {
        setFilter(`${filter} - ${option.title}`)
        setAnchor(undefined)

        let result = admin.challenges;

        switch(filter) {
            case Filters.byVerifiedAt.header:
                result = admin.challenges.filter((challenge) => Filters.filteredByDate(challenge.verifiedAt, option.value));
                break;
            case Filters.byCreatedAt.header:
                result = admin.challenges.filter((challenge) => Filters.filteredByDate(challenge.createdAt, option.value));
                break;
            case Filters.byUpdatedAt.header:
                result = admin.challenges.filter((challenge) => Filters.filteredByDate(challenge.updatedAt, option.value));
                break;
            default:
                break;
        }

        setList(result)
    }

    const removeFilter = () => {
        setFilter(undefined)
        setOpenFilter(undefined)
        setList(admin.challenges)
    }

    const buildResult = () => {
        if(filtered.length > 0) {
            return (
                <Wrap spacing={20} runSpacing={20}>
                    {filtered.map((challenge, index) => <Challenge key={index} challenge={challenge} />)}
                </Wrap>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`No challenges for ${admin.profile.name}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    const buttons = [Filters.byVerifiedAt, Filters.byCreatedAt, Filters.byUpdatedAt]

    return (
        <React.Fragment>
            <Row mainAxisSize="max" crossAxis="flex-start" style={{gap: "20px"}}>
                <Column style={{gap: "20px", width: "650px"}}>
                    <SearchBar
                        onSearch={handleSearch}
                        list={admin.challenges}
                        placeholder="Search dates, devices, tokens, platforms, ids..."
                        backgroundColor={AppTheme.appbar}
                        inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                        boxStyle={{borderRadius: "10px"}}
                        textColor={AppTheme.primary}
                        textFocusedColor={AppTheme.hint}
                        textUnfocusedColor={AppTheme.appbar}
                        parentStyle={{margin: "0", padding: "0"}}
                    />
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
                    <MFAFactorView factor={admin.mfa} name={admin.profile.name} />
                </Column>
                <Column mainAxisSize="max">
                    {buildResult()}
                    <Pager items={list} onSlice={setFiltered} itemsPerPage={10} />
                </Column>
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
        </React.Fragment>
    )
})

type MFAFactorViewProps = {
    factor: AccountMFAResponse;
    name: string;
}

const MFAFactorView: React.FC<MFAFactorViewProps> = observer(({ factor, name }) => {
    const buildView = () => {
        if(factor && factor.id) {
            const steps = [
                {
                    title: "Identifier",
                    value: factor.id
                },
                {
                    title: "Time of Creation",
                    value: factor.createdAt
                },
                {
                    title: "Last time of update",
                    value: factor.updatedAt
                }
            ]

            return (
                <React.Fragment>
                    <Text text="Multi-Factor Information" size={12} color={AppTheme.hint} />
                    <SizedBox height={12} />
                    {steps.map((step, index) => {
                        return (
                            <SimpleStep
                                key={index}
                                content={
                                    <Padding only={{top: 3}}>
                                        <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                            <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                            <Spacer />
                                            <Text
                                                text={index === 0 ? step.value : TimeUtils.day(step.value)}
                                                size={14}
                                                color={AppTheme.primary}
                                            />
                                        </Row>
                                    </Padding>
                                }
                                height={10}
                                color={AppTheme.hint}
                                showBottom={steps.length - 1 !== index}
                            />
                        )
                    })}
                </React.Fragment>
            )
        } else {
            return (
                <Container height="300px" width="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`${name} has not enabled multi-factor authentication`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <Container width="100%" backgroundColor={AppTheme.appbar} padding="12px" borderRadius="16px">{buildView()}</Container>
    )
})

interface ChallengeProps {
    challenge: AccountMFAChallengeResponse;
}

const Challenge: React.FC<ChallengeProps> = observer(({ challenge }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <React.Fragment>
            <Container backgroundColor={ isOpen ? AppTheme.hover : AppTheme.appbar} width="250px" borderRadius="10px" padding="12px">
                <Text text={TimeUtils.day(challenge.createdAt)} size={12} color={AppTheme.hint} flow="ellipsis" />
                <SizedBox height={4} />
                <Row crossAxis="flex-start" mainAxisSize="max">
                    <Column crossAxis="flex-start" crossAxisSize="max">
                        <Text text={challenge.name} size={14} color={AppTheme.primary} flow="ellipsis" />
                        <SizedBox height={4} />
                        <Text text={Utility.capitalizeFirstLetter(challenge.platform)} size={12} color={AppTheme.primary} flow="ellipsis" />
                    </Column>
                    <Spacer />
                    <Icon icon="lets-icons:key-duotone" height="2em" width="2em" color={AppTheme.primary} />
                </Row>
                <SizedBox height={8} />
                <Container backgroundColor={AppTheme.background} borderRadius="0px" padding="6px">
                    <Text text={challenge.id} size={11} color={AppTheme.primary} flow="ellipsis" wrap={false} autoSize={false} />
                </Container>
                <SizedBox height={10} />
                <Row crossAxis="center">
                    <Icon
                        icon={challenge.verifiedAt ? "solar:verified-check-bold-duotone" : "solar:verified-check-bold-duotone"}
                        height="1.2em"
                        width="1.2em"
                        color={ challenge.verifiedAt ? AppTheme.success : AppTheme.error}
                    />
                    <Spacer />
                    <Container padding="6px 6px 4px" backgroundColor={AppTheme.background} borderRadius="24px" onClick={() => setIsOpen(true)} hoverBackgroundColor={AppTheme.hover}>
                        <Text text="View more" color={AppTheme.hint} size={11} />
                    </Container>
                </Row>
            </Container>
            <AdminChallengeDetails challenge={challenge} isOpen={isOpen} handleClose={() => setIsOpen(false)} />
        </React.Fragment>
    )
})

export default AdminChallengeView