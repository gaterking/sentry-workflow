"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiBase_1 = require("./apiBase");
const axiosRequest_1 = require("./axiosRequest");
class Releases extends apiBase_1.ApiBase {
    async createNewRelease(organizationSlug, releaseParam) {
        console.log(`\r\ncreate new release: ${organizationSlug} ${releaseParam.version}`);
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            data: releaseParam,
            headers: {
                Authorization: this.authToken
            },
            method: 'POST',
            url: `/api/0/organizations/${organizationSlug}/releases/`,
        });
    }
    async createDeploy(organizationSlug, version, deployParam) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            data: deployParam,
            headers: {
                Authorization: this.authToken
            },
            method: 'POST',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/deploys/`,
        });
    }
    async ListDeploys(organizationSlug, version) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'GET',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/deploys/`,
        });
    }
    async deleteReleaseFile(organizationSlug, version, fileId) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'DELETE',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/files/${fileId}/`,
        });
    }
    async updateRelease(organizationSlug, version) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'PUT',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/`,
        });
    }
    async listReleaseFiles(organizationSlug, version) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'GET',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/files/`,
        });
    }
    async DeleteRelease(organizationSlug, version) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            method: 'DELETE',
            url: `/api/0/organizations/${organizationSlug}/releases/${version}/`,
        });
    }
}
exports.Releases = Releases;
