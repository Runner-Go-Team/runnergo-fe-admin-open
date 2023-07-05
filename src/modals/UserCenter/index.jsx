import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Input, Checkbox, Select, Message } from '@arco-design/web-react';
import { IconSearch, IconEdit } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/TextInput';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EamilReg, FotmatTimeStamp, clearUserData } from '@utils';
import { ServiceGetUserInfo, ServiceUpdateUserName, ServiceUpdateUserAccount, ServiceUpdateUserPassword, ServiceUpdateUserEmail,ServiceVerifyPassword } from '@services/user';
import IconInfoRight from '@assets/info_right.svg';
import EditVatarModal from './editVatarModal';
import './index.less';
import { debounce, isArray, isPlainObject, isString, trim } from 'lodash';

const UserCenter = (props) => {
  const { onCancel } = props;
  const navigate = useNavigate();
  const [editAvatar, setEditAvatar] = useState(false);
  const [password, setPassword] = useState('');
  const [currentPwd,setCurrentPwd] = useState('');
  const [viewEditPassword, setViewEditPassword] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState('');
  const userData = useSelector((store) => store?.user)
  const textInputRef = useRef(null);
  const accountInputRef = useRef(null);
  const eamilInputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const initUserData = async () => {
    try {
      const resp = await ServiceGetUserInfo();
      if (resp?.code == 0 && isPlainObject(resp?.data?.user_info)) {
        dispatch({
          type: 'user/updateUser',
          payload: {
            ...resp?.data?.user_info,
            team_list: resp?.data?.team_list || []
          }
        });
      }
    } catch (error) { }
  }

  useEffect(() => {
    initUserData();
  }, []);
  const updateUserData = async (type, val) => {
    let value = trim(val);
    const template = {
      name: {
        success: t('text.modify_nickname_success'),
        error: t('text.nickname_cannot_null'),
        service: () => ServiceUpdateUserName({
          nickname: value
        }),
        updateRedux: () => dispatch({
          type: 'user/updateUser',
          payload: {
            nickname: value
          }
        })
      },
      email: {
        success: t('text.modify_email_success'),
        error: t('message.plsInputTrueEmail'),
        service: () => ServiceUpdateUserEmail({
          email: value
        }),
        updateRedux: () => dispatch({
          type: 'user/updateUser',
          payload: {
            email: value
          }
        })
      },
      account: {
        success: t('text.modify_account_success'),
        error: t('text.account_cannot_null'),
        service: () => ServiceUpdateUserAccount({
          account: value
        }),
        updateRedux: () => dispatch({
          type: 'user/updateUser',
          payload: {
            account: value
          }
        })
      },
      password: {
        success: t('text.modify_password_success'),
        error: t('text.password_cannot_null'),
        passwordError: t('text.password_error'),
        diffError: t('sign.confirmError'),
        service:async () => {
          try {
            const resp = await ServiceVerifyPassword({password:currentPwd})
            if(resp?.code == 0){
              if(!resp?.data?.is_match){
                t('text.current_pwd_error')
                return;
              }
            }else{
              return;
            }
          } catch (error) {
            return;
          }
          
          return ServiceUpdateUserPassword({
            new_password: password,
            repeat_password: repeatPassword
          })
        },
        updateRedux: () => dispatch({
          type: 'user/updateUser',
          payload: {
            password: value
          }
        }),
      }
    }
    const currentTemplate = template?.[type];
    if (currentTemplate) {
      if (type === 'password') {
        if(password.length < 6){
          if (password.length <= 0) {
            Message.error(currentTemplate.error)
            throw '';
          }else{
            Message.error(currentTemplate.passwordError)
            throw '';
          }
        } else if (password != repeatPassword) {
          Message.error(currentTemplate.diffError)
          throw '';
        }
      } else if (type === 'email') {
        if (value && !EamilReg(value)) {
          Message.error(currentTemplate.error)
          throw '';
        }
      }else if(type === 'account'){
        if(trim(value).length < 6 || trim(value).length > 30){
          Message.error('账号为6-30位')
          throw '';
        }
      } else if (!isString(value) || value.length <= 0) {
        Message.error(currentTemplate.error)
        throw '';
      }
    }
    const resp = await currentTemplate.service();
    if (resp?.code == 0) {
      Message.success(currentTemplate.success);
      currentTemplate?.updateRedux && currentTemplate?.updateRedux();
    }else{
      throw '';
    }
  };

  return (
    <>
      <Modal
        title={t('modal.editPwd')}
        className="runnerGo-edit-password-modal"
        style={{
          width: '567px',
          height: '487px',
          padding: '0px',
        }}
        visible={viewEditPassword}
        onOk={() => {
          updateUserData('password', '').then(data => setViewEditPassword(false)).catch(err => null)
        }}
        onCancel={() => setViewEditPassword(false)}
        autoFocus={false}
        focusLock={true}
      >
        <div className='info'>
          {/* <div className='lable'>{t('modal.editPwd')}</div> */}
          <Input.Password autoComplete="new-password" allowClear onChange={(val) => setCurrentPwd(val)} value={currentPwd} placeholder={t('placeholder.currentPwd')} style={{ width: 400, height: 46, margin: '20px auto' }} />
          <Input.Password autoComplete="new-password" maxLength={20} allowClear onChange={(val) => setPassword(val)} value={password} placeholder={t('placeholder.newPwd')} style={{ width: 400, height: 46, margin: '20px auto' }} />
          <Input.Password autoComplete="new-password" maxLength={20} allowClear onChange={(val) => setRepeatPassword(val)} value={repeatPassword} placeholder={t('placeholder.confirmPwd')} style={{ width: 400, height: 46, margin: '20px auto' }} />
        </div>
      </Modal >
      <EditVatarModal visible={editAvatar} setVisible={setEditAvatar} avatar={userData?.avatar} />
      <Modal
        title=''
        className="runnerGo-user-center-modal"
        visible
        onOk={() => onCancel()}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={true}
        footer={null}
      >
        <IconInfoRight className='logo-right' />
        <div className="head-picture">
          <div className='avatar-item' onClick={() => setEditAvatar(true)}>
            <div className="avatar-mask">
              {t('modal.updateAvatar')}
            </div>
            <img src={userData?.avatar} alt="" />
          </div>
        </div>
        <div className="name">
          <TextInput
            ref={textInputRef}
            value={userData?.nickname || ''}
            onChange={(val) => {
              return updateUserData('name', val);
            }}
            placeholder={t('text.please_enter_nickname')}
            maxLength={30}
          />
          <IconEdit onClick={() => {
            textInputRef?.current?.toggleView();
          }}
            style={{ fontSize: '20px', marginLeft: '6px' }}
          />
        </div>
        <div className="role">
          <div><span>{userData?.role_name || '-'}</span><span>（{t('text.company_role')} ）</span></div>
        </div>
        <div className='account-number'>
          <div className='title'>{t('text.account')}</div>
          <div className="input">
            <TextInput
              ref={accountInputRef}
              value={userData?.account || ''}
              onChange={(val) => {
                return updateUserData('account', val);
              }}
              placeholder={t('placeholder.email')}
              maxLength={30}
            />
            <IconEdit onClick={() => {
              accountInputRef?.current?.toggleView();
            }}
              style={{ fontSize: '20px', marginLeft: '6px' }}
            />
          </div>
        </div>
        <div className='email'>
          <div className='title'>{t('sign.email')}</div>
          <div className="input">
            <TextInput
              ref={eamilInputRef}
              value={userData?.email || ''}
              onChange={(val) => {
                return updateUserData('email', val);
              }}
              placeholder={t('text.please_enter_email')}
              maxLength={30}
            />
            <IconEdit onClick={() => {
              eamilInputRef?.current?.toggleView();
            }}
              style={{ fontSize: '20px', marginLeft: '6px' }}
            />
          </div>
        </div>
        <div className="password">
          <div className='title'>{t('sign.password')}</div>
          <div className="input">
            <span className='text-view'>********</span>
            <IconEdit onClick={() => {
              setViewEditPassword(true);
            }}
              style={{ fontSize: '20px', marginLeft: '6px' }}
            />
          </div>
        </div>
        <div className="team-role">
          <div className="title">{t('text.role_team')}</div>
          {isArray(userData?.team_list) && userData.team_list.length > 0 && (
            <div className="list">
              {userData.team_list.map((item) => (
                <div key={item?.team_id} className='item'>
                  {item?.team_name || '-'}
                  {'-'}
                  {item?.role_name || '-'}
                </div>
              ))}
            </div>
          )}

        </div>
        <div className='quit-login'>
          <Button onClick={() => {
            // 清楚用户信息
            clearUserData();
            onCancel();
            navigate('/login');
            Message.success(t('message.quitSuccess'));
          }}>{t('btn.quit')}</Button>
        </div>
      </Modal >
    </>
  )
};

export default UserCenter;