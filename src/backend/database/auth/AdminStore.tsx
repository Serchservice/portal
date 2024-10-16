import { makeAutoObservable, action, observable, computed } from 'mobx';
import store from 'store2';
import Store from '../Store';
import Admin from '../../models/profile/Admin';
import authStore from './AuthStore';

const STORAGE_KEY = "adminDb"

/**
 * Store for managing Admin data.
 * @implements Store<Admin>
 */
class AdminStore implements Store<Admin> {
    /** The current admin data. */
    admin: Admin = Admin.empty();

    constructor() {
        makeAutoObservable(this, {
            admin: observable,
            read: computed,
            set: action,
            clear: action
        });
        const saved = store.get(STORAGE_KEY);
        if (saved) this.admin = Admin.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current admin data.
     * @returns {Admin} The current admin data.
     */
    get read(): Admin {
        return this.admin;
    }

    /**
     * Set new admin data.
     * @param {Admin} data - The new admin data.
     */
    set(data: Admin): void {
        this.admin = data;
        store.set(STORAGE_KEY, JSON.stringify(data.toJson()));

        authStore.set(authStore.read.copyWith({
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            avatar: data.profile.avatar,
        }));
    }

    /**
     * Clear the admin data.
     */
    clear(): void {
        this.admin = Admin.empty();
        store.remove(STORAGE_KEY);
    }
}

const adminStore = new AdminStore();
export default adminStore;