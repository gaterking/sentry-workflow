declare function generateMapFile(includes: string[], sourceDist?: string, publishBase?: string): Promise<string>;
declare function buildSourceURL(includes: string[], sourceDist?: string, publishBase?: string, urlPrefix?: string): Promise<string>;
export { generateMapFile, buildSourceURL };
