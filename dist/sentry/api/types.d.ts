export interface IHttpResponse<T> {
    code: number;
    success: boolean;
    text: string;
    data?: T;
    errorData?: {
        detail: string;
    };
}
export interface IError {
    detail: string;
    errorId: string;
}
export interface IProject {
    dateCreated: string;
    name: string;
    slug: string;
    platform: EnumPlatform;
}
export declare enum EnumPlatform {
    js = "javascript",
    vue = "javascript-vue",
    node = "node",
    rn = "react-mative"
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
    id?: string;
    name: string;
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
    name?: string;
    url?: string;
    dateStarted?: string;
    dateFinished?: string;
}
export interface IOrgReleaseVersion {
    url: string;
    dateReleased?: string;
}
