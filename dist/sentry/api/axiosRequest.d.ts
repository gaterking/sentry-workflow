import { AxiosRequestConfig } from 'axios';
import { IHttpResponse } from './types';
declare function request<T>(options: AxiosRequestConfig): Promise<IHttpResponse<T>>;
export { request };
