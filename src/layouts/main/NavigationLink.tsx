import Routing from "../../configuration/Routing";

export interface NavigationSubLinkInterface {
    title: string;
    description?: string;
    icon: string;
    active: string;
    link: string;
}

export interface NavigationLinkOptionInterface {
    title?: string;
    links: NavigationSubLinkInterface[];
}

export interface NavigationLinkInterface {
    header: string;
    link: string;
    icon: string;
    activeIcon: string;
    options?: NavigationLinkOptionInterface[]
}

export const NavigationLinks: NavigationLinkInterface[] = [
    {
        header: "Dashboard",
        link: Routing.instance.home.path,
        icon: 'solar:widget-2-bold',
        activeIcon: 'solar:widget-2-bold-duotone'
    },
    {
        header: "Activity",
        link: "",
        icon: 'solar:pulse-2-bold',
        activeIcon: 'solar:pulse-2-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Providers",
                        description: "View providers that are active for trips",
                        icon: 'solar:pulse-bold',
                        active: 'solar:pulse-bold-duotone',
                        link: ""
                    },
                ]
            },
        ]
    },
    {
        header: "Schedule",
        link: "",
        icon: 'solar:calendar-bold',
        activeIcon: 'solar:calendar-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Active",
                        description: "View active schedules",
                        icon: 'solar:calendar-date-line-duotone',
                        active: 'solar:calendar-date-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Pending",
                        description: "View pending schedules",
                        icon: 'solar:calendar-mark-line-duotone',
                        active: 'solar:calendar-mark-bold-duotone',
                        link: ""
                    },
                    {
                        title: "History",
                        description: "View schedule history",
                        icon: 'solar:calendar-search-line-duotone',
                        active: 'solar:calendar-search-bold-duotone',
                        link: ""
                    },
                ]
            },
        ]
    },
    {
        header: "Trips",
        link: "",
        icon: 'solar:streets-bold',
        activeIcon: 'solar:streets-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Active",
                        icon: 'solar:streets-navigation-bold',
                        active: 'solar:streets-navigation-bold-duotone',
                        link: "",
                        description: "View active trips"
                    },
                    {
                        title: "Pending",
                        icon: 'solar:streets-map-point-bold',
                        active: 'solar:streets-map-point-bold-duotone',
                        link: "",
                        description: "View pending trips"
                    },
                    {
                        title: "History",
                        icon: 'solar:clipboard-list-bold',
                        active: 'solar:clipboard-list-bold-duotone',
                        link: "",
                        description: "View trip history"
                    },
                ]
            },
        ]
    },
    {
        header: "Shops",
        link: "",
        icon: 'solar:shop-bold',
        activeIcon: 'solar:shop-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "All",
                        description: "View and handle user details",
                        icon: 'solar:shop-2-bold',
                        active: 'solar:shop-2-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Open",
                        description: "View and handle user details",
                        icon: 'jam:switch-right',
                        active: 'jam:switch-right-f',
                        link: ""
                    },
                    {
                        title: "Closed",
                        description: "View and handle user details",
                        icon: 'jam:switch-left',
                        active: 'jam:switch-left-f',
                        link: ""
                    }
                ]
            }
        ]
    },
    {
        header: "Accounts",
        link: "",
        icon: 'solar:user-bold',
        activeIcon: 'solar:user-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Users",
                        description: "View and handle user details",
                        icon: 'solar:users-group-two-rounded-bold',
                        active: 'solar:users-group-two-rounded-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Guests",
                        description: "View and handle guest details",
                        icon: 'solar:user-plus-bold',
                        active: 'solar:user-plus-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Providers",
                        description: "View and handle provider details",
                        icon: 'solar:users-group-rounded-bold',
                        active: 'solar:users-group-rounded-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Associates",
                        description: "View and handle associate details",
                        icon: 'uis:layer-group',
                        active: 'uim:layer-group',
                        link: ""
                    },
                    {
                        title: "Businesses",
                        description: "View and handle business details",
                        icon: 'solar:suitcase-tag-bold',
                        active: 'solar:suitcase-tag-bold-duotone',
                        link: ""
                    }
                ]
            },
            {
                title: "Miscellaneous",
                links: [
                    {
                        title: "Offline Providers",
                        description: "View and handle offline provider details",
                        icon: 'ic:round-offline-bolt',
                        active: 'ic:twotone-offline-bolt',
                        link: ""
                    },
                    {
                        title: "Reported accounts",
                        description: "Perform action on reported accounts",
                        icon: 'ic:sharp-report',
                        active: 'ic:twotone-report',
                        link: ""
                    },
                    {
                        title: "Delete requests",
                        description: "Process account delete requests",
                        icon: 'icon-park-solid:delete-mode',
                        active: 'icon-park-twotone:delete-mode',
                        link: ""
                    },
                    {
                        title: "Pending Registrations",
                        description: "View and notify pending registrations",
                        icon: 'ph:arrows-in-bold',
                        active: 'ph:arrows-in-duotone',
                        link: ""
                    }
                ]
            },
        ]
    },
    {
        header: "Feature",
        link: "",
        icon: 'solar:posts-carousel-vertical-bold',
        activeIcon: 'solar:posts-carousel-vertical-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "RequestSharing",
                        description: "See activities involving requestSharing",
                        icon: 'solar:square-share-line-bold',
                        active: 'solar:square-share-line-bold-duotone',
                        link: ""
                    },
                    {
                        title: "ProvideSharing",
                        description: "See activities involving provideSharing",
                        icon: 'solar:screen-share-bold',
                        active: 'solar:screen-share-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Tip2Fix",
                        description: "Handle tip2fix conversational outcomes",
                        icon: 'solar:chat-round-call-bold',
                        active: 'solar:chat-round-call-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Drive to shop",
                        description: "See activities involving drive to shop",
                        icon: 'ic:round-drive-eta',
                        active: 'ic:twotone-drive-eta',
                        link: ""
                    }
                ]
            }
        ]
    },
    {
        header: "Countries In Serch",
        link: "",
        icon: 'subway:world',
        activeIcon: 'subway:world-1',
        options: [
            {
                links: [
                    {
                        title: "Requested",
                        description: "View and process requested countries",
                        icon: 'solar:circle-bottom-down-bold',
                        active: 'solar:circle-bottom-down-bold-duotone',
                        link: ""
                    },
                    {
                        title: "Launched",
                        description: "Add or update countries in Serch",
                        icon: 'solar:verified-check-bold',
                        active: 'solar:verified-check-bold-duotone',
                        link: ""
                    }
                ]
            }
        ]
    },
    {
        header: "Payment",
        link: Routing.instance.payment.path,
        icon: 'solar:wallet-bold',
        activeIcon: 'solar:wallet-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Revenue",
                        description: "Accounting details on cashback",
                        icon: 'solar:wallet-money-bold',
                        active: 'solar:wallet-money-bold-duotone',
                        link: Routing.instance.revenue.path
                    },
                    {
                        title: "Transactions",
                        description: "View and handle user transactions",
                        icon: 'solar:documents-bold',
                        active: 'solar:documents-bold-duotone',
                        link: Routing.instance.transaction.path
                    },
                    {
                        title: "Payouts",
                        description: "View and process user withdrawals",
                        icon: 'solar:case-round-minimalistic-bold',
                        active: 'solar:case-round-minimalistic-bold-duotone',
                        link: Routing.instance.payout.path
                    },
                    {
                        title: "Wallets",
                        description: "Take an in-depth view on user's wallet",
                        icon: 'solar:card-2-bold',
                        active: 'solar:card-2-bold-duotone',
                        link: Routing.instance.wallet.path
                    }
                ]
            }
        ]
    },
    {
        header: "Support",
        link: Routing.instance.support.path,
        icon: 'solar:call-chat-rounded-bold',
        activeIcon: 'solar:call-chat-rounded-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Speak With Serch",
                        description: "Have conversations with users using tickets",
                        icon: 'solar:ticket-bold',
                        active: 'solar:ticket-bold-duotone',
                        link: Routing.instance.speakWithSerch.path
                    },
                    {
                        title: "Complaints",
                        description: "See complaints made by users about Serch",
                        icon: 'solar:chat-dots-bold',
                        active: 'solar:chat-dots-bold-duotone',
                        link: Routing.instance.complaint.path
                    }
                ]
            }
        ]
    },
    {
        header: "Marketing",
        link: "",
        icon: 'solar:chart-2-bold',
        activeIcon: 'solar:chart-2-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Newsletter Subscription",
                        description: "Get insight on newsletter subscriptions",
                        icon: 'solar:inbox-in-bold',
                        active: 'solar:inbox-in-bold-duotone',
                        link: ""
                    }
                ]
            }
        ]
    },
    {
        header: "Team Serch",
        link: Routing.instance.team.path,
        icon: 'solar:shield-user-bold',
        activeIcon: 'solar:shield-user-bold-duotone',
        options: [
            {
                links: [
                    {
                        title: "Organization",
                        description: "View, add, delete and update organization member data",
                        icon: 'uis:user-arrows',
                        active: 'uim:user-arrows',
                        link: Routing.instance.organization.path
                    }
                ]
            }
        ]
    }
]