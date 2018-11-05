"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiBase_1 = require("./apiBase");
/**
 * sentry api Teams
 */
const listProjectsUrl = '/api/0/teams/{organization_slug}/{team_slug}/projects/';
class Teams extends apiBase_1.ApiBase {
    /**
     * 获取项目列表
     */
    async listProjectsByTeam(org, team) {
        return this.request({
            url: listProjectsUrl,
            data: {
                organization_slug: org,
                team_slug: team
            },
            method: 'GET'
        });
    }
}
exports.Teams = Teams;
