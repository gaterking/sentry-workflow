# SentryWorkflow
## Summary
该库基于[sentry cli](https://github.com/getsentry/sentry-cli)进行封装，用于统一sentry版本发布流程

## Installation
```bash
npm install sentry-workflow
```

## Usage
项目根目录新建一份[.sentryclirc](https://docs.sentry.io/learn/cli/configuration/)的配置文件，用于配置sentry相关信息

```bash
# .sentryclirc
[defaults]
url=http://fetrack.mail.163.com
org=fee
project=sentry-demo

[auth]
token=24f18b37d23042cab3601e97c53915cca945ed5c1cff4d1ebdf0ae2
```
在sentry上创建发布版本，将待发布的代码上传关联到该版本
```javascript
import {SentryWorkflow} from 'sentry-workflow';
var wf = new SentryWorkflow({configFile: './.sentryclirc'});

wf.start({
            include: ['js'],
            sourceMapPath: 'sourcemap',
            publishBase: path.resolve(__dirname, 'dist'),
            urlPrefix: '/hd/all3/18108-lock-selector/
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
