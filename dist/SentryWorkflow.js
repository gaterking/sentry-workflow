"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = __importDefault(require("@sentry/cli"));
const helper = __importStar(require("@sentry/cli/js/helper"));
const sourcemapHelper_1 = require("./sourcemapHelper");
/**
 * sentry cli发布流程封装
 */
class SentryWorkflow {
    constructor(options = { configFile: './.sentryclirc' }) {
        this.configFile = options.configFile;
        this.cliInstance = this.getSentryCli(this.configFile);
    }
    /**
     * 启动一次发布
     *
     * @param include 待发布的目录
     * @param releaseVersion 版本号，如果没有关联git，需要手动指定版本
     */
    async start(release, releaseVersion = '') {
        const waitForRelease = await sourcemapHelper_1.buildSourceURL(release.include, release.sourceMapPath, release.publishBase, release.urlPrefix);
        const targetVersion = await this.getReleasePromise(releaseVersion);
        await this.cliInstance.releases.new(targetVersion);
        // tslint:disable-next-line:no-http-string
        const uploadPrfix = release.urlPrefix.startsWith('http://') ? release.urlPrefix : `~${release.urlPrefix || '/'}`;
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
    async deploy(releaseVersion, env) {
        return helper.execute(['releases', 'deploys', releaseVersion, 'new', '-e', `${env}`], false);
    }
    /**
     * 删除指定版本的文件
     * @param releaseVersion 版本号
     */
    async deleteAll(releaseVersion) {
        helper.execute(['releases', 'files', releaseVersion, 'delete', '--all'], false);
    }
    getSentryCli(configFile) {
        return new cli_1.default(configFile || this.configFile);
    }
    /**
     * 获取当前版本号
     */
    async getReleasePromise(releaseVersion) {
        return (releaseVersion
            ? Promise.resolve(releaseVersion)
            : this.cliInstance.releases.proposeVersion()).then((version) => { return version.trim(); });
    }
}
exports.SentryWorkflow = SentryWorkflow;
