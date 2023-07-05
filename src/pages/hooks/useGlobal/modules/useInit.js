import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceGetUserInfo } from '@services/user';
import { getUserAllPermissionMarks } from '@services/permission';
import { getCompanyInfo } from '@services/company'
import { isLogin, setCookie } from '@utils';
import { useEventBus } from '@utils/eventBus';
import { useDispatch, useSelector } from 'react-redux';
import { isArray, isPlainObject, isString } from 'lodash';

const useInit = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const theme = useSelector((store) => store.user.theme) || 'dark';
  const language = useSelector((store) => store.user.language) || 'cn';
  useEffect(() => {
    i18n.changeLanguage(language);
    setCookie('i18nextLng', language);
  }, [language]);
  useEffect(() => {
    const url = `/skins/${theme}.css`;
    setCookie('theme', theme);
    if (theme === 'white') {
      document.body.removeAttribute('arco-theme');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
    document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
  }, [theme]);
  const removePreloader = () => {
    document.querySelector('.preloader').remove();
  }
  const initProgram = async () => {
    // 已经登陆 
    if (isLogin()) {
      try {
        // 获取用户信息
        let res = await ServiceGetUserInfo();
        if (res?.code == 0 && isPlainObject(res?.data?.user_info)) {
          dispatch({
            type: 'user/updateUser',
            payload: {
              ...res?.data?.user_info,
              team_list: res?.data?.team_list || []
            }
          });
          if (isString(res?.data?.user_related?.company_id)) {
            localStorage.setItem('company_id', res?.data?.user_related?.company_id);
          }
        }
        let company_id = localStorage.getItem('company_id')
        // 获取用户当前企业以及所有团队权限
        res = await getUserAllPermissionMarks();
        if (res?.code == 0) {
          const companyMarks = res?.data?.company?.[company_id] || [];
          const teamMarks = res?.data?.teams || {};
          dispatch({
            type: 'permission/updatePermission',
            payload: {
              companyPermissions: isArray(companyMarks) ? companyMarks : [],
              teamPermissions: isPlainObject(teamMarks) ? teamMarks : {},
            }
          });
        }

        // 获取企业基本信息
        res = await getCompanyInfo({company_id});
        if(res?.code == 0 && isPlainObject(res?.data?.company)){
          dispatch({
            type: 'company/updateCompany',
            payload: res.data.company
          });
        }
      } catch (error) { }
    }
    // 移除loading
    removePreloader();
  }
  useEffect(() => {
    initProgram();
  }, []);
  useEventBus('init/Program', initProgram, []);
};

export default useInit;
