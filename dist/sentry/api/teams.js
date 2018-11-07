"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiBase_1 = require("./apiBase");
const axiosRequest_1 = require("./axiosRequest");
class Teams extends apiBase_1.ApiBase {
    async listProjects(organizationSlug, teamSlug) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            url: `/api/0/teams/${organizationSlug}/${teamSlug}/projects/`,
        });
    }
    async createNewProject(organizationSlug, teamSlug, name, slug) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            data: {
                name,
                slug
            },
            headers: {
                Authorization: this.authToken
            },
            method: 'POST',
            url: `/api/0/teams/${organizationSlug}/${teamSlug}/projects/`
        });
    }
}
exports.Teams = Teams;
