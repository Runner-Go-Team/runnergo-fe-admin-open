import request from './axios';

// 用户登陆
export const ServiceUserLogin = (
    params
) => request('post', '/v1/auth/user_login', 'json', false, params);

// 获取用户信息
export const ServiceGetUserInfo = (
    params
) => request('get', '/v1/user/get', 'json', false, params);

// 修改用户昵称
export const ServiceUpdateUserName = (
    params
) => request('post', '/v1/user/update_nickname', 'json', false, params);

// 修改用户邮箱
export const ServiceUpdateUserEmail = (
    params
) => request('post', '/v1/user/update_email', 'json', false, params);

// 修改用户账号
export const ServiceUpdateUserAccount = (
    params
) => request('post', '/v1/user/update_account', 'json', false, params);

// 修改用户密码
export const ServiceUpdateUserPassword = (
    params
) => request('post', '/v1/user/update_password', 'json', false, params);

// 修改用户头像
export const ServiceUpdateUserAvatar = (
    params
) => request('post', '/v1/user/update_avatar', 'json', false, params);

// 获取操作日志
export const ServiceGetUserOperationLog = (
    params
) => request('get', '/v1/operation/list', 'json', false, params);

// 验证密码
export const ServiceVerifyPassword = (
    params
) => request('post', '/v1/user/verify_password', 'json', false, params);

// 验证用户是否是有效用户
export const ServiceGetUserVerifyUsable= (
    params
) => request('get', '/v1/user/verify_usable', 'json', false, params);
