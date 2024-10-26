import { ConnectifyException } from "@serchservice/connectify";
import { Notify } from "@serchservice/web-ui-kit";
import { AccountStatuses } from "../layouts/Interfaces";
import AppTheme from "../configuration/Theme";

class Utils {
    static showError(error: any) {
        Notify.error((error as ConnectifyException).message);
    }

    static clearRole(role: string): string {
        return role ? role.replaceAll("_", " ") : role
    }

    static getEnumKey = (value: string) => {
        return value.replaceAll(" ", "_").toUpperCase()
    }

    static getAccountStatusIconInfo = (type: string): IconInfo => {
        if (type.toUpperCase() === "ACTIVE") {
            return {
                icon: "solar:confetti-bold-duotone",
                color: "green"
            }
        } else if (type.toUpperCase() === "SUSPENDED") {
            return {
                icon: "solar:pause-circle-bold-duotone",
                color: "coral"
            }
        } else {
            return {
                icon: "solar:trash-bin-minimalistic-2-bold-duotone",
                color: "crimson"
            }
        }
    }

    static supportIconInfo = (value: string): IconInfo => {
        if (value.toUpperCase() === 'PENDING') {
            return {
                icon: "solar:bug-bold-duotone",
                color: AppTheme.error,
            }
        } else if (value.toUpperCase() === 'RESOLVED' || value.toUpperCase() === 'CLOSED') {
            return {
                icon: value.toUpperCase() === 'RESOLVED'
                    ? "solar:confetti-minimalistic-bold-duotone"
                    : "solar:inbox-line-bold-duotone",
                color: AppTheme.success
            }
        } else if (value.toUpperCase() === 'OPENED') {
            return {
                icon: "solar:folder-open-bold-duotone",
                color: AppTheme.pending
            }
        } else {
            return {
                icon: "solar:chat-square-arrow-bold",
                color: AppTheme.hint
            }
        }
    }

    static accountStatuses = (): AccountStatuses[] => [
        { key: "Active", value: "ACTIVE", word: "Activate" },
        { key: "Suspended", value: "SUSPENDED", word: "Suspend" },
        { key: "Deactivated", value: "DEACTIVATED", word: "Deactivate" },
    ]

    // Convert JSON to CSV format
    static jsonToCsv<T extends Record<string, any>>(json: T[]): string {
        const headers = Object.keys(json[0]);
        const csvRows = json.map(row =>
            headers.map(header => JSON.stringify(row[header], Utils.replacer)).join(',')
        );
        csvRows.unshift(headers.join(',')); // Add headers as the first row
        return csvRows.join('\r\n');
    }

    // Replace null values in JSON with empty string
    static replacer(key: string, value: any): any {
        return value === null ? key : value;
    }

    // Download a file with the given data, filename, and file type
    static downloadFile(data: string | Uint8Array, fileName: string, fileType: string): void {
        const blob = new Blob([data], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
    }

    static exportToCsv(data: any[], name: string): void {
        if(data.length === 0) {
            Notify.warning("There is no data to export")
            return
        } else {
            const csvData = Utils.jsonToCsv(data);
            Utils.downloadFile(csvData, `${name}.csv`, 'text/csv');
            return
        }
    }

    static exportToJson(data: any[], name: string): void {
        if(data.length === 0) {
            Notify.warning("There is no data to export")
            return
        } else {
            const jsonData = JSON.stringify(data, null, 2);
            Utils.downloadFile(jsonData, `${name}.json`, 'application/json');
            return
        }
    }
}

export interface IconInfo {
    icon: string;
    color: string;
}

export default Utils;