import {ApiBase} from './apiBase';
/**
 * sentry api Teams
 */
interface IListProjectsResponse {
    dateCreated: string; // "2018-09-20T15:47:56.723Z"
    name: string;
}
export class Teams extends ApiBase {
    /**
     * 获取项目列表
     */
    public async listProjectsByTeam (organizationSlug: string,
                                     teamSlug: string
    ): Promise<IListProjectsResponse[] | void> {
        return this.request<IListProjectsResponse[]>(`/api/0/teams/${organizationSlug}/${teamSlug}/projects/`);
    }
}
