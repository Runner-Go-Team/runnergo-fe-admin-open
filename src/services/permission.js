import request from './axios';

// 获取权限列表
export const getPermissionList = (
    params
) => request('get', '/v1/permission/list', 'json', false, params);

// 获取用户权限
export const getUserPermissionList = (
    params
) => request('get', '/v1/permission/user/get', 'json', false, params);

// 获取用户的全部角色对应的mark
export const getUserAllPermissionMarks = (
    params
) => request('get', '/v1/permission/user/get_marks', 'json', false, params);
