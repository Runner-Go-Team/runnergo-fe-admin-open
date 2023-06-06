import React, { useContext, useEffect, useState } from 'react';
import { Button, Select, Modal, Message, Tooltip } from '@arco-design/web-react';
import { removeCompanyMember, companyRoleUpdate, updateCompanyMember } from '@services/company';
import './memberTable.less';
import context from './Context';
import { useTranslation } from 'react-i18next';
import { ServiceGetUserInfo } from '@services/user';
import { ServiceGetUserRole } from '@services/role';
import { debounce, isArray, isPlainObject } from 'lodash';
import { FotmatTimeStamp } from '@utils';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const Option = Select.Option;
function Table(props) {
  const { value } = props;
  const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
  const [companyRoleList, setCompanyRoleList] = useState([]);
  const { t } = useTranslation();
  const {
    initMemberList
  } = useContext(context);
  const company_id = localStorage.getItem('company_id');
  useEffect(() => {
    ServiceGetUserRole({
      company_id,
    }).then((res) => {
      if (res?.code == 0 && isArray(res?.data?.usable_roles)) {
        setCompanyRoleList(res?.data?.usable_roles)
      }
    });
  }, []);

  const disableMember = (user, status) => {
    Modal.confirm({
      title: `${status == 1 ? t('text.disable') : t('text.restore')}${t('text.account')}`,
      className: "runnerGo-disable-member-modal",
      style: {
        width: '414px',
        height: '220px',
      },
      content: <p style={{maxHeight:'80px'}}>
        {`${t('btn.ok')}${status == 1 ? t('text.disable') : t('text.restore')}${user?.nickname || '-'}${t('text.of_account')}？
        ${status == 1 ? t('text.disable') : t('text.restore')}${t('text.after')}，${t('text.account')}${user?.account || '-'}${t('text.will')}${status == 1 ? t('text.unable_to') : t('text.normal')}${t('text.login_current_company')}。`}
      </p>,
      closable: true,
      icon: null,
      onOk: () => {
        return new Promise((resolve, reject) => {
          updateCompanyMember({
            company_id, //企业id
            target_user_id: user?.user_id, //目标用户ID
            status: status == 1 ? 2 : 1 //状态：1-正常，2-已禁用
          }).then(res => {
            if (res?.code == 0) {
              Message.success(status == 1 ? t('text.disable_success') : t('text.restore_success'));
              initMemberList();
              resolve();
            }
            reject();
          }).catch(err => reject())
        })
      },
    });
  }

  const deleteMember = (user) => {
    Modal.confirm({
      title: t('text.delete_account'),
      className: "runnerGo-delete-member-modal",
      style: {
        width: '414px',
        height: '220px',
      },
      content: <p>
        {`${t('modal.deletePreset1')}${user?.nickname || '-'}${t('text.of_account')}？
        ${t('text.after_deletion')}，${t('text.account')}${user?.account || '-'}${t('text.cannot_current_company')}。`}
      </p>,
      closable: true,
      icon: null,
      onOk: () => {
        return new Promise((resolve, reject) => {
          try {
            removeCompanyMember({
              company_id: localStorage.getItem('company_id'), //企业id
              target_user_id: user?.user_id //目标用户ID
            }).then((res) => {
              if (res?.code == 0) {
                Message.success(t('text.delete_member_success'));
                initMemberList();
                resolve();
              }
              reject()
            })
          } catch (error) {
            reject(error)
          }

        })
      },
    });
  }
  const viewTeamClick = debounce(async (user_id) => {
    try {
      ServiceGetUserInfo({
        target_user_id: user_id
      }).then((res) => {
        if (res?.code == 0 && isPlainObject(res?.data)) {
          Bus.$emit('openModal', 'ViewTeam', {
            userData: res?.data
          })
        }
      })
    } catch (error) { }
  }, 200);
  return (
    <>
      <div className="member-table">
        <div className="table-row header">
          <div className="table-cell name">{t('sign.nickname')}</div>
          <div className="table-cell account-number">{t('text.account')}</div>
          <div className="table-cell company-role">{t('text.company_role')}</div>
          <div className="table-cell inviter">{t('text.inviter')}</div>
          <div className="table-cell operation">{t('modal.handle')}</div>
        </div>
        {isArray(value) && value.map((item) => (<div key={item?.user_id} className="table-row">
          <div className="table-cell name">
            <img src={item?.avatar} alt="" />
            <span>
              {item?.nickname || '-'}
            </span>
          </div>
          <div className="table-cell account-number">{item?.account || '-'}</div>
          <div className="table-cell company-role">{item?.role_name || '-'}</div>
          <div className="table-cell inviter">{item?.invite_user_name || '-'}</div>
          <div className="table-cell operation">
            <Button style={{ color: 'var(--theme-color)' }} onClick={() => viewTeamClick(item?.user_id)} type='text'>{t('text.view_team')}</Button>
            {item?.is_operable_company_role && (
              <Tooltip disabled={companyPermissions.includes('company_set_role_member')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                <Button disabled={!companyPermissions.includes('company_set_role_member')} onClick={() => Bus.$emit('openModal', 'CompanyRoleUpdate', {
                  user: item,
                  initRoleMemberList: initMemberList,
                  roleList: companyRoleList
                })} type='text'>{t('text.change_role')}</Button>
              </Tooltip>
            )}
            {item?.is_operable_disable_member && (
              <Tooltip disabled={companyPermissions.includes('company_update_member')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                <Button disabled={!companyPermissions.includes('company_update_member')} type='text' onClick={() => disableMember(item, item?.status)}>{item?.status == 1 ? t('text.disable') : t('text.restore')}</Button>
              </Tooltip>
            )}
            {item?.is_operable_remove_member && (
              <Tooltip disabled={companyPermissions.includes('company_remove_member')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                <Button disabled={!companyPermissions.includes('company_remove_member')} type='text' onClick={() => deleteMember(item)}>{t('btn.delete')}</Button>
              </Tooltip>
            )}
          </div>
        </div>))}
      </div>
    </>
  );
}
export default Table;