/**
 * SentryWorkflow.ts
 */
import assert = require('assert');
import path from 'path';
import { Types } from 'sentry/api';
import {SentryWorkflow} from 'SentryWorkflow';

describe('SentryWorkflow', () => {
    it.skip('should new a project', async () => {
        const sentryWf = new SentryWorkflow({
            apiConfigFile: path.join(__dirname, '/sentry/api/sentryapi_mock.config.js'),
            configFile: ''
        });
        const result = await sentryWf.newProject('gaterking', '404', 'ut5', 'ut5' , Types.EnumPlatform.node);
        assert(result === undefined);
    }).timeout(20000);

    it.skip('should start a release', async () => {
        const sentryWf = new SentryWorkflow({
            apiConfigFile: path.join(__dirname, '/sentry/api/sentryapi_mock.config.js'),
            configFile: ''
        });
        const result = await sentryWf.start({
            include: ['js'],
            org: 'gaterking',
            project: 'testdemo-k0',
            publishBase: path.resolve(__dirname, '../sample/dist'),
            sourceMapPath: 'sourcemap',
            urlPrefix: '/hd/all3/18108-lock-selector/'
        }, 'test2');
        assert(result);
    }).timeout(20000);

    it.skip('should delete a release files', async () => {
        const sentryWf = new SentryWorkflow({
            apiConfigFile: path.join(__dirname, '/sentry/api/sentryapi_mock.config.js'),
            configFile: ''
        });
        const result = await sentryWf.deleteVersionFiles('gaterking', 'test2');
        assert(result);
    }).timeout(20000);

    it.skip('should delete a release', async () => {
        const sentryWf = new SentryWorkflow({
            apiConfigFile: path.join(__dirname, '/sentry/api/sentryapi_mock.config.js'),
            configFile: ''
        });
        const result = await sentryWf.deleteRelease('gaterking', 'test2');
        assert(result);
    }).timeout(20000);

    it.skip('should create a deploy', async () => {
        const sentryWf = new SentryWorkflow({
            apiConfigFile: path.join(__dirname, '/sentry/api/sentryapi_mock.config.js'),
            configFile: ''
        });
        const result = await sentryWf.deploy('gaterking', 'test3', 'test');
        assert(result);
    }).timeout(20000);
});
