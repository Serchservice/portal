import { useParams } from "react-router-dom";
import { RouteConfig, RouteInterface, RouteParams } from "../../../configuration/Route";
import UnauthorizedView from "../../../widgets/UnauthorizedView";
import React from "react";
import {
    ActionButton, Alert, BackdropLoader, Column, Container, ExtraButton, Image, Navigate, Notify, Row, SizedBox,
    Spacer, StyledMenu, StyledMenuItem, Text, Utility, WebUiKitException, Wrap
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import Title from "../../../widgets/Title";
import { useQuery } from "@tanstack/react-query";
import Connect from "../../../backend/api/Connect";
import Keys from "../../../backend/api/Keys";
import AdminScopeResponse from "../../../backend/models/team/AdminScopeResponse";
import AppTheme from "../../../configuration/Theme";
import CompanyStructureModal from "../modals/CompanyStructureModal";
import AdminAccountAnalyticsView from "./widgets/AdminAccountAnalyticsView";
import AdminActivityView from "./widgets/AdminActivityView";
import AdminAuthenticationView from "./widgets/AdminAuthenticationView";
import AdminChallengeView from "./widgets/AdminChallengeView";
import AdminProfileView from "./widgets/AdminProfileView";
import AdminSessionView from "./widgets/AdminSessionView";
import AdminTeamView from "./widgets/AdminTeamView";
import Utils from "../../../utils/Utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import AdminPermissionView from "./widgets/AdminPermissionView";
import { AdminLoadingBodyView, AdminLoadingHeaderView } from "./loader";

export const AdminRoute: RouteInterface = {
    path: "/team/:slug",
    page: <AdminPage />,
    pathView: ({slug}) => `/team/${slug}`
}

export default function AdminPage() {
    const { slug } = useParams<RouteParams>()

    if(slug) {
        return (<View slug={slug} />)
    } else {
        return (
            <React.Fragment>
                <Title title="Admin ~ Not Found" />
                <UnauthorizedView
                    message="Couldn't find the resource you're looking for. Check the link and try again"
                    title="Resource not found"
                    type="not-found"
                />
            </React.Fragment>
        )
    }
}

interface ViewProps {
    slug: string;
}

const View: React.FC<ViewProps> = observer(({slug}) => {
    const connect = new Connect({})

    const { data, isLoading } = useQuery({
        queryKey: [Keys.ADMIN_PAGE(slug)],
        queryFn: () => connect.get(`/scope/admin?id=${slug}`)
    })

    const [admin, setAdmin] = React.useState<AdminScopeResponse>()

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                setAdmin(AdminScopeResponse.fromJson(data.data));
            } else {
                Notify.error(data.message);
            }
        }
    }, [data])

    const _buildTitle = (): JSX.Element => {
        if(isLoading) {
            return (<Title title="Loading admin profile" />)
        } else if(!data || !admin) {
            return (<Title title="Admin ~ Not Found" />)
        } else {
            return (<Title title={`${admin.profile.name}'s Profile`} />)
        }
    }

    return (
        <React.Fragment>
            {_buildTitle()}
            <AdminView admin={admin} onAdminUpdated={setAdmin} />
        </React.Fragment>
    )
})

interface AdminViewProps {
    onAdminUpdated: (admin: AdminScopeResponse) => void;
}

interface AdminViewInterface extends AdminViewProps {
    admin: AdminScopeResponse | undefined
}

export interface AdminInterface extends AdminViewProps {
    admin: AdminScopeResponse
}

const AdminView: React.FC<AdminViewInterface> = observer(({ admin, onAdminUpdated }) => {
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setScrollPosition(scrollContainerRef.current.scrollTop);
            }
        };

        const scrollContainer = scrollContainerRef.current;

        // Attach scroll event to the container
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        // Cleanup the event listener on unmount or admin change
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const tabs = ["Account Analysis", "Profile", "Authentication", "Sessions", "Challenges", "Activities", "Team", "Permissions"]
    const [tabValue, setTabValue] = React.useState(tabs[0]);
    const [isOpen, setIsOpen] = React.useState<boolean>(false)

    const _buildHeader = () => {
        if(!admin) {
            return (<AdminLoadingHeaderView scrollPosition={scrollPosition} />)
        } else {
            return (
                <React.Fragment>
                    <HeaderView admin={admin} scrollPosition={scrollPosition} onAdminUpdated={onAdminUpdated} />
                    <Row crossAxisSize="max" crossAxis="center">
                        <Row style={{ overflow: "scroll", width: "660px", backgroundColor: AppTheme.appbar, borderRadius: "16px", padding: "4px"}} mainAxisSize="min">
                            <Row crossAxisSize="max" crossAxis="center" style={{gap: "6px"}}>
                                {tabs.map((tab, index) => {
                                    const isSelected = tab === tabValue;
                                    return (
                                        <ActionButton
                                            key={index}
                                            padding="6px"
                                            borderRadius="16px"
                                            backgroundColor={isSelected ? "#050404" : AppTheme.appbar}
                                            fontSize={12}
                                            hoverBackgroundColor={isSelected ? "#050404" : undefined}
                                            hoverColor={isSelected ? "#ffffff" : undefined}
                                            color={isSelected ? "#ffffff" : AppTheme.hint}
                                            onClick={() => setTabValue(tab)}
                                            title={tab}
                                        />
                                    )
                                })}
                            </Row>
                        </Row>
                        <Spacer />
                        <Container
                            padding="8px 12px"
                            backgroundColor={AppTheme.appbar}
                            borderRadius="24px"
                            onClick={() => setIsOpen(true)}
                            hoverBackgroundColor={AppTheme.hover}
                        >
                            <Text text="See structure" color={AppTheme.hint} size={12} />
                        </Container>
                    </Row>
                </React.Fragment>
            )
        }
    }

    const _buildStructure = () => {
        if(admin) {
            return (
                <CompanyStructureModal
                    isOpen={isOpen}
                    handleClose={() => setIsOpen(false)}
                    structure={admin.structure}
                    show={false}
                    title={`Portal Structure for ${admin.profile.name}`}
                    id={admin.profile.id}
                />
            )
        } else {
            return (<></>)
        }
    }

    const _buildBody = () => {
        if(!admin) {
            return(<AdminLoadingBodyView />)
        } else {
            const pages: React.ReactNode[] = [
                <AdminAccountAnalyticsView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminProfileView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminAuthenticationView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminSessionView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminChallengeView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminActivityView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminTeamView admin={admin} onAdminUpdated={onAdminUpdated} />,
                <AdminPermissionView admin={admin} onAdminUpdated={onAdminUpdated} />,
            ]

            return (pages[tabs.indexOf(tabValue)])
        }
    }

    return (
        <React.Fragment>
            <Column mainAxisSize="max" crossAxisSize="max" mainAxis="flex-start" crossAxis="flex-start" style={{overflow: "visible", gap: "5px"}}>
                <Column crossAxisSize="max" mainAxis="flex-start" crossAxis="flex-start" style={{padding: "8px", gap: "5px"}}>
                    {_buildHeader()}
                    <SizedBox height={10} />
                </Column>
                <div ref={scrollContainerRef} style={{padding: "8px", overflow: "auto", display: 'flex', flexDirection: 'column', width: "100%"}}>
                    <Column>{_buildBody()}</Column>
                </div>
            </Column>
            {_buildStructure()}
        </React.Fragment>
    )
})

interface HeaderProps {
    scrollPosition: number;
    admin: AdminScopeResponse;
    onAdminUpdated: (admin: AdminScopeResponse) => void;
}

const HeaderView: React.FC<HeaderProps> = observer(({ admin, scrollPosition, onAdminUpdated }) => {
    const scroll = Math.min(scrollPosition / 100, 10);
    const scrollRange = 3;

    const shouldResize = scrollRange === scroll || scroll == 2;
    const calc = (max: number, min: number) => Math.max(min, max - (scroll * (max - min)) / scrollRange);

    const renderImage = (): JSX.Element => {
        const size = calc(90, 55);

        if(admin.profile.avatar) {
            return (
                <Image image={admin.profile.avatar} height={size} style={{
                    borderRadius: "50%",
                    backgroundColor: AppTheme.appbarDark,
                    padding: "1px",
                    transition: "all 0.4s"
                }}/>
            )
        } else {
            return (
                <Container borderRadius="50%" height={size} width={size} padding="8px 7px" backgroundColor="#050404" style={{transition: "all 0.4s"}}>
                    <Column mainAxis="center" mainAxisSize="max">
                        <Text
                            align="center"
                            text={admin.profile.short}
                            size={calc(24, 12)}
                            color={Utility.lightenColor(Utility.getRandomColor(), 90)}
                            flow="ellipsis"
                        />
                    </Column>
                </Container>
            )
        }
    }

    const renderId = (): JSX.Element => {
        const data = shouldResize ? admin.profile.id : admin.profile.empId
        return (
            <Container backgroundColor={AppTheme.background} padding="4px 4px 2px" borderRadius="6px" onClick={() => Utility.copy(data)}>
                <Text
                    text={`${shouldResize ? "Account ID" : "Pass"}: ${data} (Tap to copy)`}
                    color={AppTheme.primary}
                    size={calc(12, 10)}
                />
            </Container>
        )
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = React.useState(false)

    const handleChangeAvatar = () => {
        if (isUpdatingAvatar || !fileInputRef.current) {
            return;
        }
        fileInputRef.current.click();
    };

    const connect = new Connect({})

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return;

        await Utility.getUpload(file).then(async (upload) => {
            if(upload) {
                setIsUpdatingAvatar(true);
                const response = await connect.patch<string>(`/scope/admin/profile/avatar?id=${admin.profile.id}`, upload.toJson());
                setIsUpdatingAvatar(false);
                if (response) {
                    if (response.isSuccess) {
                        if (response.data) {
                            onAdminUpdated(admin.copyWith({profile: admin.profile.copyWith({ avatar: response.data })}))
                        }
                        Notify.success(response.message);
                    } else {
                        Notify.error(response.message);
                    }
                }
            }
        }).catch((err) => Notify.error((err as WebUiKitException).message));
    };

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    return (
        <React.Fragment>
            <Container
                backgroundColor={AppTheme.appbar}
                style={{ transition: "all 0.4s" }}
                padding={`${calc(16, 8)}px`}
                width="100%"
                borderRadius={`${calc(12, 4)}px`}
            >
                <Row mainAxisSize="max" crossAxis="center" style={{gap: "10px"}}>
                    <Container border={`2px dotted ${AppTheme.hint}`} padding="1px" borderRadius="50%" onClick={() => handleChangeAvatar()}>
                        {renderImage()}
                    </Container>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    <Column mainAxisSize="max" crossAxis="flex-start">
                        <Row crossAxis="center" mainAxisSize="max" mainAxis="space-between">
                            <Text text={admin.profile.name} color={AppTheme.primary} size={calc(16, 14)} />
                            <Spacer />
                            <Container backgroundColor={Utils.getAccountStatusIconInfo(admin.profile.status).color} padding="4px 4px 2px" borderRadius="4px">
                                <Text text={admin.profile.status} size={10} color="#fff" />
                            </Container>
                        </Row>
                        <SizedBox height={4} />
                        <Row crossAxis="center" mainAxisSize="max" mainAxis="space-between">
                            {!shouldResize && (<Text text={admin.profile.emailAddress} color={AppTheme.hint} size={calc(14, 11)} />)}
                            {shouldResize && (renderId())}
                            <Spacer />
                            {shouldResize && (
                                <Container border={`1px solid ${AppTheme.hint}`} borderRadius="50%" padding="1px">
                                    <ExtraButton
                                        icon="ci:more-grid-big"
                                        open={Boolean(anchor)}
                                        title=""
                                        padding="4px"
                                        iconSize={0.6}
                                        color={AppTheme.primary}
                                        onClick={event => setAnchor(event.currentTarget)}
                                        rootStyle={{width: "auto", minWidth: "auto"}}
                                        hoverColor={AppTheme.hover}
                                        iconStyle={{margin: "0"}}
                                    />
                                </Container>
                            )}
                            {!shouldResize && (renderId())}
                        </Row>
                        {!shouldResize && (<Text text="Tap avatar to update it" color={AppTheme.hint} size={calc(11, 11)} />)}
                    </Column>
                </Row>
                {(!shouldResize) && (<SizedBox height={10} />)}
                {(!shouldResize) && (<ActionView admin={admin} onAdminUpdated={onAdminUpdated} scrollPosition={scrollPosition} />)}
                <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                    <ActionView shouldWrap={false} borderRadius="0" admin={admin} onAdminUpdated={onAdminUpdated} scrollPosition={scrollPosition} />
                </StyledMenu>
            </Container>
            <BackdropLoader open={isUpdatingAvatar} color={AppTheme.primary} />
        </React.Fragment>
    )
})

interface ActionViewProps extends HeaderProps {
    borderRadius?: string;
    shouldWrap?: boolean;
}

const ActionView: React.FC<ActionViewProps> = observer(({ admin, onAdminUpdated, borderRadius, shouldWrap = true }) => {
    const connect = new Connect({})

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);
    const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false)
    const [isDeletingAccount, setIsDeletingAccount] = React.useState(false)
    const [isSendingInvite, setIsSendingInvite] = React.useState(false)
    const [isResettingPassword, setIsResettingPassword] = React.useState(false)
    const [isDeleteAccount, setIsDeleteAccount] = React.useState(false)
    const [isResetPassword, setIsResetPassword] = React.useState(false)

    const creatorLink = admin?.structure.findParentByChildId(admin.profile.id)

    const handleCloseMenu = () => {
        setAnchor(undefined);
    };

    const handleChangeStatus = async (status: string) => {
        handleCloseMenu()
        if (isUpdatingStatus) {
            return
        } else {
            setIsUpdatingStatus(true);
            const response = await connect.patch<string>(`/scope/admin/account/status`, {
                id: admin.profile.id,
                status: status,
            });
            setIsUpdatingStatus(false);
            if (response) {
                if (response.isSuccess) {
                    if (response.data) {
                        onAdminUpdated(admin.copyWith({ profile: admin.profile.copyWith({ status: status }) }))
                    }
                    Notify.success(response.message);
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    const handleSendInvite = async () => {
        if (isSendingInvite) {
            return
        } else {
            setIsSendingInvite(true);
            const response = await connect.get<string>(`/auth/admin/invite/resend?id=${admin.profile.id}`);
            setIsSendingInvite(false);
            if (response) {
                if (response.isSuccess) {
                    Notify.success(response.message);
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    const handleDeleteAccount = async () => {
        if (isDeletingAccount) {
            return
        } else {
            setIsDeletingAccount(true);
            const response = await connect.delete<string>(`/scope/admin?id=${admin.profile.id}`);
            setIsDeletingAccount(false);
            if (response) {
                if (response.isSuccess) {
                    Notify.success(response.message);
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    const handleResetPassword = async () => {
        setIsResettingPassword(true)
        const response = await connect.get<string>(`/auth/admin/password/reset?id=${admin.profile.id}`);
        setIsResettingPassword(false);
        if (response) {
            if (response.isSuccess) {
                Notify.success(response.message);
            } else {
                Notify.error(response.message);
            }
        }
    }

    const buttons = [
        admin.profile.isActive && {
            title: "Reset password",
            value: "password",
            icon: "lets-icons:view-alt-duotone",
            color: AppTheme.primary,
            state: false,
            onClick: () => setIsResetPassword(true)
        },
        {
            title: "Change status",
            value: "account",
            icon: "lets-icons:status",
            color: admin.profile.status === "ACTIVE" ? AppTheme.success : AppTheme.error,
            state: isUpdatingStatus,
            list: Utils.accountStatuses(),
            onClick: (status: string) => handleChangeStatus(status)
        },
        {
            title: "Delete account",
            value: "delete",
            icon: "lets-icons:trash-duotone",
            color: AppTheme.error,
            state: false,
            onClick: () => setIsDeleteAccount(true)
        },
        admin.profile.shouldResendInvite && {
            title: "Resend invite",
            value: "resend",
            icon: "lets-icons:send-hor-duotone",
            color: AppTheme.pending,
            state: isSendingInvite,
            onClick: handleSendInvite
        },
        creatorLink && {
            title: "View creator",
            value: "view_create",
            icon: "lets-icons:send-hor-duotone",
            color: AppTheme.primary,
            onClick: () => Navigate.openInNewTab(RouteConfig.getRoute(AdminRoute, {slug: creatorLink.id}))
        },
    ];

    const renderChildren = (): React.ReactNode => {
        return (buttons.map((button, index) => {
            if(button) {
                const isButton = button.value === "account" && button.list && button.list.length > 0

                return (
                    <React.Fragment key={index}>
                        <Container
                            padding="8px"
                            backgroundColor={button.color === AppTheme.primary ? AppTheme.background : Utility.lightenColor(button.color, 70)}
                            borderRadius={borderRadius ?? "24px"}
                            onClick={e => {
                                if(isButton) {
                                    setAnchor(e.currentTarget as HTMLButtonElement)
                                } else if(button.onClick) {
                                    button.onClick("")
                                }
                            }}
                            renderAsButton={isButton}
                            hoverBackgroundColor={AppTheme.hover}
                        >
                            <Row crossAxis="center" crossAxisSize="min">
                                <Icon icon={button.icon} width={0.6} height={0.6} color={button.color} />
                                <Text text={button.title} color={button.color} size={12} />
                            </Row>
                        </Container>
                        {button.list && (
                            <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} backgroundColor={AppTheme.appbar} onClose={handleCloseMenu}>
                                {button.list.map((status, key) => {
                                    return (
                                        <StyledMenuItem
                                            text={status.key}
                                            color={status.value === admin.profile.status ? button.color : AppTheme.primary}
                                            backgroundColor={status.value === admin.profile.status ? Utility.lightenColor(button.color, 70) : AppTheme.appbar}
                                            key={key}
                                            onClick={() => button.onClick(status.value)}
                                        />
                                    )
                                })}
                            </StyledMenu>
                        )}
                    </React.Fragment>
                )
            } else {
                return <React.Fragment key={index}></React.Fragment>
            }
        }))
    }

    const render = () => {
        if(shouldWrap) {
            return (<Wrap spacing={10} runSpacing={10}>{renderChildren()}</Wrap>)
        } else {
            return (<Column>{renderChildren()}</Column>)
        }
    }

    return (
        <React.Fragment>
            {render()}
            <Alert
                isOpen={isDeleteAccount}
                handleClose={() => setIsDeleteAccount(false)}
                title="Are you sure you want to delete this account?"
                description="This is a non-reversible action as every data linked to this account will be removed"
                agreeText="Ok"
                onAgree={handleDeleteAccount}
                isAgreeing={isDeletingAccount}
                primaryColor={AppTheme.primary}
                backgroundColor={AppTheme.background}
                disagreeText="Cancel"
            />
            <Alert
                isOpen={isResetPassword}
                handleClose={() => setIsResetPassword(false)}
                title={`Are you sure you want to reset the password for ${admin.profile.firstName} ?`}
                description={`A reset password link will be sent to ${admin.profile.firstName}'s mail box ${admin.profile.emailAddress}`}
                agreeText="Yes, continue"
                onAgree={handleResetPassword}
                isAgreeing={isResettingPassword}
                primaryColor={AppTheme.primary}
                backgroundColor={AppTheme.background}
                disagreeText="Cancel"
            />
            <BackdropLoader open={isUpdatingStatus || isSendingInvite} color={AppTheme.primary} />
        </React.Fragment>
    )
})