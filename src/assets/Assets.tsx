class AssetInstance {
    get serch() {
        return {
            logoWhite: new URL("./logos/light.png", import.meta.url).href,
            logoBlack: new URL("./logos/dark.png", import.meta.url).href,
            tagWhite: new URL("./logos/tagWhite.png", import.meta.url).href,
            tagBlack: new URL("./logos/tagBlack.png", import.meta.url).href,
        }
    };

    get auth() {
        return {
            administrator: new URL("./auth/administrator.png", import.meta.url).href,
            permission: new URL("./auth/permission.png", import.meta.url).href,
            invite: new URL("./auth/invite.jpg", import.meta.url).href,
            inviteVerify: new URL("./auth/inviteVerify.jpg", import.meta.url).href,
            login: new URL("./auth/login.jpg", import.meta.url).href,
            mfa: new URL("./auth/mfa.jpg", import.meta.url).href,
            password: new URL("./auth/password.jpg", import.meta.url).href,
            signup: new URL("./auth/signup.jpg", import.meta.url).href,
        }
    };

    get misc() {
        return {
            auth: new URL("./misc/auth.png", import.meta.url).href,
            error: new URL("./misc/error.png", import.meta.url).href,
            warning: new URL("./misc/warning.png", import.meta.url).href,
        }
    };

    get theme() {
        return {
            light: new URL("./theme/light.png", import.meta.url).href,
            dark: new URL("./theme/dark.png", import.meta.url).href,
        }
    };
}

const Assets = new AssetInstance()
export default Assets;