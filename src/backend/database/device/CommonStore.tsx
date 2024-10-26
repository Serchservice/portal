import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import { TransactionTypeResponse } from '../../models/payment/TransactionTypeResponse';

const STORAGE_KEY = "commonDb";

interface CommonInterface {
    types: TransactionTypeResponse[];
}

/**
 * Store for managing CommonInterface data.
 * @implements Store<CommonInterface>
 */
class CommonStore implements Store<CommonInterface> {
    /** The current common data. */
    common: CommonInterface = {
        types: [],
    };

    constructor() {
        makeAutoObservable(this, {
            common: observable,
            read: computed,
            set: action,
            update: action,
            clear: action,
        });

        const saved = store.get(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            this.common = {
                types: parsed.types.map((item: any) => TransactionTypeResponse.fromJson(item)),
            };
        }
    }

    /**
     * Get the current common data.
     * @returns {CommonInterface} The current common data.
     */
    get read(): CommonInterface {
        return this.common;
    }

    /**
     * Set new common data.
     * @param {CommonInterface} data - The new common data.
     */
    set(data: CommonInterface): void {
        this.common = data;
        store.set(STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Update specific fields in the common data while preserving other fields.
     * @param {Partial<CommonInterface>} data - The new data to update.
     */
    update(data: Partial<CommonInterface>): void {
        this.common = { ...this.common, ...data };
        store.set(STORAGE_KEY, JSON.stringify(this.common));
    }

    /**
     * Clear the common data.
     */
    clear(): void {
        this.common = {} as CommonInterface;
        store.remove(STORAGE_KEY);
    }
}

const commonStore = new CommonStore();
export default commonStore;