/**
 * Sentry API基类
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from 'config';

export class ApiBase {
    protected authToken: string;
    private axiosInstance: AxiosInstance;
    private conf: config.IConfig;
    constructor(authToken: string, host: string, confFile: string = './sentryapirc') {
        // f960ff08339746bea5bc0232b5e475962e111d73b26a46e097636e6469e7e46c
        this.conf = this.loadConfig(confFile);
        const authTokenbuff: Buffer = new Buffer(authToken);
        const authTokenData: string = authTokenbuff.toString('base64');
        this.authToken = `Bearer ${authTokenData}`;
        this.axiosInstance = axios.create({
            baseURL: host
        });
        this.axiosInstance.defaults.headers.common[`Authorization`] = authToken;
    }

    protected async request<T> (axiosConfig: AxiosRequestConfig): Promise<T|void> {
        return this.axiosInstance.request<T>({
            ...axiosConfig
        }).then((value: AxiosResponse<T>) => {
            return this.handleResponse(value);
        });
    }

    protected handleResponse<T> (value: AxiosResponse<T>): T|void {
        if (value.status === 200) {
            return value.data;
        } else {
            // tslint:disable-next-line:no-console
            console.error(`${value.status} ${value.statusText}`);

            return;
        }
    }

    private loadConfig (confFile: string) : config.IConfig {
        const confLoaded: config.IConfig = config.get(confFile);
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        this.authToken = this.conf.get('auth.token');

        return confLoaded;
    }
}
