import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import {IHttpError, IProject, IReleaseParam} from './types';

export class Releases extends ApiBase {
    /**
     * Create a New Release for an Organization
     * @param organizationSlug
     */
    public async createNewRelease (organizationSlug: string, releaseParam: IReleaseParam)
    : Promise<IProject[] | IHttpError> {
            return axiosRequest<IProject[]>({
                baseURL: this.baseUrl,
                data: releaseParam,
                headers: {
                    Authorization: this.authToken
                },
                method: 'POST',
                url: `/api/0/organizations/${organizationSlug}/releases/`,
            });
        }
}
