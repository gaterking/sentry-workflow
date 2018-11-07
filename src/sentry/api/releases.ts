import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import { Types } from './index';
import { IHttpResponse } from './types';

export class Releases extends ApiBase {
    /**
     * Create a New Release for an Organization
     * @param organizationSlug
     */
    public async createNewRelease (organizationSlug: string, releaseParam: Types.IReleaseParam)
        : Promise<Types.IHttpResponse<Types.IProject[]>> {
        // tslint:disable-next-line:no-console
        console.log(`\r\ncreate new release: ${organizationSlug} ${releaseParam.version}`);
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
        : Promise<Types.IHttpResponse<any>> {
        return axiosRequest<any>({
            baseURL: this.baseUrl,
            data: deployParam,
            headers: {
                Authorization: this.authToken
            },
            method: 'POST',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/deploys/`,
        });
    }

    /**
     * List a Release's Deploys
     * @param organizationSlug
     * @param version
     */
    public async ListDeploys (organizationSlug: string, version: string)
        : Promise<Types.IHttpResponse<any>> {
        return axiosRequest<any>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'GET',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/deploys/`,
        });
    }

    /**
     * Delete an Organization Release's File
     * @param organizationSlug
     * @param version
     * @param fileId
     */
    public async deleteReleaseFile (organizationSlug: string, version: string, fileId: string)
    : Promise<Types.IHttpResponse<any>> {
        return axiosRequest<any>({
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

    /**
     * List an Organization Release's Files
     *
     */
    public async listReleaseFiles (organizationSlug: string, version: string)
        : Promise<IHttpResponse<Types.IReleaseFile[]>> {
        return axiosRequest<Types.IReleaseFile[]>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'GET',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/files/`,
        });
    }

    /**
     * Delete an Organization's Release
     *
     */
    public async DeleteRelease (organizationSlug: string, version: string) {
        return axiosRequest<any>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'DELETE',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/`,
        });
    }
}
