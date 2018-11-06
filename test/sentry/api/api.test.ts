/**
 * apiBase.ts
 */
import assert = require('assert');
import path from 'path';
import {Types} from 'sentry/api';
import {ApiBase} from 'sentry/api/apiBase';
import {Organizations, Projects, Releases, Teams} from 'sentry/api/index';
import { EnumPlatform } from 'sentry/api/types';

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
            assert(apiInfo.success);
            if (apiInfo.data) {
                assert(apiInfo.data.version === '0');
            }
        }).timeout(60000);
    });

    describe('teams', () => {
        it.skip('should list projectList', async () => {
            const teamApi: Teams = new Teams(path.join(__dirname, rcFile));
            const result = await teamApi.listProjects('gaterking', '404');
            assert(result.success);
            if (result.data) {
                assert(result.data.length > 0);
            }
        }).timeout(60000);

        it.skip('should create new project', async () => {
            const teamApi: Teams = new Teams(path.join(__dirname, rcFile));
            const result = await teamApi.createNewProject('gaterking', '404', 'ut0');
            assert(result.success === true);
            if (result.data) {
                assert(result.data.name === 'ut0');
            }
        }).timeout(60000);
    });

    describe('organizations', () => {
        it.skip('should list projectList', async () => {
            const orgApi: Organizations = new Organizations(path.join(__dirname, rcFile));
            const result = await orgApi.listProjects('gaterking');

            assert(result.success === true);
            if (result.data) {
                assert(result.data.length > 0);
            }
        }).timeout(60000);
    });

    describe('projects', () => {
        it.skip('should update project', async () => {
            const projectsApi: Projects = new Projects(path.join(__dirname, rcFile));
            const result = await projectsApi.UpdateProject('gaterking', '404', {
                platform: EnumPlatform.vue
            });
            assert(result.success === true);
            if (result.data) {
                assert(result.data.platform === EnumPlatform.vue);
            }
        }).timeout(60000);

        it.skip('should delete project', async () => {
            const projectsApi: Projects = new Projects(path.join(__dirname, rcFile));
            const result = await projectsApi.DeleteProject('gaterking', 'ut0-v5');
            assert(result.success === true);
        }).timeout(60000);

        it.skip('should upload file', async () => {
            const projectsApi: Projects = new Projects(path.join(__dirname, rcFile));
            const result = await projectsApi.UploadProjectFiles('gaterking', 'testdemo-k0', 'test2', [
                {
                    file: path.join(__dirname, '../../../sample/dist/js/app.7fe64a76.js'),
                    header: 'Content-Type:text/plain; encoding=utf-8',
                    name: '~/hd/all3/18108-lock-selector/js/app.7fe64a76.js',
                }
            ]);
            assert(result.length > 0);
        }).timeout(20000);

        it.only('should delete file', async () => {
            const releasesApi: Releases = new Releases(path.join(__dirname, rcFile));
            const result = await releasesApi.deleteReleaseFile('gaterking', 'test2', '161952311');
            assert(result.success);
        }).timeout(20000);
    });
});
