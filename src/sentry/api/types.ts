export interface IHttpResponse<T> {
    code: number;
    success: boolean;
    text: string;
    data?: T;
    errorData?: {
        detail: string
    };
}

export interface IError {
    detail: string;
    errorId: string;
}

export interface IProject {
    dateCreated: string; // "2018-09-20T15:47:56.723Z"
    name: string;
    slug: string;
    platform: EnumPlatform;
}

export enum EnumPlatform {
    js = 'javascript',
    vue = 'javascript-vue',
    node = 'node',
    rn = 'react-mative'
}

export interface IProjectUpdate {
    name?: string;
    slug?: string;
    team?: string;
    platform?: EnumPlatform;
    isBookmarked?: boolean;
    digestsMinDelay?: number;
    digestsMaxDelay?: number;
}

export interface IApiInfo {
    version: string;
}

export interface IReleaseParam {
    version: string;
    url?: string;
    projects: string[];
}

export interface IReleaseFile {
    name: string;
    /**
     * 像是DISTRIBUTION字段，不清楚用途，保持空
     */
    dist?: string;
    file: string;
    header: string;
}

export interface IUploadFileResult {
    id: string;
    name: string;
    sha1: string;
}

export interface IDeployParam {
    environment: string;
    /**
     * 部署命名
     */
    name?: string;
    /**
     * the optional url that points to the deploy
     */
    url?: string;
    dateStarted?: string;
    dateFinished?: string;
}
