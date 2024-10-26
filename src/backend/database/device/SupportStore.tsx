import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import Support from '../../models/device/Support';

const STORAGE_KEY = "supportDb"

/**
 * Store for managing Support data.
 * @implements Store<Support>
 */
class SupportStore implements Store<Support> {
    /** The current support data. */
    support: Support = new Support();

    constructor() {
        makeAutoObservable(this, {
            support: observable,
            read: computed,
            set: action,
            clear: action,
        });
        const saved = store.get(STORAGE_KEY);
        if (saved) this.support = Support.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current support data.
     * @returns {Support} The current support data.
     */
    get read(): Support {
        return this.support;
    }

    /**
     * Set new support data.
     * @param {Support} data - The new support data.
     */
    set(data: Support): void {
        console.log(data)
        this.support = data;
        store.set(STORAGE_KEY, JSON.stringify(data.toJson()));
    }

    /**
     * Clear the support data.
     */
    clear(): void {
        this.support = new Support();
        store.remove(STORAGE_KEY);
    }
}

const supportStore = new SupportStore();
export default supportStore;