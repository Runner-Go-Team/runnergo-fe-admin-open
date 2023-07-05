import request from './axios';

// 获取企业信息
export const getCompanyInfo = (
    params
) => request('get', '/v1/company/info', 'json', false, params);

// 获取企业成员列表
export const getCompanyMemberList = (
    params
) => request('get', '/v1/company/members', 'json', false, params);


// 修改企业成员
export const updateCompanyMember = (
    params
) => request('post', '/v1/company/member/update', 'json', false, params);

// 新增企业成员
export const addCompanyMember = (
    params
) => request('post', '/v1/company/member/save', 'json', false, params);

// 获取简介信息 团队列表
export const getSimpleCompanyTeamList = (
    params
) => request('get', '/v1/company/teams', 'json', false, params);

// 删除企业用户
export const removeCompanyMember = (
    params
) => request('post', '/v1/company/member/remove', 'json', false, params);

// 获取批量导入企业成员模版文件
export const getBatchImportFile = (
    params
) => request('get', '/v1/download/company/export', 'json', false, params);

// 导入企业成员
export const companyMemeberImport = (
    params,
    onUploadProgress
) => request('post', '/v1/company/member/export', 'form', false, params, {} , onUploadProgress);

// 更改企业角色
export const companyRoleUpdate = (
    params,
) => request('post', '/v1/role/company/set', 'json', false, params, {});

// 修改企业成员密码
export const companyUpdatePassword = (
    params,
) => request('post', '/v1/company/member/update_password', 'json', false, params, {});