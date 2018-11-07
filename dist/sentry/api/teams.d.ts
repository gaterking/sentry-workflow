import { ApiBase } from './apiBase';
import { Types } from './index';
export declare class Teams extends ApiBase {
    listProjects(organizationSlug: string, teamSlug: string): Promise<Types.IHttpResponse<Types.IProject[]>>;
    createNewProject(organizationSlug: string, teamSlug: string, name: string, slug?: string): Promise<Types.IHttpResponse<Types.IProject>>;
}
