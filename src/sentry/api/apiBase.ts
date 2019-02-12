/**
 * Sentry API基类
 */
import {request as axiosRequest} from './axiosRequest';
import getConf, {IConfSentryApi} from './getConf';
import { IApiInfo, IHttpResponse } from './types';

export class ApiBase {
    public authToken: string;
    public baseUrl: string;
    private conf: IConfSentryApi;
    constructor (confFile: string = './sentryapirc') {
        this.conf = getConf(confFile);
        this.baseUrl = this.conf.baseUrl;
        const authTokenData: string = this.conf.token; // authTokenbuff.toString('base64');
        this.authToken = `Bearer ${authTokenData}`;
    }

    public async apiInfo (): Promise<IHttpResponse<IApiInfo>> {
        return axiosRequest<IApiInfo>({
            baseURL: this.baseUrl,
            url: '/api/0/',
        });
    }
}
