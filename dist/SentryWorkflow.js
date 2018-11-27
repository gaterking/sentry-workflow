"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_1 = __importDefault(require("find"));
const path_1 = __importDefault(require("path"));
const api_1 = require("./sentry/api");
const sourcemapHelper_1 = require("./sourcemapHelper");
const sentry_inject_1 = __importDefault(require("./webpack-plugin/sentry-inject"));
exports.SentryInjectWebpackPlugin = sentry_inject_1.default;
class SentryWorkflow {
    constructor(options = {
        apiConfigFile: './sentryapi.config.js',
        configFile: './.sentryclirc'
    }) {
        this.configFile = options.configFile;
        this.apiConfigFile = options.apiConfigFile;
    }
    async newProject(orgSlug, teamSlug, projectName, projectSlug, platform = api_1.Types.EnumPlatform.js) {
        const teamsApi = new api_1.Teams(this.apiConfigFile);
        const projectListResponse = await teamsApi.listProjects(orgSlug, teamSlug);
        if (!projectListResponse.success) {
            return projectListResponse.errorData ? projectListResponse.errorData.detail : projectListResponse.text;
        }
        const projectList = projectListResponse.data || [];
        let targetProject = null;
        for (const p of projectList) {
            if (p.slug === projectSlug) {
                targetProject = p;
                break;
            }
        }
        if (!targetProject) {
            const newProjecteResponse = await teamsApi.createNewProject(orgSlug, teamSlug, projectName, projectSlug);
            if (!newProjecteResponse.success) {
                return newProjecteResponse.errorData ? newProjecteResponse.errorData.detail : newProjecteResponse.text;
            }
            else if (newProjecteResponse.data) {
                targetProject = newProjecteResponse.data;
            }
        }
        if (targetProject) {
            const projectsApi = new api_1.Projects(this.apiConfigFile);
            const targetProjectResponse = (await projectsApi.UpdateProject(orgSlug, targetProject.slug, {
                platform
            }));
            if (!targetProjectResponse.success) {
                return targetProjectResponse.errorData ?
                    targetProjectResponse.errorData.detail : targetProjectResponse.text;
            }
            else if (targetProjectResponse.data) {
                targetProject = targetProjectResponse.data;
            }
        }
    }
    async start(release, releaseVersion) {
        const waitForRelease = await sourcemapHelper_1.buildSourceURL(release.include, release.sourceMapPath, release.publishBase, release.urlPrefix);
        const targetVersion = await this.getReleasePromise(releaseVersion);
        const uploadPrfix = release.urlPrefix.startsWith('http://') ?
            release.urlPrefix :
            `~${release.urlPrefix || '/'}`;
        const releasesApi = new api_1.Releases(this.apiConfigFile);
        const cnrResult = await releasesApi.createNewRelease(release.org, {
            projects: [release.project],
            version: targetVersion,
        });
        if (!cnrResult.success && cnrResult.errorData) {
            console.error(cnrResult.errorData);
            return false;
        }
        const projectsApi = new api_1.Projects(this.apiConfigFile);
        const filesToUpload = (await this.findFiles([waitForRelease])).map((file) => {
            return {
                file: file.orignFile,
                header: 'Content-Type:text/plain; encoding=utf-8',
                name: path_1.default.join(uploadPrfix, file.orignFile.replace(file.originBase, '')).replace(/\\/g, '\/')
            };
        });
        const upfResult = await projectsApi.UploadProjectFiles(release.org, release.project, targetVersion, filesToUpload);
        return true;
    }
    async deploy(org, releaseVersion, env) {
        const releasesApi = new api_1.Releases(this.apiConfigFile);
        const deployResult = await releasesApi.createDeploy(org, releaseVersion, {
            environment: env
        });
        return deployResult.success;
    }
    async deleteVersionFiles(org, releaseVersion) {
        const releasesApi = new api_1.Releases(this.apiConfigFile);
        const listFilesResult = await releasesApi.listReleaseFiles(org, releaseVersion);
        let files = [];
        if (listFilesResult && listFilesResult.data) {
            files = listFilesResult.data;
        }
        for (const file of files) {
            const fileDeleteResult = await releasesApi.deleteReleaseFile(org, releaseVersion, file.id || '');
        }
        return true;
    }
    async deleteRelease(org, releaseVersion) {
        const releasesApi = new api_1.Releases(this.apiConfigFile);
        const deleteResult = await releasesApi.DeleteRelease(org, releaseVersion);
        return deleteResult.success;
    }
    findFiles(includes) {
        return new Promise((resolve) => {
            const files = [];
            for (const folder of includes) {
                const filesInFolder = find_1.default.fileSync(/\.(js|js\.map)$/, folder);
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
    getReleasePromise(releaseVersion) {
        return Promise.resolve(releaseVersion);
    }
}
exports.SentryWorkflow = SentryWorkflow;
