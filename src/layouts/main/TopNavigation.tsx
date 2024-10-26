import {
    BackdropLoader, Column, Container, Expanded, ExtraButton, Field, Image,
    Navigate, Notify, Popper, Row, SizedBox, Spacer, StyledMenu, Text, Utility
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Assets from "../../assets/Assets";
import preferenceStore from "../../backend/database/device/PreferenceStore";
import AppTheme from "../../configuration/Theme";
import { ThemeType } from "../../utils/Enums";
import { NavigationInterface } from "./MainLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Routing from "../../configuration/Routing";
import Connect from "../../backend/api/Connect";
import authStore from "../../backend/database/auth/AuthStore";
import AuthRouting from "../../configuration/AuthRouting";
import Utils from "../../utils/Utils";

const TopNavigation: React.FC<NavigationInterface> = observer(({ current }) => {
    return (
        <Container width="100%" backgroundColor={AppTheme.appbar} elevation={4} padding="12px" style={{zIndex: "100"}}>
            <Row mainAxisSize="max" crossAxisSize="max" mainAxis="flex-start" crossAxis="center">
                <Image
                    image={Assets.serch.logoWhite}
                    width={60}
                    style={{
                        backgroundColor: "#050404",
                        padding: "8px",
                        borderRadius: "8px"
                    }}
                />
                <Spacer />
                <SearchView />
                <Spacer />
                <TopLeftView current={current} />
            </Row>
        </Container>
    )
})

const SearchView: React.FC = observer(() => {
    const width = 400;
    const height= 38;
    const borderRadius = 24;
    const padding = '12px 16px 12px 10px';
    const background = AppTheme.background;
    const placeHolder = "Search for keywords, names, actions, events"

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);
    const isSearchOpen = Boolean(anchor);

    const handleClose = () => {
        setAnchor(undefined);
    };

    const handleSearch = (query: string) => {
        console.log(query)
    }

    return (
        <React.Fragment>
            <Container
                width={width}
                height={height}
                borderRadius={`${borderRadius}px`}
                backgroundColor={background}
                padding={padding}
                renderAsButton
                onClick={e => setAnchor(e.currentTarget as HTMLButtonElement)}
            >
                <Row mainAxis="flex-start" crossAxis="center" crossAxisSize="max">
                    <Icon
                        icon="lets-icons:chat-search-duotone"
                        width='1.2em'
                        style={{marginRight: "5px" }}
                        color={AppTheme.primary}
                    />
                    <Text text={placeHolder} size={14} color={AppTheme.hint} />
                </Row>
            </Container>
            <Popper
                isOpen={isSearchOpen}
                anchor={anchor}
                handleClose={handleClose}
                style={{
                    width: `${width + 20}px`,
                    backgroundColor: AppTheme.appbar,
                    padding: "12px",
                    top: "2px !important",
                    position: "relative"
                }}
                top="10px"
            >
                <Column mainAxisSize="max" crossAxisSize="min">
                    <Container borderRadius={`${borderRadius}px`} elevation={4}>
                        <Row crossAxis="center" crossAxisSize="min">
                            <Expanded>
                                <Field
                                    height={height}
                                    fontSize={14}
                                    color={AppTheme.primary}
                                    padding="0 12px"
                                    needLabel={false}
                                    isRequired={false}
                                    needSpacer={false}
                                    borderColor={AppTheme.primary}
                                    onChange={e => handleSearch(e)}
                                    placeHolder={placeHolder}
                                    backgroundColor={background}
                                />
                            </Expanded>
                        </Row>
                    </Container>
                    <SizedBox height={20} />
                </Column>
            </Popper>
        </React.Fragment>
    )
})

const TopLeftView: React.FC<NavigationInterface> = observer(({ current }) => {
    /// PROFILE
    const [profileColor, setProfileColor] = React.useState<string | undefined>(preferenceStore.read.color)

    React.useEffect(() => {
        if(!profileColor) {
            const color = Utility.getRandomColor();
            setProfileColor(color)
            preferenceStore.set(preferenceStore.read.copyWith({color: color}))
        }
    }, [profileColor])

    const renderAvatar = (): JSX.Element => {
        if(authStore.read.avatar) {
            return (
                <Image
                    image={authStore.read.avatar}
                    height={32}
                    style={{
                        borderRadius: "50%",
                        backgroundColor: AppTheme.appbarDark,
                        padding: "1px"
                    }}
                />
            )
        } else if(authStore.read.short) {
            return (
                <Container borderRadius="50%" padding="8px 7px" backgroundColor={profileColor ?? "#050404"} border={`1px solid ${AppTheme.hint}`}>
                    <Text text={authStore.read.short} size={14} color={Utility.lightenColor(profileColor ?? "#050404", 90)} />
                </Container>
            )
        } else {
            return (
                <Image
                    image={Assets.auth.administrator}
                    height={32}
                    style={{
                        borderRadius: "50%",
                        backgroundColor: AppTheme.appbarDark,
                        padding: "1px"
                    }}
                />
            )
        }
    }

    return (
        <React.Fragment>
            <ThemeView />
            <SizedBox width={10} />
            <NotificationView />
            <SizedBox width={10} />
            <ProfileView current={current} />
            <SizedBox width={15} />
            <Row mainAxisSize="min" crossAxisSize="min" crossAxis="center">
                {renderAvatar()}
                <SizedBox width={10} />
                <Column>
                    <Text text={authStore.read.name} size={14} color={AppTheme.primary} />
                    <Text text={Utils.clearRole(authStore.read.role)} size={11} color={AppTheme.hint} />
                </Column>
            </Row>
        </React.Fragment>
    )
})

const ThemeView: React.FC = observer(() => {
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);

    const close = () => {
        setAnchor(null);
    };

    const options = [
        {
            title: "Light Theme",
            description: "Brighten the colors on the admin portal.",
            theme: ThemeType.LIGHT,
            image: Assets.theme.light
        },
        {
            title: "Dark Theme",
            description: "Dim the colors on the admin portal",
            theme: ThemeType.DARK,
            image: Assets.theme.dark
        }
    ]

    return (
        <React.Fragment>
            <Container border={`1px solid ${AppTheme.hint}`} borderRadius="50%" padding="1px">
                <ExtraButton
                    icon="material-symbols-light:dark-mode-outline"
                    open={Boolean(anchor)}
                    title=""
                    padding="4px"
                    iconSize={1}
                    color={AppTheme.primary}
                    onClick={event => setAnchor(event.currentTarget)}
                    rootStyle={{width: "auto", minWidth: "auto"}}
                    hoverColor={AppTheme.hover}
                    iconStyle={{margin: "0"}}
                />
            </Container>
            <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={close} backgroundColor={AppTheme.appbar}>
                {options.map((option, index) => {
                    const isSelected = preferenceStore.read.theme === option.theme;

                    return (
                        <Container
                            key={index}
                            padding="10px"
                            onClick={() => {
                                preferenceStore.changeTheme();
                                close()
                            }}
                            hoverBackgroundColor={isSelected ? "" : AppTheme.hover}
                            backgroundColor={isSelected ? AppTheme.primary : "transparent"}
                        >
                            <Row crossAxis="center">
                                <Image image={option.image} width={35} height={35} />
                                <SizedBox width={10} />
                                <Column>
                                    <Text text={option.title} size={14} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                                    <SizedBox height={5} />
                                    <Text text={option.description} size={12} color={AppTheme.hint} />
                                </Column>
                            </Row>
                        </Container>
                    )
                })}
            </StyledMenu>
        </React.Fragment>
    )
})

const NotificationView: React.FC = observer(() => {
    /// NOTIFICATION
    const [unreadCount] = React.useState(0)
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);

    return (
        <React.Fragment>
            <Container border={`1px solid ${AppTheme.hint}`} borderRadius="50%" padding="1px">
                <ExtraButton
                    icon={unreadCount > 0 ? "solar:notification-unread-lines-bold-duotone" : `solar:bell-bold-duotone`}
                    open={Boolean(anchor)}
                    title=""
                    padding="4px"
                    iconSize={1}
                    color={AppTheme.primary}
                    onClick={event => setAnchor(event.currentTarget)}
                    rootStyle={{width: "auto", minWidth: "auto"}}
                    hoverColor={AppTheme.hover}
                    iconStyle={{margin: "0"}}
                />
            </Container>
        </React.Fragment>
    )
})

const ProfileView: React.FC<NavigationInterface> = observer(({ current }) => {
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);

    const close = () => {
        setAnchor(null);
    };

    const options = [
        {
            title: "Account Settings",
            description: "View and update your details.",
            icon: "solar:user-circle-bold-duotone",
            link: Routing.instance.profile.path,
        },
        {
            title: "Security and Privacy",
            description: "Protect your account securely.",
            icon: "solar:shield-user-bold-duotone",
            link: Routing.instance.securityAndPrivacy.path
        },
        {
            title: "Granted Permissions",
            description: "See your portal capabilities.",
            icon: "solar:server-square-update-bold-duotone",
            link: Routing.instance.grantedPermission.path
        },
        {
            title: "Requested Permissions",
            description: "Track your permission requests.",
            icon: "ph:read-cv-logo-duotone",
            link: Routing.instance.requestedPermission.path
        },
        {
            title: "Sign out",
            description: "Log out from your account.",
            icon: "lets-icons:sign-out-circle-duotone",
        }
    ]

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const connect = new Connect({});

    async function choose(index: number) {
        const isLast = options.length - 1 === index;

        close()
        if(isLast) {
            setOpenBackdrop(true);
            const response = await connect.get("/auth/logout");
            setOpenBackdrop(false);
            if (response) {
                if (response.isSuccess) {
                    authStore.logout();
                    Navigate.all(AuthRouting.instance.login.path);
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    return (
        <React.Fragment>
            <Container border={`1px solid ${AppTheme.hint}`} borderRadius="50%" padding="1px">
                <ExtraButton
                    icon="solar:settings-minimalistic-bold-duotone"
                    open={Boolean(anchor)}
                    title=""
                    padding="4px"
                    iconSize={1}
                    color={AppTheme.primary}
                    onClick={event => setAnchor(event.currentTarget)}
                    rootStyle={{width: "auto", minWidth: "auto"}}
                    hoverColor={AppTheme.hover}
                    iconStyle={{margin: "0"}}
                />
            </Container>
            <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={close} backgroundColor={AppTheme.appbar}>
                {options.map((option, index) => {
                    const isLast = options.length - 1 === index;
                    const isCurrent = option.link && current?.path === option.link;

                    return (
                        <Container
                            key={index}
                            padding="10px"
                            width={250}
                            backgroundColor={isCurrent ? AppTheme.primary : "transparent"}
                            onClick={() => choose(index)}
                            link={option.link}
                            hoverBackgroundColor={
                                isLast ? Utility.lightenColor(AppTheme.error, 70) : isCurrent ? AppTheme.primary : AppTheme.hover
                            }
                        >
                            <Row crossAxis="center" crossAxisSize="max">
                                <Icon
                                    icon={option.icon}
                                    width={35}
                                    height={35}
                                    color={isLast ? AppTheme.error : isCurrent ? AppTheme.secondary : AppTheme.primary}
                                />
                                <SizedBox width={10} />
                                <Column>
                                    <Text
                                        text={option.title}
                                        size={14}
                                        color={isLast ? AppTheme.error : isCurrent ? AppTheme.secondary : AppTheme.primary}
                                    />
                                    <Text
                                        text={option.description}
                                        size={12}
                                        color={
                                            isLast
                                                ? Utility.lightenColor(AppTheme.error, 20)
                                                : isCurrent
                                                ? AppTheme.secondary : AppTheme.hint
                                        }
                                    />
                                </Column>
                            </Row>
                        </Container>
                    )
                })}
            </StyledMenu>
            <BackdropLoader open={openBackdrop} />
        </React.Fragment>
    )
})

export default TopNavigation;