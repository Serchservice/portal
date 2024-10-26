import { Outlet, useLocation } from "react-router-dom";
import { RouteInterface } from "../../../configuration/Route"
import { Column, Container, Row, SizedBox, Text } from "@serchservice/web-ui-kit";
import React from "react";
import authStore from "../../../backend/database/auth/AuthStore";
import Title from "../../../widgets/Title";
import AppTheme from "../../../configuration/Theme";
import { observer } from "mobx-react-lite";
import Routing from "../../../configuration/Routing";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PermissionView } from "./parent";

export default function PermissionRoute(): RouteInterface {
    return {
        path: "/profile/permission",
        page: (
            <React.Fragment>
                <Titled />
                <Row mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start" style={{overflow: "hidden"}}>
                    <Navigation />
                    <Outlet />
                </Row>
            </React.Fragment>
        ),
        withParent: true,
        parent: <PermissionView />
    }
}

const Titled: React.FC = observer(() => {
    return (<Title title={`${authStore.read.firstName}'s Permission`} useDesktopWidth description="Your permissions and capabilities" />)
})

const Navigation: React.FC = observer(() => {
    const links = [
        {
            title: "Granted",
            icon: "duo-icons:confetti",
            link: Routing.instance.grantedPermission.path,
        },
        !authStore.read.isTeam && {
            title: "Requested",
            icon: "duo-icons:palette",
            link: Routing.instance.requestedPermission.path,
        }
    ]

    return (
        <Column style={{ width: "450px", height: "100%", padding: "20px" }} mainAxisSize="max" crossAxisSize="max">
            <Text text="Permission" size={15} color={AppTheme.hint} />
            <SizedBox height={30} />
            <Container width="100%" backgroundColor={AppTheme.primary} padding="10px" borderRadius="10px">
                {
                    links.map((parent, index) => {
                        const isLast = links.length - 1 === index;

                        if(parent) {
                            return (
                                <React.Fragment key={index}>
                                    <NavigationParent title={parent.title} icon={parent.icon} link={parent.link} />
                                    {!isLast && (<SizedBox height={10} />)}
                                </React.Fragment>
                            )
                        } else {
                            return <React.Fragment key={index}></React.Fragment>
                        }
                    })
                }
            </Container>
        </Column>
    )
})

interface NavigationChildProps {
    title: string;
    icon: string;
    link: string;
}

const NavigationParent: React.FC<NavigationChildProps> = observer(({title, icon, link}) => {
    const location = useLocation();
    const current = Routing.instance.get(location.pathname);
    const isCurrent = current?.path === link

    return (
        <Container
            backgroundColor={isCurrent ? AppTheme.secondary : "transparent"}
            hoverBackgroundColor={isCurrent ? AppTheme.secondary : AppTheme.hover}
            link={link}
            width="100%"
            borderRadius="12px"
            padding="8px 20px"
            style={{cursor: "pointer"}}
        >
            <Row mainAxisSize="max" crossAxisSize="min" mainAxis="flex-start">
                <Icon
                    icon={icon}
                    color={isCurrent ? AppTheme.primary : AppTheme.hint}
                    width="1.3em"
                    style={{margin: "0 6px 0 0"}}
                />
                <SizedBox width={10} />
                <Text text={title} color={isCurrent ? AppTheme.primary : AppTheme.hint} />
            </Row>
        </Container>
    )
})