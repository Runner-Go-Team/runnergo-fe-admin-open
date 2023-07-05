import React, { useContext, useEffect, useState } from 'react';
import { Button, Select, Modal, Message, Tooltip, Table, Switch } from '@arco-design/web-react';
import { removeCompanyMember, companyRoleUpdate, updateCompanyMember } from '@services/company';
import './memberTable.less';
import context from './Context';
import { useTranslation } from 'react-i18next';
import { ServiceGetUserInfo } from '@services/user';
import { ServiceGetUserRole } from '@services/role';
import SvgPeople from '@assets/people.svg';
import SvgUpdatePassword from '@assets/updatepassword.svg';
import { debounce, isArray, isPlainObject } from 'lodash';
import { FotmatTimeStamp } from '@utils';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';
import { IconDelete, IconEye } from '@arco-design/web-react/icon';

const Option = Select.Option;
function MemberTable(props) {
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
      content: <p style={{ maxHeight: '80px' }}>
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
  const editPassword=(user)=>{
    Bus.$emit('openModal', 'CompanyEditPassword', {
      user: user,
      initMemberList: initMemberList,
    })
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
  const columns = [
    {
      title: t('sign.nickname'),
      dataIndex: 'nickname',
      render: (col, item) => (<>
        <img style={{ verticalAlign: 'middle', borderRadius: '50%' }} width={20} height={20} src={item?.avatar} alt="" />
        <span style={{ marginLeft: '10px', verticalAlign: 'middle' }}>{item?.nickname}</span>
      </>),
      ellipsis: true
    },
    {
      title: t('text.account'),
      dataIndex: 'account',
      render: (col) => (<span>
        {col || '-'}
      </span>),
      ellipsis: true
    },
    {
      title: t('text.company_role'),
      dataIndex: 'role_name',
      render: (col) => (<span>
        {col || '-'}
      </span>),
      ellipsis: true
    },
    {
      title: t('text.inviter'),
      dataIndex: 'invite_user_name',
      render: (col) => (<span>
        {col || '-'}
      </span>),
      ellipsis: true
    },
    {
      title: t('text.account_status'),
      dataIndex: 'status',
      width: 90,
      render: (col,item) => (
        <Tooltip position='top' trigger='hover' content={col == '1' ? t('text.disable') : t('text.restore')}>
          <Switch onClick={() => disableMember(item, item?.status)} disabled={!item?.is_operable_disable_member} size='small' checked={col == '1'} />
      </Tooltip>
      ),
      ellipsis: true
    },
    {
      title: t('modal.handle'),
      dataIndex: '',
      width: 180,
      render: (col, item) => (
        <div className="operation">
          <Tooltip content={t('text.view_team')}>
            <IconEye onClick={() => viewTeamClick(item?.user_id)} />
          </Tooltip>
          {item?.is_operable_company_role && (
            <Tooltip position='top' trigger='hover' content={companyPermissions.includes('company_set_role_member') ? t('text.change_role') : t('tooltip.permission_denied')}>
              <Button disabled={!companyPermissions.includes('company_set_role_member')} onClick={() => Bus.$emit('openModal', 'CompanyRoleUpdate', {
                user: item,
                initRoleMemberList: initMemberList,
                roleList: companyRoleList
              })} type='text'><SvgPeople /></Button>
            </Tooltip>
          )}

          {item?.is_operable_upt_password && (
            <Tooltip content={t('modal.editPwd')}>
              <Button onClick={() => {
              editPassword(item);
              }} type='text'>
                <SvgUpdatePassword />
              </Button>
            </Tooltip>
          )}

          {item?.is_operable_remove_member && (
            <Tooltip position='top' trigger='hover' content={companyPermissions.includes('company_remove_member') ? t('btn.delete') : t('tooltip.permission_denied')}>
              <Button disabled={!companyPermissions.includes('company_remove_member')} type='text' onClick={() => deleteMember(item)}><IconDelete /></Button>
            </Tooltip>
          )}
        </div>
      )
    },
  ];
  return (
    <>
      <div className="member-table">
        <Table scroll={{ y: true }} pagination={false} ellipsis={true} borderCell={true} columns={columns} data={isArray(value) ? value : []} />
      </div>
    </>
  );
}
export default MemberTable;