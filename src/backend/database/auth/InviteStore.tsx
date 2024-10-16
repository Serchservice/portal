import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import Invite from '../../models/auth/Invite';

const STORAGE_KEY = "inviteSetupDb"

/**
 * Store for managing Invite data.
 * @implements Store<Invite>
 */
class InviteStore implements Store<Invite> {
    /** The current invite data. */
    invite: Invite = new Invite();

    constructor() {
        makeAutoObservable(this, {
            invite: observable,
            read: computed,
            set: action,
            clear: action
        });
        const saved = store.get(STORAGE_KEY);
        if (saved) this.invite = Invite.fromJson(JSON.parse(saved));
    }

    /**
     * Get the current invite data.
     * @returns {Invite} The current invite data.
     */
    get read(): Invite {
        return this.invite;
    }

    /**
     * Set new invite data.
     * @param {Invite} data - The new invite data.
     */
    set(data: Invite): void {
        this.invite = data;
        store.set(STORAGE_KEY, JSON.stringify(data.toJson()));
    }

    /**
     * Clear the invite data.
     */
    clear(): void {
        this.invite = new Invite();
        store.remove(STORAGE_KEY);
    }
}

const inviteStore = new InviteStore();
export default inviteStore;