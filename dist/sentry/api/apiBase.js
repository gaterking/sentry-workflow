"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axiosRequest_1 = require("./axiosRequest");
const getConf_1 = __importDefault(require("./getConf"));
class ApiBase {
    constructor(confFile = './sentryapirc') {
        this.conf = getConf_1.default(confFile);
        this.baseUrl = this.conf.baseUrl;
        const authTokenData = this.conf.token;
        this.authToken = `Bearer ${authTokenData}`;
    }
    async apiInfo() {
        return axiosRequest_1.request({
            baseURL: this.baseUrl,
            url: '/api/0/',
        });
    }
}
exports.ApiBase = ApiBase;
