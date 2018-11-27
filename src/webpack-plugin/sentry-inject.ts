import getConf from '../sentry/api/getConf';
interface ISentryInjectOption {
    useRaven: boolean;
    dsn: string;
    libPath: string;
    config: string;
    version: string;
    env: string;
    sampleRate: number;
}

class SentryInjectWebpackPlugin {
    private useRaven: boolean;
    private dsn: string;
    private libPath: string;
    private projectName: string = '';
    private version: string;
    private sampleRate: number = 0.1;
    private env: string = 'dev';
    private commentRegex = /<!-- js:sentry -->/;
    private tmpl = '';
    constructor (option: ISentryInjectOption) {
      const {useRaven = false, dsn = '', libPath = '', version = '', env = '', sampleRate = 0 } = option;
      const {config = ''} = option;
      const configInFile = getConf(config);
      this.useRaven = useRaven || configInFile.useRaven;
      this.dsn = dsn || configInFile.dsn;
      this.libPath = libPath || configInFile.libPath;
      this.projectName = configInFile.projectName || this.projectName;
      this.sampleRate = sampleRate || configInFile.sampleRate || this.sampleRate;
      this.version = version;
      this.env = env;

      if (this.useRaven) {
          this.tmpl = `<script src=\"${this.libPath}\" crossorigin=\"anonymous\"></script>
          <script>Raven.config(\'${this.dsn}\', {
            release: \'${this.projectName}@${this.version}\', // 版本号，与发布流程相匹配
            environment: \'${this.env}\', // 自定义环境，prod|test|t1|t2|dev|staging，与发布流程相匹配
            sampleRate: ${this.sampleRate}, // 前端采样率，随机10%，0.1~1.0
          }).install();</script>`;
      } else {
          // tslint:disable-next-line:max-line-length
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

    public apply (compiler) {
      compiler.hooks.compilation.tap('SentryInjectWebpackPlugin', (compilation) => {
          compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlWebpackInjectPlugin',
          (htmlPluginData, cb) => {
              htmlPluginData.html = htmlPluginData.html.replace(this.commentRegex, this.tmpl);
              return cb(null, htmlPluginData);
          });
      });
    }
}
export default SentryInjectWebpackPlugin;
