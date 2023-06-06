import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@arco-design/web-react';
import { ContentType, REQUEST_TIMEOUT } from './constant';
import { clearUserData, getCookie, setCookie } from '@utils';
import { RD_BASE_URL } from '@config';
import { isEmpty, isObject, isPlainObject } from 'lodash';

const path = '/permission/api';
const managementpPth = '/management/api';
const instance = axios.create({
    baseURL: `${RD_BASE_URL}${path}`,
    timeout: REQUEST_TIMEOUT,
});
const managementInstance = axios.create({
    baseURL: `${RD_BASE_URL}${managementpPth}`,
    timeout: REQUEST_TIMEOUT,
});
const requestFunc = async (config) => {
    const storage = window.localStorage;
    config.headers = {
        Authorization: getCookie('token') || 'NOLOGIN',
        ...config.headers,
    };
    return config;
};

const responseFunc = (res) => {
    if (res.status === 200) {
        if (res.data.code === 0) {
            return res.data;
        } else {
            if (getCookie('i18nextLng') === 'en') {
                Message.error(res.data.em);
            } else {
                Message.error(res.data.et);
            }
        }
        if (res.data.code === 20003 || res.data.code === 10006) {
            setCookie('token', '');
            window.location.href = '/#/login';
        }
        if (res.data.code === 20201 || res.data.code === 20005) {
            setTimeout(() => {
                // 清楚用户信息
                clearUserData();
                window.location.href = '/#/login';
            }, 2000);
        }
    }

    return res?.data;
};

// 添加拦截
instance.interceptors.request.use(
    requestFunc,
    (err) => {
        console.log(err);
    }
);
managementInstance.interceptors.request.use(
    requestFunc,
    (err) => {
        console.log(err);
    }
);

instance.interceptors.response.use(
    responseFunc,
    (err) => {
    }
);
managementInstance.interceptors.response.use(
    responseFunc,
    (err) => {
    }
);

const request = (method, url, contentType = null, loading, params, headers, onUploadProgress = () => '', path = 'permission') => {
    let config = {
        method,
        url,
        headers: {
            ...headers,
        },
        contentType: ContentType[contentType],
        onUploadProgress
    }
    if (method == 'get' && isObject(params)) {
        try {
            config.url = `${url}?${new URLSearchParams(params).toString()}`;
        } catch (error) { }
    } else if (contentType == 'form' && isPlainObject(params) && !isEmpty(params)) {
        const formData = new FormData();
        Object.keys(params).forEach((key) => {
            formData.append(key, params[key]);
        })
        config = { ...config, data: formData }
    } else {
        config = { ...config, data: params }
    }
    if (!path || path == 'permission') {
        return instance(config);
    } else {
        return managementInstance(config);
    }
};

export default request;