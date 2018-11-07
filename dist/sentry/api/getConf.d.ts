export interface IConfSentryApi {
    token: string;
    baseUrl: string;
}
export default function getConf(rcFile?: string): IConfSentryApi;
