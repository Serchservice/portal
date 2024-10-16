import { ConnectifyException } from "@serchservice/connectify";
import { Notify } from "@serchservice/web-ui-kit";
import { AccountStatuses } from "../layouts/Interfaces";

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

    static accountStatuses = (): AccountStatuses[] => [
        { key: "Active", value: "ACTIVE", word: "Activate" },
        { key: "Suspended", value: "SUSPENDED", word: "Suspend" },
        { key: "Deactivated", value: "DEACTIVATED", word: "Deactivate" },
    ]
}

export interface IconInfo {
    icon: string;
    color: string;
}

export default Utils;