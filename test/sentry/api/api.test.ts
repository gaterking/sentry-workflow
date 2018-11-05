/**
 * apiBase.ts
 */
import assert = require('assert');
import path from 'path';
import {ApiBase} from 'sentry/api/apiBase';
import {Organizations, Projects, Teams} from 'sentry/api/index';
import {IError, IHttpError, IProject} from 'sentry/api/types';

const rcFile = './sentryapi_mock.config.js';
describe('sentry.api', () => {
    describe('apiBase', () => {
        it.skip('should constructor', () => {
            const api: ApiBase = new ApiBase(path.join(__dirname, rcFile));
            assert(api.baseUrl === 'https://sentry.io');
            // tslint:disable-next-line:max-line-length
            assert(api.authToken === 'Bearer f960ff08339746bea5bc0232b5e475962e111d73b26a46e097636e6469e7e46c');
        }).timeout(60000);

        it.skip('should get version', async () => {
            const api: ApiBase = new ApiBase(path.join(__dirname, rcFile));
            const apiInfo = await api.apiInfo();
            assert(apiInfo !== undefined);
            if (apiInfo) {
                assert(apiInfo.version === '0');
            }
        }).timeout(60000);
    });

    describe('teams', () => {
        it.skip('should list projectList', async () => {
            const teamApi: Teams = new Teams(path.join(__dirname, rcFile));
            const result = await teamApi.listProjects('gaterking', '404');
            assert((result as IProject[]).length > 0);
        }).timeout(60000);

        it.skip('should create new project', async () => {
            const teamApi: Teams = new Teams(path.join(__dirname, rcFile));
            const result = await teamApi.createNewProject('gaterking', '404', 'ut0');
            assert((result as IProject).name === 'ut0');
        }).timeout(60000);

        it.skip('should update project', async () => {
            const projectsApi: Projects = new Projects(path.join(__dirname, rcFile));
            const result = await projectsApi.UpdateProject('gaterking', '404', {
                platform: 'javascript-vue'
            });
            assert((result as IProject).platform === 'javascript-vue');
        }).timeout(60000);

        it.skip('should delete project', async () => {
            const projectsApi: Projects = new Projects(path.join(__dirname, rcFile));
            const result = await projectsApi.DeleteProject('gaterking', 'ut0-v5');
            assert((result as IHttpError).code === 204);
        }).timeout(60000);
    });

    describe('organizations', () => {
        it.skip('should list projectList', async () => {
            const orgApi: Organizations = new Organizations(path.join(__dirname, rcFile));
            const result = await orgApi.listProjects('gaterking');
            assert((result as IProject[]).length > 0);
        }).timeout(60000);
    });
});
