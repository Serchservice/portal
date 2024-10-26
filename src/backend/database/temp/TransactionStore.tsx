import { makeAutoObservable } from "mobx";
import { TransactionGroupScopeResponse } from "../../models/payment/TransactionGroupScopeResponse";

class TransactionStore {
    // A Map where each key is the status, and the value is an object containing id, header, title, and transactions
    item: Map<string, {
        id?: string;
        header?: string;
        title?: string;
        text?: string,
        selected?: string[];
        itemsPerPage?: number;
        pageSize?: number;
        page?: number;
        type?: string;
        start?: string;
        end?: string;
        transactions?: TransactionGroupScopeResponse[];
    }> = new Map();
    openId?: string;

    constructor() {
        makeAutoObservable(this);
    }

    // Computed property to get all item
    get read() {
        return this.item;
    }

    // Set or update an item for a specific status
    setItem(status: string, data: Partial<{
        id: string;
        header: string;
        title: string;
        text: string;
        selected: string[];
        itemsPerPage: number;
        pageSize: number;
        page: number;
        start: string;
        end: string;
        type: string;
        transactions: TransactionGroupScopeResponse[];
    }>) {
        // Get the existing item or initialize a new object
        const existingItem = this.item.get(status);

        // Update only the fields provided in the data parameter, without losing the old data
        const updatedItem = {
            ...existingItem,
            ...data,
            itemsPerPage: data.itemsPerPage ?? existingItem?.itemsPerPage ?? 5,
            pageSize: data.pageSize ?? existingItem?.pageSize ?? 5,
            page: data.page ?? existingItem?.itemsPerPage ?? 0,
        };

        // Set the updated item back to the map
        this.item.set(status, updatedItem);
    }

    // Get an item for a specific status
    getItem(status: string) {
        return this.item.get(status);
    }

    // Clear an item for a specific status
    clearItem(status: string) {
        this.item.delete(status);
    }

    setOpenId(id: string) {
        this.openId = id
    }

    clearOpenId() {
        this.openId = undefined
    }

    getOpenId() {
        return this.openId
    }
}

const transactionStore = new TransactionStore();
export default transactionStore;