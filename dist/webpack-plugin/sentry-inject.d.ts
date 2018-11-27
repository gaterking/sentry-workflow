interface ISentryInjectOption {
    useRaven: boolean;
    dsn: string;
    libPath: string;
    config: string;
    version: string;
    env: string;
    sampleRate: number;
}
declare class SentryInjectWebpackPlugin {
    private useRaven;
    private dsn;
    private libPath;
    private projectName;
    private version;
    private sampleRate;
    private env;
    private commentRegex;
    private tmpl;
    constructor(option: ISentryInjectOption);
    apply(compiler: any): void;
}
export default SentryInjectWebpackPlugin;
