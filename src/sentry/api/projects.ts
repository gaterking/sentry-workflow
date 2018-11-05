import {ApiBase} from './apiBase';
import {request as axiosRequest} from './axiosRequest';
import {IError, IHttpError, IProject, IProjectUpdate, IReleaseFile} from './types';
/**
 * sentry api Teams
 */

export class Projects extends ApiBase {
    /**
     * List your Projects
     */
    public async listProjects (): Promise<IProject[] | IHttpError> {
        return axiosRequest<IProject[]>({
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
                                updateData: IProjectUpdate) {
        return axiosRequest<IProject>({
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
                                projectSlug: string) {
        return axiosRequest<IError>({
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
                                     files: IReleaseFile[]) {
        for (const file of files) {
            await axiosRequest<IError>({
                baseURL: this.baseUrl,
                data: file,
                headers: {
                    Authorization: this.authToken
                },
                method: 'POST',
                url: `/api/0/projects/${organizationSlug}/${projectSlug}/releases/${version}/files/`
            });
        }
    }
}
