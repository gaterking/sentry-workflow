export interface IWorkflowOption {
    configFile: string;
    apiConfigFile: string;
}
export interface IReleaseOption {
    org: string;
    project: string;
    include: string[];
    sourceMapPath: string;
    publishBase: string;
    urlPrefix: string;
}
