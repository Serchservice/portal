import Cookies from 'js-cookie';
import { action, computed, makeAutoObservable, observable } from 'mobx';
import Store from '../Store';
import MFA from '../../models/auth/MFA';

const STORAGE_KEY = "mfaDb"

/**
 * Store for managing MFA data.
 * @implements Store<MFA>
 */
class MFAStore implements Store<MFA> {
    /** The current MFA data. */
    mfa: MFA = new MFA();

    constructor() {
        makeAutoObservable(this, {
            mfa: observable,
            read: computed,
            set: action,
            clear: action
        });
        const saved = Cookies.get(STORAGE_KEY);
        if (saved) this.mfa = MFA.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current MFA data.
     * @returns {MFA} The current MFA data.
     */
    get read(): MFA {
        return this.mfa;
    }

    /**
     * Set new MFA data.
     * @param {MFA} data - The new MFA data.
     */
    set(data: MFA): void {
        this.mfa = data;
        Cookies.set(STORAGE_KEY, JSON.stringify(data.toJson()));
    }

    /**
     * Clear the MFA data.
     */
    clear(): void {
        this.mfa = new MFA();
        Cookies.remove(STORAGE_KEY);
    }
}

const mfaStore = new MFAStore();
export default mfaStore;