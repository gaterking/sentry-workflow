import cosmiconfig from 'cosmiconfig';

export interface IConfSentryApi {
    token: string;
    baseUrl: string;
}
export default function getConf (rcFile: string = ''): IConfSentryApi {
    const explorer = cosmiconfig('sentryapi');
    const {config = {}} = (rcFile ? explorer.loadSync(rcFile) : explorer.searchSync()) || {};
    const defaultConfig = {
        baseUrl: '',
        token: ''
    };
    return {
        ...defaultConfig,
        ...config
    };
  }
