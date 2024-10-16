import { format, isToday, isYesterday } from 'date-fns';

export default class TimeUtils {
    public static chat(value: string | Date): string {
        const date = typeof value === 'string' ? new Date(value) : value;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const truncatedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (truncatedDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (truncatedDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else if (truncatedDate.getTime() > lastWeek.getTime()) {
            const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = date.getDay();
            return weekdayNames[dayOfWeek];
        } else {
            return format(date, 'EEEE MMMM d, yyyy'); // Using date-fns format for flexibility
        }
    }

    /**
     * Formats the future time based on the provided date and time.
     * @param dateTime The future date and time.
     * @return The formatted future time.
     */
    public static future(dateTime: string | Date): string {
        const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        const now = new Date();
        const duration = date.getTime() - now.getTime();
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);

        let result = '';
        if (minutes > 0) {
            result += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        } else {
            result += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        }
        return result;
    }

    /**
     * Formats the time based on the provided date and time.
     * @param dateTime The date and time to format.
     * @return The formatted time.
     */
    public static time(dateTime: string | Date): string {
        const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        return format(date, 'h:mma');
    }

    /**
     * Formats the day based on the provided date and time.
     * @param dateTime The date and time to format.
     * @return The formatted day.
     */
    public static day(dateTime: string | Date | null): string {
        if (dateTime) {
            const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
            if (isToday(date)) {
                return `Today, ${TimeUtils.time(date)}`;
            } else if (isYesterday(date)) {
                return `Yesterday, ${TimeUtils.time(date)}`;
            } else {
                return format(date, 'EEEE, d MMMM yyyy');
            }
        } else {
            return '';
        }
    }
}