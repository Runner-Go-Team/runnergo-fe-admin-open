import request from './axios';

// 三方通知列表
export const ServiceGetNoticeList = (
    params
) => request('get', '/v1/notice/list', 'json', false, params);

// 获取通知详情
export const ServiceGetNoticeDetail = (
  params
) => request('get', '/v1/notice/detail', 'json', false, params);

// 新建三方通知
export const ServiceNewNotice = (
  params
) => request('post', '/v1/notice/save', 'json', false, params);

// 修改三方通知
export const ServiceUpdateNotice = (
  params
) => request('post', '/v1/notice/update', 'json', false, params);

// 禁用|启用三方通知
export const ServiceSetNoticeStatus = (
  params
) => request('post', '/v1/notice/set_status', 'json', false, params);

// 删除三方通知
export const ServiceRemoveNotice = (
  params
) => request('post', '/v1/notice/remove', 'json', false, params);

// 通知组列表
export const ServiceGetNoticeGroupList = (
  params
) => request('get', '/v1/notice/group/list', 'json', false, params);

// 删除三方通知组
export const ServiceRemoveNoticeGroup = (
  params
) => request('post', '/v1/notice/group/remove', 'json', false, params);

// 新建三方通知组
export const ServiceNewNoticeGroup = (
  params
) => request('post', '/v1/notice/group/save', 'json', false, params);

// 获取通知组详情
export const ServiceGetNoticeGroupDetail = (
  params
) => request('get', '/v1/notice/group/detail', 'json', false, params);

// 修改通知组
export const ServiceUpdateNoticeGroup = (
  params
) => request('post', '/v1/notice/group/update', 'json', false, params);

// 获取三方组织架构
export const ServiceGetNoticeUsers = (
  params
) => request('get', '/v1/notice/get_third_users', 'json', false, params);