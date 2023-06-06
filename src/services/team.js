import request from './axios';

// 获取团队列表
export const getTeamList = (
    params
) => request('get', '/v1/team/list', 'json', false, params);

// 新建团队
export const serviceNewTeam = (
    params
) => request('post', '/v1/team/save', 'json', false, params);

// 收藏/取消收藏 团队
export const serviceTeamCollection = (
    params
) => request('post', '/v1/team/collection', 'json', false, params);

// 修改团队
export const updateTeamInfo = (
    params
) => request('post', '/v1/team/update', 'json', false, params);

// 获取团队详情
export const getTeamDetail = (
    params
) => request('get', '/v1/team/info', 'json', false, params);

// 移除团队成员
export const removeTeamMember = (
    params
) => request('post', '/v1/team/member/remove', 'json', false, params);

// 获取团队 企业内成员邀请列表
export const getTeamInviteMemberList = (
    params
) => request('get', '/v1/team/company/members', 'json', false, params);

// 添加团队成员
export const addTeamMember = (
    params
) => request('post', '/v1/team/member/save', 'json', false, params);

// 解散团队
export const serviceDisbandTeam = (
    params
) => request('post', '/v1/team/disband', 'json', false, params);

// 移交团队管理员
export const serviceTeamManagerHandOver = (
    params
) => request('post', '/v1/team/transfer_super_role', 'json', false, params);

// 更改团队角色
export const serviceTeamRoleUpdate = (
    params
) => request('post', '/v1/role/team/set', 'json', false, params);

// 获取团队最新性能计划列表
export const serviceTeamStressPlanList = (
    params
) => request('post', '/company/get_newest_stress_plan_list', 'json', false, params,null,null,'management');

// 获取团队最新自动计划列表
export const serviceTeamAutoPlanList = (
    params
) => request('post', '/company/get_newest_auto_plan_list', 'json', false, params,null,null,'management');