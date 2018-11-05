import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import {IHttpError, IProject} from './types';
/**
 * sentry api Teams
 */

export class Teams extends ApiBase {
    /**
     * 获取项目列表
     */
    public async listProjects (organizationSlug: string,
                               teamSlug: string
    ): Promise<IProject[] | IHttpError> {
        // return this.request<IListProjectsResponse[]>(`/api/0/teams/${organizationSlug}/${teamSlug}/projects/`);
        return axiosRequest<IProject[]>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            url: `/api/0/teams/${organizationSlug}/${teamSlug}/projects/`,
        });
    }

    /**
     * Create a New Project
     */
    public async createNewProject (organizationSlug: string,
                                   teamSlug: string,
                                   name: string,
                                   slug?: string) {
        return axiosRequest<IProject>({
            baseURL: this.baseUrl,
            data: {
                name,
                slug
            },
            headers: {
                Authorization: this.authToken
            },
            method: 'POST',
            url: `/api/0/teams/${organizationSlug}/${teamSlug}/projects/`
        });
    }
}
