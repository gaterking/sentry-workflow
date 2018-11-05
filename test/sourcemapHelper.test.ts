/**
 * sourcemapHelper.ts
 */
import assert from 'assert';
import path from 'path';
import * as sourcemapHelper from 'sourcemapHelper';

describe('sourcemapHelper', () => {
    describe.skip('generateMapFile', () => {
        it('should generate map file', async () => {
            const mapFile: string = await sourcemapHelper.generateMapFile(['js'],
            'sourcemap',
            path.resolve(__dirname, '../sample/dist'));
            assert(mapFile === path.resolve(__dirname, '../sample/dist', 'sourcemap.json'));
        });
    });

    describe.skip('buildSourceURL', () => {
        it('should create sentry upload files', async () => {
            await sourcemapHelper.buildSourceURL(['js'], 'sourcemap', path.resolve(__dirname, '../sample/dist'));
        });
    });
});
