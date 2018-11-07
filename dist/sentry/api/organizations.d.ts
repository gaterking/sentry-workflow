import { ApiBase } from './apiBase';
import { IHttpResponse, IProject } from './types';
export declare class Organizations extends ApiBase {
    listProjects(organizationSlug: string): Promise<IHttpResponse<IProject[]>>;
}
