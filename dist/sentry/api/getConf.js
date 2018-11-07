"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = __importDefault(require("cosmiconfig"));
function getConf(rcFile = '') {
    const explorer = cosmiconfig_1.default('sentryapi');
    const { config = {} } = (rcFile ? explorer.loadSync(rcFile) : explorer.searchSync()) || {};
    const defaultConfig = {
        baseUrl: '',
        token: ''
    };
    return Object.assign({}, defaultConfig, config);
}
exports.default = getConf;
