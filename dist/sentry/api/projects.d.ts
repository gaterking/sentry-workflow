import { ApiBase } from './apiBase';
import { Types } from './index';
export declare class Projects extends ApiBase {
    listProjects(): Promise<Types.IHttpResponse<Types.IProject[]>>;
    UpdateProject(organizationSlug: string, projectSlug: string, updateData: Types.IProjectUpdate): Promise<Types.IHttpResponse<Types.IProject>>;
    DeleteProject(organizationSlug: string, projectSlug: string): Promise<Types.IHttpResponse<any>>;
    UploadProjectFiles(organizationSlug: string, projectSlug: string, version: string, files: Types.IReleaseFile[]): Promise<Types.IUploadFileResult[]>;
}
