// import cli from '@sentry/cli';
// import * as helper from '@sentry/cli/js/helper';
import find from 'find';
import path from 'path';
import {Projects, Releases, Teams , Types} from './sentry/api';
import { IReleaseFile } from './sentry/api/types';
import {buildSourceURL} from './sourcemapHelper';
import * as SentryCliPlugin from './types/SentryCliPlugin';
import SentryInjectWebpackPlugin from './webpack-plugin/sentry-inject';
interface IFileInfo {
    /**
     * 原文件基路径
     */
    originBase: string;

    /**
     * 原文件路径
     */
    orignFile: string;
}

/**
 * sentry cli发布流程封装
 */
class SentryWorkflow {
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
        // this.cliInstance = this.getSentryCli(this.configFile);
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
     * @returns 是否发布成功
     */
    public async start (release: SentryCliPlugin.IReleaseOption, releaseVersion: string): Promise <boolean> {
        const waitForRelease: string = await buildSourceURL(release.include,
            release.sourceMapPath, release.publishBase, release.urlPrefix);
        const targetVersion: string = await this.getReleasePromise(releaseVersion);
        const uploadPrfix: string = release.urlPrefix.startsWith('http://') ?
         release.urlPrefix :
        `~${release.urlPrefix || '/'}`;
        // 使用sentry cli
        // await this.cliInstance.releases.new(targetVersion);
        // // tslint:disable-next-line:no-http-string
        // await this.cliInstance.releases.uploadSourceMaps(targetVersion, {
        //     include: [waitForRelease],
        //     urlPrefix: uploadPrfix,
        //     validate: true
        // });
        // await this.cliInstance.releases.finalize(targetVersion);

        // 使用API接口进行发布
        const releasesApi =  new Releases(this.apiConfigFile);
        const cnrResult = await releasesApi.createNewRelease(release.org, {
            projects: [release.project],
            version: targetVersion,
        });
        if (!cnrResult.success && cnrResult.errorData) {
            // tslint:disable-next-line:no-console
            console.error(cnrResult.errorData);
            return false;
        }
        const projectsApi = new Projects(this.apiConfigFile);
        const filesToUpload: IReleaseFile[] = (await this.findFiles([waitForRelease])).map((file) => {
            return {
                file: file.orignFile,
                header: 'Content-Type:text/plain; encoding=utf-8',
                name: path.join(uploadPrfix, file.orignFile.replace(file.originBase, '')).replace(/\\/g, '\/')
            };
        });
        const upfResult = await projectsApi.UploadProjectFiles(release.org,
            release.project,
            targetVersion,
            filesToUpload);
        return true;
        // releasesApi.updateRelease()
    }
    public async deploy (org: string, releaseVersion: string, env: string): Promise<boolean> {
        // return helper.execute(['releases', 'deploys', releaseVersion, 'new', '-e', `${env}`], false);
        const releasesApi =  new Releases(this.apiConfigFile);
        const deployResult = await releasesApi.createDeploy(org, releaseVersion, {
            environment: env
        });
        return deployResult.success;
    }
    /**
     * 删除指定版本所有文件
     * @param org
     * @param releaseVersion
     */
    public async deleteVersionFiles (org: string, releaseVersion: string): Promise<boolean> {
        // return helper.execute(['releases', 'files', releaseVersion, 'delete', '--all'], false);
        const releasesApi =  new Releases(this.apiConfigFile);
        // const re = new Projects(this.)
        const listFilesResult = await releasesApi.listReleaseFiles(org, releaseVersion);
        let files: IReleaseFile[] = [];
        if (listFilesResult && listFilesResult.data) {
            files = listFilesResult.data;
        }
        for (const file of files) {
            const fileDeleteResult = await releasesApi.deleteReleaseFile(org, releaseVersion, file.id || '');
        }
        return true;
    }

    /**
     * 删除版本
     * @param org
     * @param releaseVersion
     */
    public async deleteRelease (org: string, releaseVersion: string): Promise<boolean> {
        const releasesApi =  new Releases(this.apiConfigFile);
        const deleteResult = await releasesApi.DeleteRelease(org, releaseVersion);
        return deleteResult.success;
    }

    private findFiles (includes: string[]): Promise<IFileInfo[]> {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve) => {
            const files: IFileInfo[] = [];
            for (const folder of includes) {
                const filesInFolder = find.fileSync(/\.(js|js\.map)$/, folder);
                filesInFolder.forEach((file) => {
                    files.push({
                        originBase: folder,
                        orignFile: file
                    });
                });
            }
            resolve(files);
        });
    }

    /**
     * 获得最新版本号
     * 如果releaseVersion为空，应该从系统自动获取版本号，暂未实现
     * @param releaseVersion
     */
    private getReleasePromise (releaseVersion: string): Promise < string > {
        // return (releaseVersion
        //     ?   Promise.resolve(releaseVersion)
        //     : this.cliInstance.releases.proposeVersion()).then((version: string) => version.trim());
        return Promise.resolve(releaseVersion);
    }

    // private getSentryCli (configFile: string): cli {
    //     return new cli(configFile || this.configFile);
    // }
}
export {SentryWorkflow, SentryInjectWebpackPlugin};
