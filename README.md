# SentryWorkflow
## Summary
该库基于[sentry cli](https://github.com/getsentry/sentry-cli)进行封装，用于统一sentry版本发布流程，能够自动生成js和sourcemap的对应目录，并发布上传到sentry后台，与业务代码的发布无关。

## Installation
```bash
npm install @fe-sentry/sentry-workflow --save-dev
```

## Usage
~~项目根目录新建一份[.sentryclirc](https://docs.sentry.io/learn/cli/configuration/)的配置文件，用于配置sentry cli相关信息~~

```bash
# .sentryclirc 该方式已废弃，请使用.sentryapi.config.js
[defaults]
url=http://fetrack.mail.163.com
org=fee
project=sentry-demo

[auth]
token=24f18b37d23042cab3601e97c53915cca945ed5c1cff4d1ebdf0ae2
```

项目根目录新建一份sentryapi.config.js的配置文件，用于配置sentry web api相关信息
```javascript
# sentryapi.config.js
module.exports = {
    token: '93871506267c4f1ca15b3680a1915205aa5662e0193f45cd846367c6ef931355', // api key，非auth token
    org: 'gaterking', // 项目在sentry上定义的名称
    baseUrl: 'http://fetrack.mail.163.com',
    // 以下参数在使用SentryInjectWebpackPlugin有效
    dsn: 'https://2764c4ae56a644e5b34c9e7ddc4bc3ee@fetrack.mail.163.com/196614', // 项目在sentry上的DSN
    useRaven: false, // 是否使用raven库
    libPath: 'https://mimg.126.net/hd/lib/track/bundle-4.3.0.min.js', // snetry前端库地址，区分sentry库和raven库（支持IE8）
    projectName: '404_mobile', // 项目名称，与sentry定义无关
    sampleRate: 0.1 // 采样率
};
```

在sentry上创建发布版本，将待发布的代码上传关联到该版本
```javascript
import {SentryWorkflow, SentryInjectWebpackPlugin} from '@fe-sentry/sentry-workflow';
var wf = new SentryWorkflow({configFile: './.sentryclirc'});

wf.start({
            org: 'fee',
            project: 'mail',
            include: ['js'],
            sourceMapPath: 'sourcemap',
            publishBase: path.resolve(__dirname, 'dist'),
            urlPrefix: '/hd/all3/18108-lock-selector/'
        },
         'project@version-0').then(() => {
});

```

## API
### .start({include, sourceMapPath, publishBase，urlPrefix}, releaseVersion): Promise<void>
启动一个发布流程，完成release new, uploadSourceMaps, finalize，执行成功后会在publishBase生成sentry文件夹，改文件夹的内容会自动上传到sentry服务器，该流程不包含上传线上CDN的流程。

* include <string[]> js目录，相对于publishBase
* sourceMapPath <string> sourcemap目录，相对于publishBase
* publishBase <string> 待发布文件根目录（dist）绝对地址
* urlPrefix <string> url地址根地址，不包含host，即/**/*/
* releaseVersion <string> 自定义的发布版本号，建议使用[projectName@version]格式
* return Promise<void>

### .deleteAll(releaseVersion): Promise<void>
删除指定版本的所有文件

* releaseVersion <string> 待删除的发布版本号

### .deploy(releaseVersion, env)
通知sentry版本部署，即指定该版本已部署到生产、测试、开发等环境

* releaseVersion <string> 部署的版本号
* env <string> 环境变量

### .newProject (orgSlug: string, teamSlug: string, projectName: string, projectSlug: string, platform: Types.EnumPlatform = Types.EnumPlatform.js)
创建新的项目

## [发布流程](docs/Sentry版本流程.md)
