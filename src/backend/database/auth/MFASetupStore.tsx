import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import MFASetup from '../../models/auth/MFASetup';

const STORAGE_KEY = "mfaSetupDb"

/**
 * Store for managing MFA setup data.
 * @implements Store<MFASetup>
 */
class MFASetupStore implements Store<MFASetup> {
    /** The current MFA setup data. */
    mfa: MFASetup = new MFASetup();

    constructor() {
        makeAutoObservable(this, {
            mfa: observable,
            read: computed,
            set: action,
            clear: action
        });
        const saved = store.get(STORAGE_KEY);
        if (saved) this.mfa = MFASetup.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current MFA setup data.
     * @returns {MFASetup} The current MFA setup data.
     */
    get read(): MFASetup {
        return this.mfa;
    }

    /**
     * Set new MFA setup data.
     * @param {MFASetup} data - The new MFA setup data.
     */
    set(data: MFASetup): void {
        this.mfa = data;
        store.set(STORAGE_KEY, JSON.stringify(data.toJson()));
    }

    /**
     * Clear the MFA setup data.
     */
    clear(): void {
        this.mfa = new MFASetup();
        store.remove(STORAGE_KEY);
    }
}

const mfaSetupStore = new MFASetupStore();
export default mfaSetupStore;