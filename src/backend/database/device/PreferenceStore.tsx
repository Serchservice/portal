import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import { ThemeType } from '../../../utils/Enums';
import Preference from '../../models/device/Preference';

const STORAGE_KEY = "preferenceDb"

/**
 * Store for managing Preference data.
 * @implements Store<Preference>
 */
class PreferenceStore implements Store<Preference> {
    /** The current preference data. */
    preference: Preference = new Preference();

    constructor() {
        makeAutoObservable(this, {
            preference: observable,
            read: computed,
            set: action,
            clear: action,
            changeTheme: action,
            toggleDrawer: action,
            toggleSidebar: action,
        });
        const saved = store.get(STORAGE_KEY);
        if (saved) this.preference = Preference.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current preference data.
     * @returns {Preference} The current preference data.
     */
    get read(): Preference {
        return this.preference;
    }

    /**
     * Set new preference data.
     * @param {Preference} data - The new preference data.
     */
    set(data: Preference): void {
        this.preference = data;
        store.set(STORAGE_KEY, JSON.stringify(data.toJson()));
    }

    /**
     * Clear the preference data.
     */
    clear(): void {
        this.preference = new Preference();
        store.remove(STORAGE_KEY);
    }

    /**
     * Change the theme in preferences.
     */
    changeTheme(): void {
        const preference = preferenceStore.read;
        const newTheme = preference.isLight ? ThemeType.DARK : ThemeType.LIGHT;
        preferenceStore.set(preference.copyWith({ theme: newTheme }));
    }

    /**
     * Toggle the drawer state in preferences.
     */
    toggleDrawer(value?: boolean): void {
        const preference = preferenceStore.read;
        if (value !== undefined) {
            preferenceStore.set(preference.copyWith({ isOpen: value }))
        }
    }

    /**
     * Toggle the side bar state in preferences.
     */
    toggleSidebar(): void {
        const preference = preferenceStore.read;
        preferenceStore.set(preference.copyWith({ isWide: !preference.isWide }))
    }
}

const preferenceStore = new PreferenceStore();
export default preferenceStore;