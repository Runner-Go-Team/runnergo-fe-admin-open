import ATools from 'apipost-tools';
import ASTools from 'apipost-inside-tools';
import dayjs from 'dayjs';
import { RD_DOMAIN } from '@config';

// 设置Cookie
export const setCookie = (name, value, expiredays = undefined) => {
  ASTools.setCookie(name, value, RD_DOMAIN || '', expiredays);
}

// 获取cookie
export const getCookie = (name) => {
  return ASTools.getCookie(name);
}

export const isLogin = () => {
  let token = getCookie('token');
  return token ? true : false;
}

export const FotmatTimeStamp = (timeStamp, format) => {
  try {
    let time_temp = `${timeStamp}`;
    if (time_temp.length === 10) {
      time_temp = time_temp * 1000;
    }
    time_temp = parseInt(time_temp, 10);

    return dayjs(time_temp).format(format);
  } catch (error) {
    return '-';
  }
}

// 清除用户信息
export const clearUserData = () => {
  // 记住密码 保留 用户信息
  localStorage.clear();
  sessionStorage.clear();
  setCookie('token', '', 0);
};
export const openLinkInNewTab = (link) => {
  window.open(link, '_blank');
};
// 邮箱教研
export const EamilReg = ATools.isEmail;

// 判断方法是否为Promise
export const isPromise = (obj) => {
  return (
    obj &&
    typeof obj?.then === 'function' &&
    typeof obj?.catch === 'function'
  );
}


export default {
  FotmatTimeStamp,
  setCookie,
  getCookie,
  clearUserData,
  isLogin,
  openLinkInNewTab,
  EamilReg,
  isPromise
}