"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_progress_1 = __importDefault(require("cli-progress"));
const form_data_1 = __importDefault(require("form-data"));
const mz_1 = require("mz");
const apiBase_1 = require("./apiBase");
const axiosRequest_1 = require("./axiosRequest");
class Projects extends apiBase_1.ApiBase {
    async listProjects() {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            url: `/api/0/projects/`,
        });
    }
    async UpdateProject(organizationSlug, projectSlug, updateData) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            data: updateData,
            headers: {
                Authorization: this.authToken
            },
            method: 'PUT',
            url: `/api/0/projects/${organizationSlug}/${projectSlug}/`
        });
    }
    async DeleteProject(organizationSlug, projectSlug) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'DELETE',
            url: `/api/0/projects/${organizationSlug}/${projectSlug}/`
        });
    }
    async UploadProjectFiles(organizationSlug, projectSlug, version, files) {
        const results = [];
        const uploadBar = new cli_progress_1.default.Bar({
            format: 'uploading [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
        }, cli_progress_1.default.Presets.shades_classic);
        uploadBar.start(files.length, 0);
        let fileIndex = 0;
        for (const file of files) {
            console.log(`\r\nuploading: ${file.file}`);
            uploadBar.update(fileIndex + 1);
            const fileFormData = new form_data_1.default();
            fileFormData.append('header ', file.header);
            fileFormData.append('dist', file.dist || '');
            fileFormData.append('name', file.name);
            fileFormData.append('file', mz_1.fs.readFileSync(file.file).toString(), {
                filename: file.name,
            });
            const uploadResult = await axiosRequest_1.request({
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
                results.push(uploadResult.data);
            }
            console.log(`\r\nuploaded: ${uploadResult.success ? 'success' : uploadResult.text}`);
            fileIndex = fileIndex + 1;
        }
        uploadBar.stop();
        return results;
    }
}
exports.Projects = Projects;
