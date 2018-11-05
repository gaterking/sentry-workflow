import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {IHttpError} from './types';
async function request<T> (options: AxiosRequestConfig): Promise<T|IHttpError> {
    return axios.request<T>(options).then((value: AxiosResponse<T>) => {
        if (value.status >= 200 && value.status < 300) {
            return value.data;
        } else {
            // tslint:disable-next-line:no-console
            console.warn(`${value.status} ${value.statusText}`);
            return {
                code: value.status,
                text: value.statusText
            };
        }
    }).catch((err) => {
        // tslint:disable-next-line:no-console
        console.error(err);
        return {
            code: err.response.status,
            data: err.response.data,
            text: err.response.statusText
        };
    });
}
export {
    request
};
