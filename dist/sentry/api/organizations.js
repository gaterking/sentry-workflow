"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiBase_1 = require("./apiBase");
const axiosRequest_1 = require("./axiosRequest");
class Organizations extends apiBase_1.ApiBase {
    async listProjects(organizationSlug) {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.authToken
            },
            url: `/api/0/organizations/${organizationSlug}/projects/`
        });
    }
}
exports.Organizations = Organizations;
