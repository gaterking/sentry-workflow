/**
 * Sentry API基类
 */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare class ApiBase {
    protected authToken: string;
    private axiosInstance;
    private conf;
    constructor(authToken: string, host: string, confFile?: string);
    protected request<T>(axiosConfig: AxiosRequestConfig): Promise<T | void>;
    protected handleResponse<T>(value: AxiosResponse<T>): T | void;
    private loadConfig;
}
