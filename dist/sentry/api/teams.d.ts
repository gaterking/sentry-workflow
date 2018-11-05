import { ApiBase } from './apiBase';
interface IListProjectsResponse {
    dateCreated: string;
    name: string;
}
export declare class Teams extends ApiBase {
    /**
     * 获取项目列表
     */
    listProjectsByTeam(org: string, team: string): Promise<IListProjectsResponse[] | void>;
}
export {};
