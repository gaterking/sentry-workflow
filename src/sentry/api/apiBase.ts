/**
 * Sentry API基类
 */
import fetch, { RequestInit } from 'node-fetch';
import { URL } from 'url';
import getConf, {IConfSentryApi} from './getConf';

interface IApiInfo {
    version: string;
}

export class ApiBase {
    public authToken: string;
    public baseUrl: string;
    private conf: IConfSentryApi;
    constructor (confFile: string = './sentryapirc') {
        // f960ff08339746bea5bc0232b5e475962e111d73b26a46e097636e6469e7e46c
        this.conf = getConf(confFile);
        this.baseUrl = this.conf.baseUrl;
        const authTokenData: string = this.conf.token; // authTokenbuff.toString('base64');
        this.authToken = `Bearer ${authTokenData}`;
    }

    public async apiInfo (): Promise<IApiInfo | void> {
        return this.request<IApiInfo>('/api/0', {
            method: 'get'
        }, false);
    }
    protected async request<T> (url: string, options: RequestInit = {}, withAuth: boolean = true ): Promise<T|void> {
        const fullUrl = new URL(url, this.baseUrl);

        // tslint:disable-next-line:no-console
        console.log(fullUrl.href);
        return fetch(fullUrl.href, {
            headers: {
                Authorization: withAuth ? this.authToken : ''
            },
            ...options
        }).then((res) => res.json())
        .catch((err) => {
            // tslint:disable-next-line:no-console
            console.error(err);
            return;
        });
    }
}
