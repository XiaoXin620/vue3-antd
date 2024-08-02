import axios, { CanceledError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { isString } from 'lodash-es';
import { message as $message, Modal } from 'ant-design-vue';
import { ResultEnum } from '@/enums/httpEnum';
import { useUserStore } from '@/store/modules/user';

const UNKNOWN_ERROR = '未知错误，请重试';

export interface RequestOptions extends AxiosRequestConfig {
    /** 是否直接将数据从响应中提取出，例如直接返回 res.data，而忽略 res.code 等信息 */
    isOriginResult?: boolean;
    /** 请求成功是提示信息 */
    successMsg?: string;
    /** 请求失败是提示信息 */
    errorMsg?: string;
    /** 成功时，是否显示后端返回的成功信息 */
    showSuccessMsg?: boolean;
    /** 失败时，是否显示后端返回的失败信息 */
    showErrorMsg?: boolean;
    requestType?: 'json' | 'form';
}

export const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
const controller = new AbortController();

const service = axios.create({
    baseURL: baseApiUrl,
    timeout: 10000,
    signal: controller.signal
})

service.interceptors.request.use(
    (config) => {
        const userStore = useUserStore();
        const token = userStore.token;
        if (token && config.headers) {
            // 请求头token信息，请根据实际情况进行修改
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);


service.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
        const res = response.data;
        // 不等于200
        if (res.code !== ResultEnum.SUCCESS) {
            $message.error(res.message || UNKNOWN_ERROR);
            // Illegal token
            if ([1101, 1105].includes(res.code)) {
                // to re-login
                Modal.confirm({
                    title: '警告',
                    content: res.message || '账号异常，您可以取消停留在该页上，或重新登录',
                    okText: '重新登录',
                    cancelText: '取消',
                    onOk: () => {
                        localStorage.clear();
                        window.location.reload();
                    },
                });
            }

            // throw other
            const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any };
            error.code = res.code;
            return Promise.reject(error);
        } else {
            return response;
        }
    },
    (error) => {
        if (!(error instanceof CanceledError)) {
            // 处理 422 或者 500 的错误异常提示
            const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
            $message.error({ content: errMsg, key: errMsg });
            error.message = errMsg;
        }
        return Promise.reject(error);
    },
);

type BaseResponse<T = any> = Omit<Result, 'data'> & {
    result: T;
};

export function request<T = any>(
    url: string,
    config: { isReturnResult: false } & RequestOptions,
): Promise<BaseResponse<T>>;
export function request<T = any>(
    url: string,
    config: RequestOptions,
): Promise<BaseResponse<T>['result']>;
export function request<T = any>(
    config: { isReturnResult: false } & RequestOptions,
): Promise<BaseResponse<T>>;
export function request<T = any>(config: RequestOptions): Promise<BaseResponse<T>['result']>;

export async function request(_url: string | RequestOptions, _config: RequestOptions = {}) {
    const url = isString(_url) ? _url : _url.url;
    const config = isString(_url) ? _config : _url;

    try {
        // 兼容 from data 文件上传的情况
        const { requestType, isOriginResult = true, ...rest } = config;

        const response = (await service.request({
            url,
            ...rest,
            headers: {
                ...rest.headers,
                ...(requestType === 'form' ? { 'Content-Type': 'multipart/form-data' } : {}),
            },
        })) as AxiosResponse<BaseResponse>;
        const { data } = response;
        const { code, message } = data || {};

        const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;

        if (hasSuccess) {
            const { successMsg, showSuccessMsg } = config;
            if (successMsg) {
                $message.success(successMsg);
            } else if (showSuccessMsg && message) {
                $message.success(message);
            }
        }
        // 页面代码需要获取 code，data，message 等信息时，需要将 isOriginResult 设置为 false
        if (!isOriginResult) {
            return data;
        } else {
            return data.result;
        }
    } catch (error: any) {
        return Promise.reject(error);
    }
}