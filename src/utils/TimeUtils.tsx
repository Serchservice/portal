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

    public static chatWithTimezone(value: string | Date, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
        const date = typeof value === 'string' ? new Date(value) : value;
        const now = new Date();
        const today = new Date(now.toLocaleString('en-US', { timeZone }));
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const truncatedDate = new Date(date.toLocaleString('en-US', { timeZone }));
        truncatedDate.setHours(0, 0, 0, 0);

        if (truncatedDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (truncatedDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else if (truncatedDate.getTime() > lastWeek.getTime()) {
            const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = truncatedDate.getDay();
            return weekdayNames[dayOfWeek];
        } else {
            return format(truncatedDate, 'EEEE MMMM d, yyyy');
        }
    }

    /**
     * Formats the future time based on the provided date and time, using the specified time zone.
     * @param dateTime The future date and time.
     * @param timeZone The time zone to use for formatting.
     * @return The formatted future time.
     */
    public static futureWithTimezone(dateTime: string | Date, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
        const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        const now = new Date(new Date().toLocaleString('en-US', { timeZone }));
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
     * Formats the time based on the provided date and time, using the specified time zone.
     * @param dateTime The date and time to format.
     * @param timeZone The time zone to use for formatting.
     * @return The formatted time.
     */
    public static timeWithTimezone(dateTime: string | Date, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
        const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone,
        }).format(date);
    }

    /**
     * Formats the day based on the provided date and time, using the specified time zone.
     * @param dateTime The date and time to format.
     * @param timeZone The time zone to use for formatting.
     * @return The formatted day.
     */
    public static dayWithTimezone(dateTime: string | Date | null, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
        if (dateTime) {
            const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
            const localizedDate = new Date(date.toLocaleString('en-US', { timeZone }));
            if (isToday(localizedDate)) {
                return `Today, ${TimeUtils.timeWithTimezone(localizedDate, timeZone)}`;
            } else if (isYesterday(localizedDate)) {
                return `Yesterday, ${TimeUtils.timeWithTimezone(localizedDate, timeZone)}`;
            } else {
                return new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone,
                }).format(localizedDate);
            }
        } else {
            return '';
        }
    }
}