import cli from '@sentry/cli';
import * as helper from '@sentry/cli/js/helper';
import {SentryCliPlugin} from 'types/SentryCliPlugin';
import {buildSourceURL} from './sourcemapHelper';
/**
 * sentry cli发布流程封装
 */
class SentryWorkflow {
    private cliInstance: cli;
    private configFile: string;
    constructor(options: SentryCliPlugin.IWorkflowOption = { configFile: './.sentryclirc' }) {
        this.configFile = options.configFile;
        this.cliInstance = this.getSentryCli(this.configFile);
    }
    /**
     * 启动一次发布
     *
     * @param include 待发布的目录
     * @param releaseVersion 版本号，如果没有关联git，需要手动指定版本
     */
    public async start(release: SentryCliPlugin.IReleaseOption, releaseVersion: string = ''): Promise<void> {
        const waitForRelease: string = await buildSourceURL(release.include, release.sourceMapPath, release.publishBase, release.urlPrefix);
        const targetVersion: string = await this.getReleasePromise(releaseVersion);
        await this.cliInstance.releases.new(targetVersion);
        // tslint:disable-next-line:no-http-string
        const uploadPrfix: string = release.urlPrefix.startsWith('http://') ? release.urlPrefix : `~${release.urlPrefix || '/'}`;
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
    public async deploy(releaseVersion: string, env: string): Promise<string> {
        return helper.execute(['releases', 'deploys', releaseVersion, 'new', '-e', `${env}`], false);
    }

    /**
     * 删除指定版本的文件
     * @param releaseVersion 版本号
     */
    public async deleteAll(releaseVersion: string): Promise<void> {
        helper.execute(['releases', 'files', releaseVersion, 'delete', '--all'], false);
    }

    private getSentryCli(configFile: string): cli {
        return new cli(configFile || this.configFile);
    }
    /**
     * 获取当前版本号
     */
    private async getReleasePromise(releaseVersion: string): Promise<string> {
        return (releaseVersion
            ? Promise.resolve(releaseVersion)
            : this.cliInstance.releases.proposeVersion()).then((version: string) => { return version.trim(); });
    }
}
export { SentryWorkflow };
