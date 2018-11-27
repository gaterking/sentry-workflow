export interface IConfSentryApi {
    token: string;
    baseUrl: string;
    org: string;
    dsn: string;
    useRaven: boolean;
    libPath: string;
    projectName: string;
    sampleRate: number;
}
export default function getConf(rcFile?: string): IConfSentryApi;
