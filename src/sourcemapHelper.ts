import find from 'find';
import fsExtra from 'fs-extra';
import fs from 'mz/fs';
import path from 'path';

interface IFileMapInfo {
    /**
     * 原文件基路径
     */
    originBase: string;

    /**
     * 原文件路径
     */
    orignFile: string;

    /**
     * 原文件对应source map路径
     */
    originMap: string;
}

const sourceMapUrlRegx: RegExp  = /\?!\/\/# sourceMappingURL=.*/;

/**
 * 根据指定目录生成对应的原文件与source map路径对应表
 *
 * @param includes 待搜索的目录
 * @param sourceDist source map所在的文件夹路径
 * @param publishBase 发布目录根路径绝对路径
 *
 */
async function generateMapFile (includes: string[],
                                sourceDist: string = '.',
                                publishBase: string = __dirname): Promise<string> {
    async function includeFilesFinder (): Promise<IFileMapInfo[]>  {
        const includePromises: Array<Promise<IFileMapInfo[]>> = [];
        includes.forEach((includeStr: string) => {
            includePromises.push(new Promise<IFileMapInfo[]>(async (resolve): Promise<void> => {
                const includePath: string = path.resolve(publishBase, includeStr);
                const findedFiles: string[] = [];
                find.eachfile(/\.js$/, includePath, (file: string) => {
                    findedFiles.push(file);
                 }).end(() => {
                    resolve(findedFiles.map((fullFilePath: string): IFileMapInfo => {
                        return {
                            originBase: publishBase,
                            originMap: '',
                            orignFile: fullFilePath
                        };
                    }));
                 });
            }));
        });
        const findedFilesArray: IFileMapInfo[][] = await Promise.all(includePromises);
        let allFiles: IFileMapInfo[] = [];
        findedFilesArray.forEach((findedFiles: IFileMapInfo[]) => {
            allFiles = allFiles.concat(findedFiles);
        });

        return allFiles;
    }
    let allResults: IFileMapInfo[] = await includeFilesFinder();
    allResults = getSourceMaps(allResults, sourceDist, publishBase);
    const targetPath: string = path.resolve(publishBase, './sourcemap.json');
    fs.writeFileSync(targetPath, JSON.stringify(allResults));

    return targetPath;
}

/**
 * 搜索获取源文件对应的source map文件
 * @param fileMaps 原文件集合
 * @param sourceDist 待搜索的目录路径
 * @param publishBase 发布目录根路径绝对路径
 */
function getSourceMaps (fileMaps: IFileMapInfo[], sourceDist: string, publishBase: string): IFileMapInfo[] {
    const sourceMapFolder: string = path.join(publishBase, sourceDist);
    fileMaps.forEach((file: IFileMapInfo) => {
        const sourceMapName: string = `${path.basename(file.orignFile, '.js')}.js.map`;
        const mapFiles: string[] = find.fileSync(sourceMapName, sourceMapFolder);
        if (mapFiles.length === 1 && fs.existsSync(mapFiles[0])) {
            file.originMap = mapFiles[0];
        } else {
            file.originMap = '';
        }
    });

    return fileMaps;
}

/**
 * 关联sourceUrl文件
 *
 * @param includes 待搜索的目录
 * @param sourceDist source map所在的文件夹路径
 * @param publishBase 发布目录根路径绝对路径
 * @param urlPrefix sourceMappingURL前缀，以http(s)://或/或相对地址开头
 */
async function buildSourceURL (includes: string[],
                               sourceDist: string = '.',
                               publishBase: string = __dirname,
                               urlPrefix: string = ''): Promise<string> {
    const mapJsonFile: string  = await generateMapFile(includes, sourceDist, publishBase);
    const mapJsonContent: Buffer = fs.readFileSync(mapJsonFile);
    const mapJson: IFileMapInfo[] = JSON.parse(mapJsonContent.toString());

    const sentryFolder: string = path.join(publishBase, './sentry/');
    fsExtra.removeSync(sentryFolder);
    for (const fileMapInfo of mapJson) {
        const fileDataBuffer: Buffer = await fs.readFile(fileMapInfo.orignFile);
        const fileData: string = fileDataBuffer.toString();
        let mapUrl: string = urlPrefix.replace(/\/*$/, '');
        // \转/，文件相对地址合成CDN全路径
        mapUrl += `${fileMapInfo.originMap.replace(fileMapInfo.originBase, '').replace(/\\/g, '\/')}`;
        const newDataStr: string = replaceSourceURL(fileData,
                                                    // tslint:disable-next-line:max-line-length
                                                    `\n//# sourceMappingURL=${mapUrl}`);
        // 按原始目录结构将重定向source map的js发布到sentry目录
        const newFilePath: string = path.join(sentryFolder, fileMapInfo.orignFile.replace(fileMapInfo.originBase, ''));
        const newDirpath: string = path.dirname(newFilePath);
        fsExtra.ensureDirSync(newDirpath);
        fs.writeFileSync(newFilePath, newDataStr);
    }
    const sentrySourceMapFolder: string = path.join(sentryFolder, sourceDist);
    fsExtra.ensureDirSync(sentrySourceMapFolder);
    fsExtra.copySync(path.join(publishBase, sourceDist), sentrySourceMapFolder);

    return sentryFolder;
}

function replaceSourceURL (fileData: string, newUrl: string = ''): string {
    const m: RegExpMatchArray | null = fileData.match(sourceMapUrlRegx);
    if (m) {
        return fileData.replace(sourceMapUrlRegx, newUrl);
    } else {
        return `${fileData} ${newUrl}`;
    }
}

/**
 * 建立source map文件关系
 */
// function mapSourceURL(): void {
// }
export {
    generateMapFile,
    buildSourceURL
};
