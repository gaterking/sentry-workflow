"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_1 = __importDefault(require("find"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fs_1 = __importDefault(require("mz/fs"));
const path_1 = __importDefault(require("path"));
const sourceMapUrlRegx = /\?!\/\/# sourceMappingURL=.*/;
async function generateMapFile(includes, sourceDist = '.', publishBase = __dirname) {
    async function includeFilesFinder() {
        const includePromises = [];
        includes.forEach((includeStr) => {
            includePromises.push(new Promise(async (resolve) => {
                const includePath = path_1.default.resolve(publishBase, includeStr);
                const findedFiles = [];
                find_1.default.eachfile(/\.js$/, includePath, (file) => {
                    findedFiles.push(file);
                }).end(() => {
                    resolve(findedFiles.map((fullFilePath) => {
                        return {
                            originBase: publishBase,
                            originMap: '',
                            orignFile: fullFilePath
                        };
                    }));
                });
            }));
        });
        const findedFilesArray = await Promise.all(includePromises);
        let allFiles = [];
        findedFilesArray.forEach((findedFiles) => {
            allFiles = allFiles.concat(findedFiles);
        });
        return allFiles;
    }
    let allResults = await includeFilesFinder();
    allResults = getSourceMaps(allResults, sourceDist, publishBase);
    const targetPath = path_1.default.resolve(publishBase, './sourcemap.json');
    fs_1.default.writeFileSync(targetPath, JSON.stringify(allResults));
    return targetPath;
}
exports.generateMapFile = generateMapFile;
function getSourceMaps(fileMaps, sourceDist, publishBase) {
    const sourceMapFolder = path_1.default.join(publishBase, sourceDist);
    fileMaps.forEach((file) => {
        const sourceMapName = `${path_1.default.basename(file.orignFile, '.js')}.js.map`;
        const mapFiles = find_1.default.fileSync(sourceMapName, sourceMapFolder);
        if (mapFiles.length === 1 && fs_1.default.existsSync(mapFiles[0])) {
            file.originMap = mapFiles[0];
        }
        else {
            file.originMap = '';
        }
    });
    return fileMaps;
}
async function buildSourceURL(includes, sourceDist = '.', publishBase = __dirname, urlPrefix = '') {
    const mapJsonFile = await generateMapFile(includes, sourceDist, publishBase);
    const mapJsonContent = fs_1.default.readFileSync(mapJsonFile);
    const mapJson = JSON.parse(mapJsonContent.toString());
    const sentryFolder = path_1.default.join(publishBase, './sentry/');
    fs_extra_1.default.removeSync(sentryFolder);
    for (const fileMapInfo of mapJson) {
        const fileDataBuffer = await fs_1.default.readFile(fileMapInfo.orignFile);
        const fileData = fileDataBuffer.toString();
        let mapUrl = urlPrefix.replace(/\/*$/, '');
        mapUrl += `${fileMapInfo.originMap.replace(fileMapInfo.originBase, '').replace(/\\/g, '\/')}`;
        const newDataStr = replaceSourceURL(fileData, `\n//# sourceMappingURL=${mapUrl}`);
        const newFilePath = path_1.default.join(sentryFolder, fileMapInfo.orignFile.replace(fileMapInfo.originBase, ''));
        const newDirpath = path_1.default.dirname(newFilePath);
        fs_extra_1.default.ensureDirSync(newDirpath);
        fs_1.default.writeFileSync(newFilePath, newDataStr);
    }
    const sentrySourceMapFolder = path_1.default.join(sentryFolder, sourceDist);
    fs_extra_1.default.ensureDirSync(sentrySourceMapFolder);
    fs_extra_1.default.copySync(path_1.default.join(publishBase, sourceDist), sentrySourceMapFolder);
    return sentryFolder;
}
exports.buildSourceURL = buildSourceURL;
function replaceSourceURL(fileData, newUrl = '') {
    const m = fileData.match(sourceMapUrlRegx);
    if (m) {
        return fileData.replace(sourceMapUrlRegx, newUrl);
    }
    else {
        return `${fileData} ${newUrl}`;
    }
}
