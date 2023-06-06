// 后端http接口地址
export const RD_BaseURL = {
    development: '开发环境地址',
    test: '测试环境地址',
    production: '线上环境地址',
};

// Domain 用于保存/获取cookie
export const DOMAIN = {
    development: '', // 开发环境domain 可为空
    test: '测试环境domain',
    production: '线上环境domain',
}

// 前端工作台页面地址
export const FE_Work_Base_URL = {
    development: '开发环境地址',
    test: '测试环境地址',
    production: '线上环境地址',
};

export const RD_DOMAIN = DOMAIN[NODE_ENV];
export const RD_BASE_URL = RD_BaseURL[NODE_ENV];
export const FE_WOEK_URL = FE_Work_Base_URL[NODE_ENV]

export default {
    RD_BASE_URL,
    RD_DOMAIN,
};