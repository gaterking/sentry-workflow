import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {IHttpResponse} from './types';
async function request<T> (options: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    return axios.request<T>(options).then((value: AxiosResponse<T>) => {
        return {
            code: value.status,
            data: value.data,
            success: value.status >= 200 && value.status < 300,
            text: value.statusText
        };
    }).catch((err) => {
        // tslint:disable-next-line:no-console
        return {
            code: err.response.status,
            data: err.response.data,
            success: false,
            text: err.response.statusText
        };
    });
}
export {
    request
};
