import React, { useEffect, useState } from 'react'
import { Input, Message, Tooltip } from '@arco-design/web-react';
import { isFunction, isString } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import Bus from '@utils/eventBus';
import './index.less';
import { clearUserData } from '@utils';
import { useTranslation } from 'react-i18next';

const UserCard = (props) => {
  const { value, onChange, placeholder } = props;
  const avatar = useSelector((store) => store?.user?.avatar);
  const role_name = useSelector((store) => store?.user?.role_name);
  const account = useSelector((store) => store?.user?.account);
  const nickname = useSelector((store) => store?.user?.nickname);
  const language = useSelector((store) => store.user.language) || 'cn';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (<div className='user-card'>
    <div className="user_info">
      <div className="l"><img src={avatar || "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default1.png"} alt="" /></div>
      <div className="r">
        <div className='name'><span className='name-text text-ellipsis'>{nickname || '-'}</span><span className='role'>{role_name || '-'}</span></div>
        <div className='email text-ellipsis'>{account || '-'}</div>
      </div>
    </div>
    <p onClick={() => Bus.$emit('openModal', 'UserCenter')}>{t('text.personal_homepage')}</p>
    <p onClick={() => { window.open('https://wiki.runnergo.cn', '_blank') }}>{t('text.use_document')}</p>
    <Tooltip content={<img style={{ width: '200px', height: '200px' }} src="https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/qrcode/qiyezhuanshukefu.png" />}>
      <p>{t('text.dedicated_customer')}</p>
    </Tooltip>
    <div className="line"></div>
    <p className={cn({
      languageActive: language == 'cn'
    })} onClick={() => {
      dispatch({
        type: 'user/updateUser',
        payload: {
          language: 'cn'
        }
      })
    }}>中文</p>
    <p className={cn({
      languageActive: language == 'en'
    })} onClick={() => {
      dispatch({
        type: 'user/updateUser',
        payload: {
          language: 'en'
        }
      })
    }}>English</p>
    <div className="line"></div>
    <p onClick={() => {
      // 清除用户信息
      clearUserData();
      navigate('/login');
      Message.success(t('message.quitSuccess'));
    }}>{t('btn.quit')}</p>
  </div>
  )
}

export default UserCard;