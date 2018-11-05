export interface IHttpError {
    code: number;
    text: string;
    data?: {
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
    dist: string;
    file: string;
    header: string;
}
