import {
    useDesign, Container, Column, Spacer, ExtraButton,
    Row, SizedBox, StyledMenu, Text, Padding
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import preferenceStore from "../../backend/database/device/PreferenceStore";
import AppTheme from "../../configuration/Theme";
import { NavigationInterface } from "./MainLayout";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { NavigationLinkInterface, NavigationLinkOptionInterface, NavigationLinks, NavigationSubLinkInterface } from "./NavigationLink";
import { CURRENT_VERSION } from "../../generator/getVersion";

const LeftNavigation: React.FC<NavigationInterface> = observer(({ current }) => {
    const { isMobile } = useDesign();
    const isNavWide = preferenceStore.read.isWide

    const width = (): string => {
        if (isMobile) {
            return isNavWide ? "500px" : "70px"
        } else {
            return isNavWide ? "310px" : "60px"
        }
    }

    return (
        <Container
            width={width()}
            backgroundColor={AppTheme.appbar}
            height="100%"
            elevation={3}
            padding={isNavWide ? "0 0 12px 0" : "12px"}
            style={{ transition: "all 0.5s", display: "flex", flexDirection: "column", zIndex: "100" }}
        >
            <Column mainAxisSize="max" crossAxisSize="max" crossAxis="center">
                {NavigationLinks.map((link, index) => {
                    return (
                        <React.Fragment key={index}>
                            <MoreView current={current} isNavWide={isNavWide} navLink={link} />
                            {NavigationLinks.length - 1 !== index && (<SizedBox height={10} />)}
                        </React.Fragment>
                    )
                })}
                <Spacer />
                <Text text={CURRENT_VERSION} color={AppTheme.hint} size={12} />
                <SizedBox height={6} />
                <Row mainAxisSize="max" crossAxisSize="min" mainAxis="flex-end" style={{paddingRight: isNavWide ? "10px" : ""}}>
                    <ExtraButton
                        icon={"pepicons-print:arrow-right"}
                        title=""
                        padding="4px"
                        iconSize={1.2}
                        color={AppTheme.hint}
                        tip={isNavWide ? "Minimize" : "Maximize"}
                        onClick={_ => preferenceStore.toggleSidebar()}
                        rootStyle={{ width: "auto", minWidth: "auto" }}
                        hoverColor={AppTheme.hover}
                        iconStyle={{
                            margin: "0",
                            transform: isNavWide ? 'rotate(-180deg)' : 'rotate(0deg)',
                            transition: "all 0.5s"
                        }}
                    />
                </Row>
            </Column>
        </Container>
    )
})

interface ViewInterface extends NavigationInterface {
    isNavWide: boolean;
    navLink: NavigationLinkInterface;
}

const MoreView: React.FC<ViewInterface> = observer(({ current, isNavWide, navLink }) => {
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
    const isCurrent = current?.path === navLink.link || (
        current?.path.startsWith(navLink.link)
        && navLink.link !== '/' && current.path !== '/'
        && navLink.link !== '' && current.path !== ''
    );

    const close = () => {
        setAnchor(null);
    };

    const options: NavigationLinkOptionInterface[] | undefined = navLink.options
        ? [
            ...(!isNavWide
                ? [
                    {
                        links: [
                            {
                                title: navLink.header,
                                icon: navLink.icon,
                                active: navLink.activeIcon,
                                link: navLink.link,
                            },
                        ],
                    },
                ]
                : []),
            ...navLink.options,
        ]
        : undefined;

    return (
        <React.Fragment>
            <Container
                backgroundColor={isCurrent ? AppTheme.primary : "transparent"}
                hoverBackgroundColor={isCurrent ? AppTheme.primary : AppTheme.hover}
                renderAsButton={!(isNavWide && options)}
                onClick={event => {
                    if (isNavWide && options) {
                        return
                    } else if (!isNavWide && options) {
                        setAnchor(event.currentTarget as HTMLButtonElement)
                    }
                }}
                width={isNavWide ? "100%" : "auto"}
                borderRadius={isNavWide ? "0" : "8px"}
                padding={isNavWide ? "8px 12px" : "4px"}
            >
                <Row mainAxisSize="max" crossAxisSize="min" mainAxis="flex-start">
                    <Container width="100%" link={(isNavWide || (!isNavWide && !options)) ? navLink.link : undefined} style={{cursor: "pointer"}}>
                        <Row mainAxisSize="max" crossAxisSize="min" mainAxis="flex-start">
                            <Icon
                                icon={isCurrent ? navLink.activeIcon : navLink.icon}
                                color={isCurrent ? AppTheme.secondary : AppTheme.hint}
                                width="1.3em"
                                style={{margin: isNavWide ? "0 6px 0 0" : "0"}}
                            />
                            {isNavWide && (<SizedBox width={10} />)}
                            {isNavWide && (
                                <Text text={navLink.header} color={isCurrent ? AppTheme.secondary : AppTheme.hint} />
                            )}
                            {(isNavWide && options) && (<Spacer />)}
                        </Row>
                    </Container>
                    {(isNavWide && options) && (
                        <ExtraButton
                            icon="ep:arrow-right"
                            open={Boolean(anchor)}
                            title=""
                            iconSize={1}
                            fontSize="14px"
                            borderRadius="50%"
                            color={AppTheme.hint}
                            onClick={event => setAnchor(event.currentTarget)}
                            rootStyle={{ width: "auto", minWidth: "auto" }}
                            padding="4px"
                            hoverColor={AppTheme.hover}
                            iconStyle={{
                                margin: "0",
                                transform: anchor ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: "all 0.5s"
                            }}
                        />
                    )}
                </Row>
            </Container>
            {options && (
                <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={close} backgroundColor={AppTheme.appbar}>
                    {options.map((option, index) => {
                        return (
                            <Container
                                key={index}
                                padding="10px 0"
                                width={250}
                                style={{ borderBottom: options.length - 1 !== index ? `1px solid ${AppTheme.hint}` : "" }}
                                backgroundColor="transparent"
                            >
                                <Column crossAxis="flex-start" crossAxisSize="max">
                                    {option.title && (
                                        <Padding only={{left: 10}}>
                                            <Text text={option.title} size={12} color={AppTheme.hint} />
                                        </Padding>
                                    )}
                                    {option.title && (<SizedBox height={10} />)}
                                    {option.links.map((link, index) => {
                                        return (<MoreChildView current={current} child={link} key={index} handleClose={close} />)
                                    })}
                                </Column>
                            </Container>
                        )
                    })}
                </StyledMenu>
            )}
        </React.Fragment>
    )
})

interface MoreChildViewProps extends NavigationInterface {
    child: NavigationSubLinkInterface;
    handleClose: () => void;
}

const MoreChildView: React.FC<MoreChildViewProps> = observer(({ child, current, handleClose }) => {
    const isCurrent = current?.path === child.link || (
        current?.path.startsWith(child.link)
        && child.link !== '/' && current.path !== '/'
        && child.link !== '' && current.path !== ''
    );

    return (
        <Container
            padding="10px"
            width="100%"
            backgroundColor={isCurrent ? AppTheme.primary : "transparent"}
            onClick={handleClose}
            link={child.link}
            hoverBackgroundColor={isCurrent ? AppTheme.primary : AppTheme.hover}
        >
            <Row crossAxis="center" crossAxisSize="max">
                <Icon
                    icon={isCurrent ? child.active : child.icon}
                    width={20}
                    height={20}
                    color={isCurrent ? AppTheme.secondary : AppTheme.primary}
                />
                <SizedBox width={10} />
                <Column>
                    <Text
                        text={child.title}
                        size={12}
                        opacity={4}
                        color={isCurrent ? AppTheme.secondary : AppTheme.primary}
                    />
                    {child.description && (
                        <Text
                            text={child.description}
                            size={11}
                            color={isCurrent ? AppTheme.secondary : AppTheme.hint}
                        />
                    )}
                </Column>
            </Row>
        </Container>
    )
})

export default LeftNavigation;