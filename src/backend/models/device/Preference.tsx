import { PreferenceType, ThemeType, SecurityType } from "../../../utils/Enums";

interface IPreference {
    notification?: PreferenceType;
    hasBiometrics?: boolean;
    theme?: ThemeType;
    security?: SecurityType;
    remember?: boolean;
    isWide?: boolean;
    isOpen?: boolean;
    color?: string;
}

class Preference implements IPreference {
    notification: PreferenceType;
    hasBiometrics: boolean;
    theme: ThemeType;
    security: SecurityType;
    remember: boolean;
    isWide: boolean;
    isOpen: boolean;
    color?: string;

    constructor({
        notification = PreferenceType.NONE,
        hasBiometrics = false,
        theme = ThemeType.LIGHT,
        security = SecurityType.NONE,
        remember = false,
        isWide = true,
        isOpen = false,
        color
    }: IPreference = {}) {
        this.notification = notification;
        this.hasBiometrics = hasBiometrics;
        this.theme = theme;
        this.security = security;
        this.remember = remember;
        this.isWide = isWide;
        this.isOpen = isOpen;
        this.color = color;
    }

    get isDark(): boolean {
        return this.theme === ThemeType.DARK;
    }

    get isLight(): boolean {
        return this.theme === ThemeType.LIGHT;
    }

    get isMFA(): boolean {
        return this.security === SecurityType.MFA;
    }

    get isBiometrics(): boolean {
        return this.security === SecurityType.BIOMETRICS;
    }

    get isBoth(): boolean {
        return this.security === SecurityType.BOTH;
    }

    get isSecured(): boolean {
        return this.security !== SecurityType.NONE;
    }

    copyWith({
        notification,
        hasBiometrics,
        theme,
        security,
        remember,
        isWide,
        isOpen,
        color,
    }: IPreference = {}): Preference {
        return new Preference({
            notification: notification ?? this.notification,
            hasBiometrics: hasBiometrics ?? this.hasBiometrics,
            theme: theme ?? this.theme,
            security: security ?? this.security,
            remember: remember ?? this.remember,
            isWide: isWide ?? this.isWide,
            isOpen: isOpen ?? this.isOpen,
            color: color ?? this.color,
        });
    }

    static empty(): Preference {
        return new Preference();
    }

    static fromJson(map: any): Preference {
        return new Preference({
            notification: map.notification ?? PreferenceType.NONE,
            theme: map.theme ?? ThemeType.LIGHT,
            security: map.security ?? SecurityType.NONE,
            hasBiometrics: map.has_biometrics ?? false,
            remember: map.remember ?? false,
            isWide: map.isWide ?? true,
            isOpen: map.isOpen ?? false,
            color: map.color ?? ""
        });
    }

    toJson(): object {
        return {
            notification: this.notification,
            has_biometrics: this.hasBiometrics,
            theme: this.theme,
            remember: this.remember,
            security: this.security,
            isWide: this.isWide,
            isOpen: this.isOpen,
            color: this.color
        };
    }
}

export default Preference;