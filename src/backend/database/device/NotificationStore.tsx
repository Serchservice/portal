import { IFrame } from '@stomp/stompjs';
import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import Notification from '../../models/device/Notification';
import { Notify } from '@serchservice/web-ui-kit';

const STORAGE_KEY = "notificationDb"

class NotificationStore implements Store<Notification> {
    notifications: Notification[] = [];

    constructor() {
        makeAutoObservable(this, {
            notifications: observable,
            markRead: action,
            remove: action,
            clear: action,
            read: computed,
            set: action,
            fetchNotifications: action,
            count: computed
        });

        const saved = store.get(STORAGE_KEY);
        if (saved) {
            this.notifications = JSON.parse(saved).map((notification: string) => Notification.fromJson(JSON.parse(notification)));
        }

        // this.socket = new Socket({
        //     endpoint: '/ws:serch', // Adjust endpoint as per your WebSocket configuration
        //     callback: this.handleNotification,
        //     destination: '/topic/notifications', // Adjust topic as per your server setup
        // });
    }

    get read(): Notification[] {
        return this.notifications;
    }

    set(notification: Notification): void {
        this.notifications.push(notification);
        store.set(STORAGE_KEY, JSON.stringify(this.notifications.map(notification => JSON.stringify(notification.toJson()))));
    }

    clear(): void {
        this.notifications = [];
        store.remove(STORAGE_KEY);
        // Make API request via socket to clear all notifications on the server
        // this.socket.send({
        //     destination: '/app/notification/clear/all',
        // });
    }

    get count(): number {
        return this.notifications.filter(notification => !notification.isRead).length;
    }

    markRead(id: number): void {
        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
            notification.status = 'READ';
            // Make API request via socket to mark notification as read on the server
            // this.socket.send({
            //     destination: '/app/notification/mark',
            //     message: { id },
            // });
            this.updateStore();
        }
    }

    remove(id: number): void {
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            // Make API request via socket to clear notification on the server
            // this.socket.send({
            //     destination: '/app/notification/clear',
            //     message: { id },
            // });
            this.updateStore();
        }
    }

    fetchNotifications(): void {
        // Fetch notifications from the server via socket
        // this.socket.send({
        //     destination: '/app/notification/all',
        // });
    }

    private handleNotification = (frame: IFrame): void => {
        console.log('Notification received:', frame.body);
        const newNotification = Notification.fromJson(JSON.parse(frame.body));
        Notify.info(newNotification.message);
        this.set(newNotification);
    }

    private updateStore(): void {
        store.set(STORAGE_KEY, JSON.stringify(this.notifications.map(notification => JSON.stringify(notification.toJson()))));
    }
}

const notificationStore = new NotificationStore();
export default notificationStore;