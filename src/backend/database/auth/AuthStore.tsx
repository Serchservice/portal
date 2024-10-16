import { action, computed, makeAutoObservable, observable } from 'mobx';
import Store from '../Store';
import Cookies from "js-cookie"
import preferenceStore from '../device/PreferenceStore';
import adminStore from './AdminStore';
import inviteStore from './InviteStore';
import mfaSetupStore from './MFASetupStore';
import mfaStore from './MFAStore';
import Auth from '../../models/auth/Auth';

const STORAGE_KEY = "authDb"

/**
 * Store for managing Auth data.
 * @implements Store<Auth>
 */
class AuthStore implements Store<Auth> {
    /** The current auth data. */
    auth: Auth = Auth.empty();

    constructor() {
        makeAutoObservable(this, {
            read: computed,
            auth: observable,
            clear: action,
            set: action,
            logout: action,
        });
        const saved = Cookies.get(STORAGE_KEY);
        if (saved) this.auth = Auth.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current auth data.
     * @returns {Auth} The current auth data.
     */
    get read(): Auth {
        return this.auth;
    }

    /**
     * Set new auth data.
     * @param {Auth} data - The new auth data.
     */
    set(data: Auth): void {
        this.auth = data;
        Cookies.set(STORAGE_KEY, JSON.stringify(data.toJson()));
    }

    /**
     * Clear the auth data.
     */
    clear(): void {
        this.auth = Auth.empty();
        Cookies.remove(STORAGE_KEY);
    }

    /**
     * Logout and clear all related stores.
     */
    logout(): void {
        this.clear();
        adminStore.clear();
        preferenceStore.clear();
        mfaStore.clear();
        mfaSetupStore.clear();
        inviteStore.clear();
    }
}

const authStore = new AuthStore();
export default authStore;