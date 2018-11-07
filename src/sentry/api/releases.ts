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

    /**
     * Create a Deploy
     * @param organizationSlug
     * @param version
     */
    public async createDeploy (organizationSlug: string, version: string, deployParam: Types.IDeployParam)
    : Promise<Types.IHttpResponse<Types.IProject[]>> {
        return axiosRequest<Types.IProject[]>({
            baseURL: this.baseUrl,
            data: deployParam,
            headers: {
                Authorization: this.authToken
            },
            method: 'POST',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/deploys`,
        });
    }

    /**
     * Delete an Organization Release's File
     * @param organizationSlug
     * @param version
     * @param fileId
     */
    public async deleteReleaseFile (organizationSlug: string, version: string, fileId: string)
    : Promise<Types.IHttpResponse<Types.IProject[]>> {
        return axiosRequest<Types.IProject[]>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'DELETE',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/files/${fileId}/`,
        });
    }
    /**
     * Update an Organization's Release
     */
    public async updateRelease (organizationSlug: string, version: string)
    : Promise<Types.IHttpResponse<Types.IOrgReleaseVersion>> {
        return axiosRequest<Types.IOrgReleaseVersion>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'PUT',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/`,
        });
    }
}
