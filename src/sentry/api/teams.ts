import axios, { AxiosPromise, AxiosResponse } from 'axios';
import {ApiBase} from './apiBase';
/**
 * sentry api Teams
 */
const listProjectsUrl: string = '/api/0/teams/{organization_slug}/{team_slug}/projects/';

interface IListProjectsResponse {
    dateCreated: string; // "2018-09-20T15:47:56.723Z"
    name: string;
}
export class Teams extends ApiBase {
    /**
     * 获取项目列表
     */
    public async listProjectsByTeam(org: string, team: string): Promise<IListProjectsResponse[] | void> {
        return this.request<IListProjectsResponse[]>({
            url: listProjectsUrl,
            data: {
                organization_slug: org,
                team_slug: team
            },
            method: 'GET'
        });
    }
}
