import cli from '@sentry/cli';
import * as helper from '@sentry/cli/js/helper';
import {EnumPlatform, IHttpError, IProject, Projects, Teams} from 'sentry/api';
import {buildSourceURL} from 'sourcemapHelper';
import * as SentryCliPlugin from 'types/SentryCliPlugin';
/**
 * sentry cli发布流程封装
 */
class SentryWorkflow {
    private cliInstance: cli;
    private configFile: string;
    private apiConfigFile: string;
    constructor (options: SentryCliPlugin.IWorkflowOption = {
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
                             platform: EnumPlatform = EnumPlatform.js)
    : Promise<string|void> {
        const teamsApi = new Teams(this.apiConfigFile);
        let projectList = await teamsApi.listProjects(orgSlug, teamSlug);
        if (!(projectList instanceof Array)) {
            projectList = projectList as IHttpError;
            return projectList.data ?  projectList.data.detail : projectList.text;
        }
        projectList = projectList as IProject[];
        let targetProject: IProject | null = null;
        for (const p of projectList) {
            if (p.slug === projectSlug) {
                targetProject = p;
                break;
            }
        }
        if (!targetProject) {
            // 未建立项目
            const newProject = await teamsApi.createNewProject(orgSlug, teamSlug, projectName, projectSlug);
            if (newProject.hasOwnProperty('code')) {
                return (newProject as IHttpError).text;
            } else {
                targetProject = newProject as IProject;
                const projectsApi = new Projects(this.apiConfigFile);
                targetProject = (await projectsApi.UpdateProject(orgSlug, targetProject.slug, {
                    platform
                })) as IProject;
            }
        }
        return;
    }

    /**
     * 启动一次发布
     *
     * @param include 待发布的目录
     * @param releaseVersion 版本号，如果没有关联git，需要手动指定版本
     */
    public async start (release: SentryCliPlugin.IReleaseOption, releaseVersion: string = ''): Promise<void> {
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

    /**
     * 通知sentry版本已经部署
     * @param releaseVersion 版本号
     * @param env 环境变量，相同的版本可以有不同的环境变量用于区分,prod/dev/test
     */
    public async deploy (releaseVersion: string, env: string): Promise<string> {
        return helper.execute(['releases', 'deploys', releaseVersion, 'new', '-e', `${env}`], false);
    }

    /**
     * 删除指定版本的文件
     * @param releaseVersion 版本号
     */
    public async deleteAll (releaseVersion: string): Promise<void> {
        helper.execute(['releases', 'files', releaseVersion, 'delete', '--all'], false);
    }

    private getSentryCli (configFile: string): cli {
        return new cli(configFile || this.configFile);
    }
    /**
     * 获取当前版本号
     */
    private async getReleasePromise (releaseVersion: string): Promise<string> {
        return (releaseVersion
            ? Promise.resolve(releaseVersion)
            : this.cliInstance.releases.proposeVersion()).then((version: string) => version.trim());
    }
}
export { SentryWorkflow };
