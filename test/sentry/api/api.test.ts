/**
 * apiBase.ts
 */
// import path from 'path';
import path from 'path';
import assert from 'power-assert';
import {ApiBase} from 'sentry/api/apiBase';
import {Teams} from 'sentry/api/index';

const rcFile = './sentryapi_mock.config.js';
describe('sentry.api', () => {
    describe('apiBase', () => {
        it('should constructor', () => {
            const api: ApiBase = new ApiBase(path.join(__dirname, rcFile));
            assert(api.baseUrl === 'https://sentry.io');
            // tslint:disable-next-line:max-line-length
            assert(api.authToken === 'Bearer f960ff08339746bea5bc0232b5e475962e111d73b26a46e097636e6469e7e46c');
        }).timeout(60000);

        it.skip('should get version', async () => {
            const api: ApiBase = new ApiBase(path.join(__dirname, rcFile));
            const apiInfo = await api.apiInfo();
            assert(apiInfo !== null);
            if (apiInfo) {
                assert(apiInfo.version === '0');
            }
        }).timeout(60000);
    });

    describe('teams', () => {
        it('should list projectList', async () => {
            const teamApi: Teams = new Teams(path.join(__dirname, rcFile));
            const result = await teamApi.listProjectsByTeam('gaterking', '404');
            console.log(result);
        }).timeout(60000);
    });
});
