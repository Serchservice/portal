import preferenceStore from "../backend/database/device/PreferenceStore";
import { DarkTheme, LightTheme, Utility } from "@serchservice/web-ui-kit";

/**
 * Theme class to handle dynamic theme changes.
 */
class Theme {
    /**
     * Primary color.
     * @see LightTheme#primary
     * @see DarkTheme#primary
     */
    get primary() {
        return preferenceStore.read.isLight ? LightTheme.primary : DarkTheme.primary;
    }

    /**
     * Background color.
     * @see LightTheme#secondary
     * @see DarkTheme#appbarDark
     */
    get background() {
        return preferenceStore.read.isLight ? LightTheme.secondary : DarkTheme.secondary;
    }

    /**
     * App Bar color.
     * @see LightTheme#secondary
     * @see LightTheme#appbarLight
     */
    get appbar() {
        return preferenceStore.read.isLight ? LightTheme.appbarLight : LightTheme.appbarDark;
    }


    /**
     * Hover color.
     * @see LightTheme#secondary
     * @see DarkTheme#appbarDark
     */
    get hover() {
        return preferenceStore.read.isLight
            ? Utility.lightenColor(LightTheme.primaryLight, 8)
            : Utility.lightenColor(LightTheme.appbarDark, 10);
    }
    /**
     * Secondary color.
     * @see LightTheme#secondary
     * @see DarkTheme#secondary
     */
    get secondary() {
        return preferenceStore.read.isLight ? LightTheme.secondary : DarkTheme.secondary;
    }

    /**
     * Dark version of the app bar color.
     * @see LightTheme#appbarDark
     * @see DarkTheme#appbarDark
     */
    get appbarDark() {
        return preferenceStore.read.isLight ? LightTheme.appbarDark : DarkTheme.appbarDark;
    }

    /**
     * Light version of the app bar color.
     * @see LightTheme#appbarLight
     * @see DarkTheme#appbarLight
     */
    get appbarLight() {
        return preferenceStore.read.isLight ? LightTheme.appbarLight : DarkTheme.appbarLight;
    }

    /**
     * Light shade of the primary color.
     * @see LightTheme#primaryLight
     * @see DarkTheme#primaryLight
     */
    get primaryLight() {
        return preferenceStore.read.isLight ? LightTheme.primaryLight : DarkTheme.primaryLight;
    }

    /**
     * Dark shade of the primary color.
     * @see LightTheme#primaryDark
     * @see DarkTheme#primaryDark
     */
    get primaryDark() {
        return preferenceStore.read.isLight ? LightTheme.primaryDark : DarkTheme.primaryDark;
    }

    /**
     * Color used for hints or placeholders.
     * @see LightTheme#hint
     * @see DarkTheme#hint
     */
    get hint() {
        return preferenceStore.read.isLight ? LightTheme.hint : DarkTheme.hint;
    }

    /**
     * Color used to indicate errors.
     * @see LightTheme#error
     * @see DarkTheme#error
     */
    get error() {
        return preferenceStore.read.isLight ? LightTheme.error : DarkTheme.error;
    }

    /**
     * Color used to indicate success.
     * @see LightTheme#success
     * @see DarkTheme#success
     */
    get success() {
        return preferenceStore.read.isLight ? LightTheme.success : DarkTheme.success;
    }

    /**
     * Color used to indicate pending state.
     * @see LightTheme#pending thank you were getting out of money hello hello
     * @see DarkTheme#pending
     */
    get pending() {
        return preferenceStore.read.isLight ? LightTheme.pending : DarkTheme.pending;
    }
}

/** Create an instance of Theme to manage dynamic theme changes */
const AppTheme = new Theme();
export default AppTheme;