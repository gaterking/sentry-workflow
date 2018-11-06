import cli from '@sentry/cli';
import * as helper from '@sentry/cli/js/helper';
import {Projects, Teams, Types} from 'sentry/api';
import {buildSourceURL} from 'sourcemapHelper';
import * as SentryCliPlugin from 'types/SentryCliPlugin';
/**
 * sentry cli发布流程封装
 */
class SentryWorkflow {
    private cliInstance: cli;
    private configFile: string;
    private apiConfigFile: string;
    /**
     * 获取当前版本号
     */
    public constructor (options: SentryCliPlugin.IWorkflowOption = {
        apiConfigFile: './sentryapi.config.js',
        configFile: './.sentryclirc'
    }) {
        this.configFile = options.configFile;
        this.apiConfigFile = options.apiConfigFile;
        this.cliInstance = this.getSentryCli(this.configFile);
    }

    /**
     * 创建新的项目
     *
     * @param {string} orgSlug
     * @param {string} teamSlug
     * @param {string} project
     * @param {EnumPlatform} platform
     * @returns {Promise<void | string>} 返回空或错误日志
     * @memberof SentryWorkflow
     */
    public async newProject (orgSlug: string,
                             teamSlug: string,
                             projectName: string,
                             projectSlug: string,
                             platform: Types.EnumPlatform = Types.EnumPlatform.js)
    : Promise<string|void> {
        const teamsApi = new Teams(this.apiConfigFile);
        const projectListResponse = await teamsApi.listProjects(orgSlug, teamSlug);
        if (!projectListResponse.success) {
            return projectListResponse.errorData ?  projectListResponse.errorData.detail : projectListResponse.text;
        }
        const projectList = projectListResponse.data || [];
        let targetProject: Types.IProject | null = null;
        for (const p of projectList) {
            if (p.slug === projectSlug) {
                targetProject = p;
                break;
            }
        }
        if (!targetProject) {
            // 未建立项目
            const newProjecteResponse = await teamsApi.createNewProject(orgSlug, teamSlug, projectName, projectSlug);
            if (!newProjecteResponse.success) {
                return newProjecteResponse.errorData ? newProjecteResponse.errorData.detail : newProjecteResponse.text;
            } else if (newProjecteResponse.data) {
                targetProject = newProjecteResponse.data;
            }
        }
        if (targetProject) {
            const projectsApi = new Projects(this.apiConfigFile);
            const targetProjectResponse = (await projectsApi.UpdateProject(orgSlug, targetProject.slug, {
                platform
            }));
            if (!targetProjectResponse.success) {
                return targetProjectResponse.errorData ?
                targetProjectResponse.errorData.detail : targetProjectResponse.text;
            } else if (targetProjectResponse.data) {
                targetProject = targetProjectResponse.data;
                   }
            }
    }

    /**
     * 启动一次发布
     *
     * @param include 待发布的目录
     * @param releaseVersion 版本号，如果没有关联git，需要手动指定版本
     */
    public async start (release: SentryCliPlugin.IReleaseOption, releaseVersion: string = ''): Promise < void > {
        const waitForRelease: string = await buildSourceURL(release.include,
            release.sourceMapPath, release.publishBase, release.urlPrefix);
        const targetVersion: string = await this.getReleasePromise(releaseVersion);
        await this.cliInstance.releases.new(targetVersion);
        // tslint:disable-next-line:no-http-string
        const uploadPrfix: string = release.urlPrefix.startsWith('http://') ?
         release.urlPrefix :
        `~${release.urlPrefix || '/'}`;
        await this.cliInstance.releases.uploadSourceMaps(targetVersion, {
            include: [waitForRelease],
            urlPrefix: uploadPrfix,
            validate: true
        });
        await this.cliInstance.releases.finalize(targetVersion);
    }
    public deploy (releaseVersion: string, env: string): Promise < string > {
        return helper.execute(['releases', 'deploys', releaseVersion, 'new', '-e', `${env}`], false);
    }
    public deleteAll (releaseVersion: string): Promise<void> {
        return helper.execute(['releases', 'files', releaseVersion, 'delete', '--all'], false);
    }
public getReleasePromise (releaseVersion: string): Promise < string > {
        return (releaseVersion
            ?   Promise.resolve(releaseVersion)
            : this.cliInstance.releases.proposeVersion()).then((version: string) => version.trim());
    }

    private getSentryCli (configFile: string): cli {
        return new cli(configFile || this.configFile);
    }
}
export { SentryWorkflow };
