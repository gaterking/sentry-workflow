"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function request(options) {
    return axios_1.default.request(options).then((value) => {
        return {
            code: value.status,
            data: value.data,
            success: value.status >= 200 && value.status < 300,
            text: value.statusText
        };
    }).catch((err) => {
        return {
            code: err.response.status,
            errorData: err.response.data,
            success: false,
            text: err.response.statusText
        };
    });
}
exports.request = request;
