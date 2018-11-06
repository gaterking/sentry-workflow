import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import { Types } from './index';

export class Releases extends ApiBase {
    /**
     * Create a New Release for an Organization
     * @param organizationSlug
     */
    public async createNewRelease (organizationSlug: string, releaseParam: Types.IReleaseParam)
    : Promise<Types.IHttpResponse<Types.IProject[]>> {
            return axiosRequest<Types.IProject[]>({
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
