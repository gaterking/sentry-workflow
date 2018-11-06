import FormData from 'form-data';
import { fs } from 'mz';
import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import { Types } from './index';
/**
 * sentry api Teams
 */

export class Projects extends ApiBase {
    /**
     * List your Projects
     */
    public async listProjects (): Promise<Types.IHttpResponse<Types.IProject[]>> {
        return axiosRequest<Types.IProject[]>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            url: `/api/0/projects/`,
        });
    }

    /**
     * Update a Project
     */
    public async UpdateProject (organizationSlug: string,
                                projectSlug: string,
                                updateData: Types.IProjectUpdate): Promise<Types.IHttpResponse<Types.IProject>> {
        return axiosRequest<Types.IProject>({
            baseURL: this.baseUrl,
            data: updateData,
            headers: {
                Authorization: this.authToken
            },
            method: 'PUT',
            url: `/api/0/projects/${organizationSlug}/${projectSlug}/`
        });
    }

    /**
     * Delete a Project
     */
    public async DeleteProject (organizationSlug: string,
                                projectSlug: string): Promise<Types.IHttpResponse<any>> {
        return axiosRequest<Types.IHttpResponse<any>>({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'DELETE',
            url: `/api/0/projects/${organizationSlug}/${projectSlug}/`
        });
    }

    /**
     * Upload a New Project Release File
     *
     */
    public async UploadProjectFiles (organizationSlug: string,
                                     projectSlug: string,
                                     version: string,
                                     files: Types.IReleaseFile[]) {
        for (const file of files) {
            const fileFormData = new FormData();
            fileFormData.append('name', file.name);
            fileFormData.append('file', fs.createReadStream(file.file));
            debugger;
            await axiosRequest<Types.IUploadFileResult>({
                baseURL: this.baseUrl,
                data: fileFormData,
                headers: {
                    Authorization: this.authToken
                },
                method: 'POST',
                url: `/api/0/projects/${organizationSlug}/${projectSlug}/releases/${version}/files/`
            });
        }
    }
}
