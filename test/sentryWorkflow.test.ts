/**
 * SentryWorkflow.ts
 */
import assert = require('assert');
import path from 'path';
import { EnumPlatform } from 'sentry/api';
import {SentryWorkflow} from 'SentryWorkflow';

describe('SentryWorkflow', () => {
    it.only('should new a project', async () => {
        const sentryWf = new SentryWorkflow({
            apiConfigFile: path.join(__dirname, '/sentry/api/sentryapi_mock.config.js'),
            configFile: ''
        });
        const result = await sentryWf.newProject('gaterking', '404', 'ut5', 'ut5' , EnumPlatform.node);
        assert(result === undefined);
    }).timeout(20000);
});
