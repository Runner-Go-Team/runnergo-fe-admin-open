import request from './axios';

// 获取角色列表
export const getRoleList = (
  params
) => request('get', '/v1/role/list', 'json', false, params);


// 获取我的角色信息
export const ServiceGetUserRole = (
  params
) => request('get', '/v1/role/member/info', 'json', false, params);


// 新建角色
export const ServiceNewRole = (
  params
) => request('post', '/v1/role/save', 'json', false, params);

// 保存角色信息
export const saveRoleInfo = (
  params
) => request('post', '/v1/permission/role/set', 'json', false, params);

// 删除角色
export const ServeiceDeleteRole = (
  params
) => request('post', '/v1/role/remove', 'json', false, params);


// 获取角色成员列表
export const ServiceGetRoleMemberList = (
  params
) => request('get', '/v1/role/member/list', 'json', false, params);

// 判断是否可以删除角色
export const ServiceIsRemoveRole = (
  params
) => request('get', '/v1/role/is_remove', 'json', false, params);
