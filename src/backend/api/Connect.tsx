import authStore from '../database/auth/AuthStore';
import { Notify } from '@serchservice/web-ui-kit';
import AuthRouting from '../../configuration/AuthRouting';
import Connectify, { ApiResponse, ConnectifyException } from "@serchservice/connectify"

interface ConnectProps {
    withAuth?: boolean;
    withError?: boolean;
}

class Connect {
    private withError: boolean;
    private api: Connectify;

    constructor(options: ConnectProps) {
        this.api = new Connectify({
            withAuth: options.withAuth,
            baseUrl: 'http://192.168.43.153:8080/api/v1',
            mode: "sandbox",
            withLog: true,
            session: authStore.read.session,
            defaultPath: AuthRouting.instance.login.path,
            onSessionUpdate: (session) => authStore.set(authStore.read.copyWith({ session: session }))
        })

        this.withError = options.withError ?? true;
    }

    private handleError(error: ConnectifyException) {
        if(this.withError) {
            Notify.error(error.message);
        }
    }

    public async get<T>(url: string): Promise<ApiResponse<T> | undefined> {
        try {
            return await this.api.get<T>(url);
        } catch (error) {
            this.handleError(error as ConnectifyException);
        }
    }

    public async post<T>(url: string, data: any): Promise<ApiResponse<T> | undefined> {
        try {
            return await this.api.post<T>(url, data);
        } catch (error) {
            this.handleError(error as ConnectifyException);
        }
    }

    public async patch<T>(url: string, data?: any): Promise<ApiResponse<T> | undefined> {
        try {
            return await this.api.patch<T>(url, data);
        } catch (error) {
            this.handleError(error as ConnectifyException);
        }
    }

    public async delete<T>(url: string, data?: any): Promise<ApiResponse<T> | undefined> {
        try {
            return await this.api.delete<T>(url, data);
        } catch (error) {
            this.handleError(error as ConnectifyException);
        }
    }
}

export default Connect;