"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sentry API基类
 */
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("config"));
class ApiBase {
    constructor(authToken, host, confFile = './sentryapirc') {
        // f960ff08339746bea5bc0232b5e475962e111d73b26a46e097636e6469e7e46c
        this.conf = this.loadConfig(confFile);
        const authTokenbuff = new Buffer(authToken);
        const authTokenData = authTokenbuff.toString('base64');
        this.authToken = `Bearer ${authTokenData}`;
        this.axiosInstance = axios_1.default.create({
            baseURL: host
        });
        this.axiosInstance.defaults.headers.common[`Authorization`] = authToken;
    }
    async request(axiosConfig) {
        return this.axiosInstance.request(Object.assign({}, axiosConfig)).then((value) => {
            return this.handleResponse(value);
        });
    }
    handleResponse(value) {
        if (value.status === 200) {
            return value.data;
        }
        else {
            // tslint:disable-next-line:no-console
            console.error(`${value.status} ${value.statusText}`);
            return;
        }
    }
    loadConfig(confFile) {
        const confLoaded = config_1.default.get(confFile);
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        this.authToken = this.conf.get('auth.token');
        return confLoaded;
    }
}
exports.ApiBase = ApiBase;
