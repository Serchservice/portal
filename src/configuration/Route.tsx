import React from "react";
import { PermissionType, Role } from "../utils/Enums";

export interface RouteParams extends Record<string, string | undefined> {
    slug?: string;
    name?: string;
    scope?: string;
    invite?: string;
    emailAddress? : string;
    token?: string;
    link?: string;
}

export interface RouteInterface {
    path: string;
    pathView?: (params: RouteParams) => string;
    page: JSX.Element;
    children?: RouteInterface[];
    roles?: Role[];
    permissions?: PermissionType[];
    withParent?: boolean;
    parent?: React.ReactNode
}

export class RouteConfig {
    /** Helper to check if a value implements RouteInterface */
    static isRouteInterface(route: any): route is RouteInterface {
        return (
            route && typeof route.path === 'string' && typeof route.page !== 'undefined'
            && (route.children === undefined || Array.isArray(route.children))
            && (route.roles === undefined || Array.isArray(route.roles))
            && (route.permissions === undefined || Array.isArray(route.permissions))
            && (route.scopes === undefined || Array.isArray(route.scopes))
            && (route.withParent || !route.withParent)
            && (route.parent || !route.parent)
        );
    }

    /** Use pathView if it is defined, else use the default path */
    static getRoute(route: RouteInterface, params: RouteParams = {}): string {
        if(params.link) {
            return `${route.path}/${params.link}`;
        } else {
            return route.pathView ? route.pathView(params) : route.path;
        }
    }

    static getRouteFromRole(role: string): string {
        return ""
    }
}