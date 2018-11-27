import { Types } from './sentry/api';
import * as SentryCliPlugin from './types/SentryCliPlugin';
import SentryInjectWebpackPlugin from './webpack-plugin/sentry-inject';
declare class SentryWorkflow {
    private configFile;
    private apiConfigFile;
    constructor(options?: SentryCliPlugin.IWorkflowOption);
    newProject(orgSlug: string, teamSlug: string, projectName: string, projectSlug: string, platform?: Types.EnumPlatform): Promise<string | void>;
    start(release: SentryCliPlugin.IReleaseOption, releaseVersion: string): Promise<boolean>;
    deploy(org: string, releaseVersion: string, env: string): Promise<boolean>;
    deleteVersionFiles(org: string, releaseVersion: string): Promise<boolean>;
    deleteRelease(org: string, releaseVersion: string): Promise<boolean>;
    private findFiles;
    private getReleasePromise;
}
export { SentryWorkflow, SentryInjectWebpackPlugin };
