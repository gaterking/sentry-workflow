import _cliProgress from 'cli-progress';
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
                                     files: Types.IReleaseFile[]): Promise<Types.IUploadFileResult[]> {
        const results: Types.IUploadFileResult[] = [];
        const uploadBar = new _cliProgress.Bar({
            format: 'uploading [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
        }, _cliProgress.Presets.shades_classic);
        uploadBar.start(files.length, 0);
        let fileIndex = 0;
        for (const file of files) {
            // tslint:disable-next-line:no-console
            console.log(`\r\nuploading: ${file.file}`);
            uploadBar.update(fileIndex + 1);
            const fileFormData = new FormData();
            fileFormData.append('header ', file.header);
            fileFormData.append('dist', file.dist || '');
            fileFormData.append('name', file.name);
            fileFormData.append('file', fs.readFileSync(file.file).toString(), {
                filename: file.name,
            });
            // const metadata = {
            //     header: file.header,
            //     name: file.name
            // };
            // const boundary = 'a00872e0400948cbba6812a0f09f6ba2';
            // // tslint:disable-next-line:max-line-length
            // let data = '';
            // tslint:disable-next-line:max-line-length
            // const testData = `--a00872e0400948cbba6812a0f09f6ba2\r\nContent-Disposition: form-data; name=\"header\"\r\n\r\nContent-Type:text/plain; encoding=utf-8\r\n--a00872e0400948cbba6812a0f09f6ba2\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n/demo/hello.py\r\n--a00872e0400948cbba6812a0f09f6ba2\r\nContent-Disposition: form-data; name=\"file\"; filename=\"hello.py\"\r\n\r\nprint \"Hello World!\"\r\n--a00872e0400948cbba6812a0f09f6ba2--\r\n`;
            // for (const i in metadata) {
            //     if ({}.hasOwnProperty.call(metadata, i)) {
            //         data += '--' + boundary + '\r\n';
            //         // Content-Type: application/javascript\r\n\r\n
            //         data += 'Content-Disposition: form-data; name="' + i + '"; \r\n\r\n' + metadata[i] + '\r\n';
            //     }
            // }
            // data += '--' + boundary + '\r\n';
            // // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:max-line-length
            // data += 'Content-Disposition: form-data; name="file"; filename="' + file.name + '\r\n\Content-Type: application/javascriptr\r\n\r\n';
            // data +=  fs.readFileSync(file.file).toString() + '\r\n';
            // data += '--' + boundary + '--\r\n';
            const uploadResult = await axiosRequest<Types.IUploadFileResult>({
                baseURL: this.baseUrl,
                data: fileFormData,
                headers: {
                    'Authorization': this.authToken,
                    'Content-Type': 'multipart/form-data;' + `boundary=${fileFormData.getBoundary()}`
                },
                method: 'POST',
                url: `/api/0/projects/${organizationSlug}/${projectSlug}/releases/${version}/files/`
            });
            if (uploadResult.success) {
                results.push(uploadResult.data as Types.IUploadFileResult);
            }
            // tslint:disable-next-line:no-console
            console.log(`\r\nuploaded: ${uploadResult.success ? 'success' : uploadResult.text}`);
            fileIndex = fileIndex + 1;
        }
        uploadBar.stop();
        return results;
    }
}
