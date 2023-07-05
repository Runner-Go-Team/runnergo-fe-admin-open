// 你的app版本
export const APP_VERSION = '1.0.0'

// 后端http接口地址
export const RD_BaseURL = {
    development: '开发环境地址',
    test: '测试环境地址',
    production: '线上环境地址',
};

// 当前主域 (主要用于储存cookie)
export const DOMAIN = {
    development: '',
    test: '测试环境主域',
    production: '线上环境主域',
}

// 前端工作台页面地址
export const FE_Work_Base_URL = {
    development: '工作台开发环境地址',
    test: '工作台测试环境地址',
    production: '工作台线上环境地址',
};

export const RD_DOMAIN = DOMAIN[NODE_ENV];
export const RD_BASE_URL = RD_BaseURL[NODE_ENV];
export const FE_WOEK_URL = FE_Work_Base_URL[NODE_ENV]

export default {
    RD_BASE_URL,
    RD_DOMAIN,
};