import { IApiInfo, IHttpResponse } from './types';
export declare class ApiBase {
    authToken: string;
    baseUrl: string;
    private conf;
    constructor(confFile?: string);
    apiInfo(): Promise<IHttpResponse<IApiInfo>>;
}
