import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import {IHttpError, IProject} from './types';

export class Organizations extends ApiBase {
    /**
     * List an Organization’s Projects
     */
    public async listProjects (organizationSlug: string
    ): Promise<IProject[] | IHttpError> {
        // return this.request<IListProjectsResponse[]>(`/api/0/teams/${organizationSlug}/${teamSlug}/projects/`);
        return axiosRequest<IProject[]>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            url: `/api/0/organizations/${organizationSlug}/projects/`
        });
    }
}
