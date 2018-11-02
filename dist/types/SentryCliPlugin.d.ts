export declare namespace SentryCliPlugin {
    /**
     * SentryCliPlugin
     */
    interface IWorkflowOption {
        /**
         * 制定配置文件路径
         */
        configFile: string;
    }
    interface IReleaseOption {
        /**
         * 待发布目录集合
         */
        include: string[];
        /**
         * 待发布source map目录，用于搜索关联js对应的source map文件
         */
        sourceMapPath: string;
        /**
         * 待发布根目录
         */
        publishBase: string;
        /**
         * url前置，默认空字符串，以/根目录开始
         * 需要根据CND地址进行重定向
         */
        urlPrefix: string;
    }
}
