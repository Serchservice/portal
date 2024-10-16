import { DateTime, NameSort, PermissionStatus, RatingType } from "./Enums";

export interface IFilterOption {
    title: string;
    value: string | number | DateTime | RatingType | NameSort;
}

export interface IFilter {
    header: string;
    options: IFilterOption[]
}

class Filters {
    static byAll: IFilter = {
        header: "All",
        options: [
            {title: "", value: ""}
        ]
    }

    static byRoles: IFilter = {
        header: "Roles",
        options: [
            {title: "Users", value: "USER"},
            {title: "Providers", value: "PROVIDER"},
            {title: "Associate Providers", value: "ASSOCIATE_PROVIDER"},
            {title: "Guests", value: "GUEST"},
            {title: "Businesses", value: "BUSINESS"}
        ]
    }

    static byCategories: IFilter = {
        header: "Categories",
        options: [
            {title: "Mechanics", value: "MECHANIC"},
            {title: "Plumbers", value: "PLUMBER"},
            {title: "Carpenters", value: "CARPENTER"},
            {title: "House Keepers", value: "HOUSE_KEEPER"},
            {title: "Electricians", value: "ELECTRICIAN"}
        ]
    }

    static byAccountStatus: IFilter = {
        header: "Account Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Suspended", value: "SUSPENDED" },
            { title: "Inactive", value: "DEACTIVATED" },
            { title: "Deleted", value: "DELETED" },
            { title: "Has issues", value: "HAS_REPORTED_ISSUES" },
        ]
    }

    static byAssociateAccountStatus: IFilter = {
        header: "Account Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Suspended", value: "SUSPENDED" },
            { title: "Inactive", value: "DEACTIVATED" },
            { title: "Business deactivated", value: "BUSINESS_DEACTIVATED" },
            { title: "Deleted", value: "DELETED" },
            { title: "Business deleted", value: "BUSINESS_DELETED" },
            { title: "Has issues", value: "HAS_REPORTED_ISSUES" },
        ]
    }

    static byAdminRole: IFilter = {
        header: "Role",
        options: [
            {title: "Admin", value: "ADMIN"},
            {title: "Manager", value: "MANAGER"},
            {title: "Team", value: "TEAM"},
            {title: "Super Admin", value: "SUPER_ADMIN"}
        ]
    }

    static byAdminAccountStatus: IFilter = {
        header: "Account Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Suspended", value: "SUSPENDED" },
            { title: "Inactive", value: "DEACTIVATED" },
            { title: "Deleted", value: "DELETED" },
        ]
    }

    static byIssueStatus: IFilter = {
        header: "Status",
        options: [
            {title: "Pending", value: "PENDING"},
            {title: "Resolved", value: "RESOLVED"},
            {title: "Open", value: "OPENED"},
            {title: "Closed", value: "CLOSED"},
            {title: "Waiting", value: "WAITING"}
        ]
    }

    static byMessageStatus: IFilter = {
        header: "Message",
        options: [
            {title: "Read", value: "READ"},
            {title: "Unread", value: "UNREAD"},
        ]
    }

    static byRating: IFilter = {
        header: "Rating",
        options: [
            {title: "5.0", value: 5.0},
            {title: "4.0 - 4.9", value: 4.0},
            {title: "3.0 - 3.9", value: 3.0},
            {title: "2.0 - 2.9", value: 2.0},
            {title: "1.0 - 1.9", value: 1.0},
            {title: "0.0 - 0.9", value: 0.0}
        ]
    }

    static byName: IFilter = {
        header: "Name (A-Z)",
        options: [
            {title: "Ascending", value: NameSort.ASCENDING},
            {title: "Descending", value: NameSort.DESCENDING}
        ]
    }

    static bySessionStatus: IFilter = {
        header: "Session Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Revoked", value: "INACTIVE" },
        ]
    }

    static byPermissionStatus: IFilter = {
        header: "Permission Status",
        options: [
            { title: "Granted", value: PermissionStatus.APPROVED },
            { title: "Revoked", value: PermissionStatus.REVOKED },
            { title: "Pending", value: PermissionStatus.PENDING },
            { title: "Declined", value: PermissionStatus.REJECTED },
        ]
    }

    static byCreatedAt: IFilter = {
        header: "Created at",
        options: [
            {title: "Today", value: DateTime.TODAY},
            {title: "This week", value: DateTime.CURRENT_WEEK},
            {title: "Last week", value: DateTime.LAST_WEEK},
            {title: "This month", value: DateTime.CURRENT_MONTH},
            {title: "Last month", value: DateTime.LAST_MONTH},
            {title: "This year", value: DateTime.CURRENT_YEAR},
            {title: "Last year", value: DateTime.LAST_YEAR},
        ]
    }

    static byUpdatedAt: IFilter = {
        header: "Updated at",
        options: [
            {title: "Today", value: DateTime.TODAY},
            {title: "This week", value: DateTime.CURRENT_WEEK},
            {title: "Last week", value: DateTime.LAST_WEEK},
            {title: "This month", value: DateTime.CURRENT_MONTH},
            {title: "Last month", value: DateTime.LAST_MONTH},
            {title: "This year", value: DateTime.CURRENT_YEAR},
            {title: "Last year", value: DateTime.LAST_YEAR},
        ]
    }

    static byVerifiedAt: IFilter = {
        header: "Verified at",
        options: [
            {title: "Today", value: DateTime.TODAY},
            {title: "This week", value: DateTime.CURRENT_WEEK},
            {title: "Last week", value: DateTime.LAST_WEEK},
            {title: "This month", value: DateTime.CURRENT_MONTH},
            {title: "Last month", value: DateTime.LAST_MONTH},
            {title: "This year", value: DateTime.CURRENT_YEAR},
            {title: "Last year", value: DateTime.LAST_YEAR},
        ]
    }

    static date = (option: DateTime): Date => {
        const now = new Date();
        switch (option) {
            case DateTime.TODAY:
                return new Date(now.setHours(0, 0, 0, 0));
            case DateTime.CURRENT_WEEK:
                return new Date(now.setDate(now.getDate() - now.getDay()));
            case DateTime.LAST_WEEK:
                return new Date(now.setDate(now.getDate() - now.getDay() - 7));
            case DateTime.CURRENT_MONTH:
                return new Date(now.getFullYear(), now.getMonth(), 1);
            case DateTime.LAST_MONTH:
                return new Date(now.getFullYear(), now.getMonth() - 1, 1);
            case DateTime.CURRENT_YEAR:
                return new Date(now.getFullYear(), 0, 1);
            case DateTime.LAST_YEAR:
                return new Date(now.getFullYear() - 1, 0, 1);
            default:
                throw new Error('Invalid date option');
        }
    }

    static filteredByDate = (date: string, option: string | number): boolean => {
        const createdAt = new Date(date);
        const now = new Date();
        if (option === DateTime.LAST_WEEK) {
            return createdAt >= Filters.date(option) && createdAt < new Date(now.setDate(now.getDate() - 7));
        } else if (option === DateTime.LAST_MONTH) {
            return createdAt >= Filters.date(option) && createdAt < new Date(now.getFullYear(), now.getMonth() - 1);
        } else if (option === DateTime.LAST_YEAR) {
            return createdAt >= Filters.date(option) && createdAt < new Date(now.getFullYear() - 1, 0, 1);
        } else {
            return createdAt >= Filters.date(option as DateTime);
        }
    }

    static byCategory: IFilter = {
        header: "Category",
        options: [
            {title: "Mechanic", value: "MECHANIC"},
            {title: "Plumber", value: "Plumber"}
        ]
    }

    static byCallType: IFilter = {
        header: "Call Type",
        options: [
            { title: "Tip2Fix", value: "T2F" },
        ]
    }

    static byCallStatus: IFilter = {
        header: "Call Status",
        options: [
            { title: "Ringing", value: "Ringing" },
        ]
    }

    static byChatRoomStatus: IFilter = {
        header: "Room Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Revoked", value: "INACTIVE" },
        ]
    }

    static byShopStatus: IFilter = {
        header: "Status",
        options: [
            { title: "Open", value: "OPEN" },
            { title: "Closed", value: "CLOSED" },
        ]
    }

    static byReportStatus: IFilter = {
        header: "Account Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Revoked", value: "INACTIVE" },
        ]
    }

    static byShareStatus: IFilter = {
        header: "Account Status",
        options: [
            { title: "Active", value: "ACTIVE" },
            { title: "Revoked", value: "INACTIVE" },
        ]
    }
    static byRequest: IFilter = {
        header: "Requested By",
        options: [
            { title: "Requested by me", value: "ME" },
            { title: "Requested by others", value: "OTHERS" },
        ]
    }
}

export default Filters