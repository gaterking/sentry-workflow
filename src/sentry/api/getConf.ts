import cosmiconfig from 'cosmiconfig';

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
export default function getConf (rcFile: string = ''): IConfSentryApi {
    const explorer = cosmiconfig('sentryapi');
    const {config = {}} = (rcFile ? explorer.loadSync(rcFile) : explorer.searchSync()) || {};
    const defaultConfig: IConfSentryApi = {
        baseUrl: '',
        dsn: '',
        libPath: '',
        org: '',
        projectName: '',
        sampleRate: 0.1,
        token: '',
        useRaven: false
    };
    return {
        ...defaultConfig,
        ...config
    };
}
