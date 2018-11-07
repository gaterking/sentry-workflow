import { ApiBase } from './apiBase';
import { Types } from './index';
import { IHttpResponse } from './types';
export declare class Releases extends ApiBase {
    createNewRelease(organizationSlug: string, releaseParam: Types.IReleaseParam): Promise<Types.IHttpResponse<Types.IProject[]>>;
    createDeploy(organizationSlug: string, version: string, deployParam: Types.IDeployParam): Promise<Types.IHttpResponse<any>>;
    ListDeploys(organizationSlug: string, version: string): Promise<Types.IHttpResponse<any>>;
    deleteReleaseFile(organizationSlug: string, version: string, fileId: string): Promise<Types.IHttpResponse<any>>;
    updateRelease(organizationSlug: string, version: string): Promise<Types.IHttpResponse<Types.IOrgReleaseVersion>>;
    listReleaseFiles(organizationSlug: string, version: string): Promise<IHttpResponse<Types.IReleaseFile[]>>;
    DeleteRelease(organizationSlug: string, version: string): Promise<Types.IHttpResponse<any>>;
}
