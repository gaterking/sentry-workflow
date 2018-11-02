import { SentryCliPlugin } from 'types/SentryCliPlugin';
/**
 * sentry cli发布流程封装
 */
declare class SentryWorkflow {
    private cliInstance;
    private configFile;
    constructor(options?: SentryCliPlugin.IWorkflowOption);
    /**
     * 启动一次发布
     *
     * @param include 待发布的目录
     * @param releaseVersion 版本号，如果没有关联git，需要手动指定版本
     */
    start(release: SentryCliPlugin.IReleaseOption, releaseVersion?: string): Promise<void>;
    /**
     * 通知sentry版本已经部署
     * @param releaseVersion 版本号
     * @param env 环境变量，相同的版本可以有不同的环境变量用于区分,prod/dev/test
     */
    deploy(releaseVersion: string, env: string): Promise<string>;
    /**
     * 删除指定版本的文件
     * @param releaseVersion 版本号
     */
    deleteAll(releaseVersion: string): Promise<void>;
    private getSentryCli;
    /**
     * 获取当前版本号
     */
    private getReleasePromise;
}
export { SentryWorkflow };
