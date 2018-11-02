/**
 * 根据指定目录生成对应的原文件与source map路径对应表
 *
 * @param includes 待搜索的目录
 * @param sourceDist source map所在的文件夹路径
 * @param publishBase 发布目录根路径绝对路径
 *
 */
declare function generateMapFile(includes: string[], sourceDist?: string, publishBase?: string): Promise<string>;
/**
 * 关联sourceUrl文件
 *
 * @param includes 待搜索的目录
 * @param sourceDist source map所在的文件夹路径
 * @param publishBase 发布目录根路径绝对路径
 * @param urlPrefix sourceMappingURL前缀，以http(s)://或/或相对地址开头
 */
declare function buildSourceURL(includes: string[], sourceDist?: string, publishBase?: string, urlPrefix?: string): Promise<string>;
/**
 * 建立source map文件关系
 */
export { generateMapFile, buildSourceURL };
