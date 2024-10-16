import { makeAutoObservable, observable, computed, action } from "mobx";
import store from "store2";
import Store from "./Store";

interface ICommonData {
    name: string;
    token: string;
    emailAddress: string;
}

class CommonData implements ICommonData {
    constructor(
        public name: string,
        public token: string,
        public emailAddress: string
    ) {}

    static fromJson(data: any): CommonData {
        return new CommonData(data.name, data.token, data.emailAddress);
    }

    toJson(): any {
        return {
            name: this.name,
            token: this.token,
            emailAddress: this.emailAddress,
        };
    }

    static empty(): CommonData {
        return new CommonData("", "", "")
    }

    copyWith(updatedData: Partial<ICommonData>): CommonData {
        return new CommonData(
            updatedData.name ?? this.name,
            updatedData.token ?? this.token,
            updatedData.emailAddress ?? this.emailAddress
        );
    }
}

const DATABASE_STORAGE_KEY = "db"

class Database implements Store<CommonData> {
    /** The current database data. */
    data: CommonData = CommonData.empty();
    private static content = new Database();

    static instance(): Database {
        if (!Database.content) {
            Database.content = new Database();
        }
        return Database.content;
    }

    constructor() {
        makeAutoObservable(this, {
            data: observable,
            read: computed,
            set: action,
            clear: action,
        });
        const saved = store.get(DATABASE_STORAGE_KEY);
        if (saved) this.data = JSON.parse(saved);
    }

    /**
     * Get the current database data.
     * @returns {CommonData} The current database data.
     */
    get read(): CommonData {
        return this.data;
    }

    /**
     * Set new database data.
     * @param {CommonData} data - The new database data.
     */
    set(data: CommonData): void {
        this.data = data;
        store.set(DATABASE_STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Clear the database data.
     */
    clear(): void {
        this.data = CommonData.empty();
        store.remove(DATABASE_STORAGE_KEY);
    }
}

export { CommonData }
export default Database.instance();