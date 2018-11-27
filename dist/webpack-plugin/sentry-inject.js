"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getConf_1 = __importDefault(require("../sentry/api/getConf"));
class SentryInjectWebpackPlugin {
    constructor(option) {
        this.projectName = '';
        this.sampleRate = 0.1;
        this.env = 'dev';
        this.commentRegex = /<!-- js:sentry -->/;
        this.tmpl = '';
        const { useRaven = false, dsn = '', libPath = '', version = '', env = '', sampleRate = 0 } = option;
        const { config = '' } = option;
        const configInFile = getConf_1.default(config);
        this.useRaven = useRaven || configInFile.useRaven;
        this.dsn = dsn || configInFile.dsn;
        this.libPath = libPath || configInFile.libPath;
        this.projectName = configInFile.projectName || this.projectName;
        this.sampleRate = sampleRate || configInFile.sampleRate;
        this.version = version;
        this.env = env;
        if (this.useRaven) {
            this.tmpl = `<script src=\"${this.libPath}\" crossorigin=\"anonymous\"></script>
          <script>Raven.config(\'${this.dsn}\', {
            release: \'${this.projectName}@${this.version}\', // 版本号，与发布流程相匹配
            environment: \'${this.env}\', // 自定义环境，prod|test|t1|t2|dev|staging，与发布流程相匹配
            sampleRate: ${this.sampleRate}, // 前端采样率，随机10%，0.1~1.0
          }).install();</script>`;
        }
        else {
            this.tmpl = `<script src=\"${this.libPath}\" crossorigin=\"anonymous\"></script>
          <script>Sentry.init({
            dsn: \'${this.dsn}\',
            release: \'${this.projectName}@${this.version}\', // 版本号，与发布流程相匹配
            environment: \'${this.env}\', // 自定义环境，prod|test|t1|t2|dev|staging，与发布流程相匹配
            sampleRate: ${this.sampleRate}, // 前端采样率，随机10%，0.1~1.0
            // integrations: [new Sentry.Integrations.Vue({ Vue })] // 拦截Vue config.errorHandler事件，仅在Vue项目使用，其它框架请参考官方文档
          });</script>`;
        }
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('SentryInjectWebpackPlugin', (compilation) => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlWebpackInjectPlugin', (htmlPluginData, cb) => {
                htmlPluginData.html = htmlPluginData.html.replace(this.commentRegex, this.tmpl);
                return cb(null, htmlPluginData);
            });
        });
    }
}
exports.default = SentryInjectWebpackPlugin;
