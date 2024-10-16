export enum PreferenceType {
    NONE = 'NONE',
    PHONE = 'PHONE',
    EMAIL = 'EMAIL'
}

export enum MediaQuery {
    MOBILE = "(max-width:748px)",
    DESKTOP = "(min-width:748px)"
}

export enum ConfirmAuthMode {
    MFA = "Use two-factor authentication",
    RECOVERY = "Use recovery code"
}

export enum ThemeType {
    LIGHT = 'LIGHT',
    DARK = 'DARK'
}

export enum SecurityType {
    NONE = 'NONE',
    MFA = 'MFA',
    BIOMETRICS = 'BIOMETRICS',
    BOTH = 'BOTH'
}

export enum Role {
    SUPER = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    TEAM = 'TEAM'
}

export enum PermissionStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING",
    REVOKED = "REVOKED"
}

export enum Permission {
    WRITE = "Write",
    READ = "Read",
    UPDATE = "Update",
    DELETE = "Delete"
}

export enum PermissionType {
    CLUSTER = "Cluster",
    SPECIFIC = "Specific"
}

export enum AdminAction {
    SUPER_SIGNUP = 'SUPER_SIGNUP',
    LOGIN = 'LOGIN',
    INVITE = 'INVITE'
}

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED",
    DELETED = "DELETED",
    HAS_REPORTED_ISSUES = "HAS_REPORTED_ISSUES",
    SUSPENDED = "SUSPENDED"
}

export enum DateTime {
    TODAY = "TODAY",
    CURRENT_WEEK = "CURRENT_WEEK",
    LAST_WEEK = "LAST_WEEK",
    CURRENT_MONTH = "CURRENT_MONTH",
    LAST_MONTH = "LAST_MONTH",
    CURRENT_YEAR = "CURRENT_YEAR",
    LAST_YEAR = "LAST_YEAR"
}

export enum RatingType {
    FIVE = 5.0,
    FOUR = 4.0,
    THREE = 3.0,
    TWO = 2.0,
    ONE = 1.0,
    ZERO = 0.0
}

export enum NameSort {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC'
}

export enum CategoryType {
    BUSINESS = "BUSINESS",
    MECHANIC = "MECHANIC",
    PLUMBER = "PLUMBER",
    CARPENTER = "CARPENTER"
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    ANY = "ANY",
    NONE = "NONE"
}

export const GenderTypes = {
    [Gender.MALE]: "Male",
    [Gender.FEMALE]: "Female",
    [Gender.ANY]: "Any",
    [Gender.NONE]: "All"
} as const;