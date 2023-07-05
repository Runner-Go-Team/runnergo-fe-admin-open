import { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Select, Message, Input, Pagination } from '@arco-design/web-react';
import { FotmatTimeStamp } from '@utils';
import { ServiceGetUserRole } from '@services/role';
import { companyRoleUpdate } from '@services/company';
import context from './Context';
import { serviceTeamRoleUpdate } from '@services/team';
import { debounce, isArray } from 'lodash';
import React from 'react';
import Bus from '@utils/eventBus';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@arco-design/web-react/icon';

const Option = Select.Option;
const RoleMemberList = (props) => {
  const { value, company_id, team_id } = props;
  const {
    initRoleMemberList,
  } = useContext(context);
  const { t } = useTranslation();
  const columns = [
    {
      title: t('sign.nickname'),
      dataIndex: 'nickname',
      render: (col, item) => (<>
        <img style={{ verticalAlign: 'middle', borderRadius: '50%' }} width={20} height={20} src={item?.avatar} alt="" />
        <span style={{ marginLeft: '13px', verticalAlign: 'middle' }}>{item?.nickname}</span>
      </>),
      ellipsis: true
    },
    {
      title: t('text.account'),
      dataIndex: 'account',
      ellipsis: true
    },
    {
      title: t('text.role_authorizer'),
      dataIndex: 'invite_user_name',
      render: (col) => (<span>
        {col || '-'}
      </span>),
      ellipsis: true
    },
    {
      title: t('text.role_authorizer_time'),
      dataIndex: 'invite_time_sec',
      render: (col) => (<span>
        {FotmatTimeStamp(col, 'YYYY-MM-DD') || '-'}
      </span>),
      ellipsis: true
    },
    {
      title: t('modal.handle'),
      dataIndex: '',
      render: (col, item) => (
        <span>
          {item?.is_operable_role ? <Button onClick={() => Bus.$emit('openModal', 'CompanyRoleUpdate', {
            user: item, initRoleMemberList,
            company_id, team_id
          })} type='text'>{t('text.change')}</Button> : null}
        </span>
      )
    },
  ];
  // const getNewColumns = () => {
  //   if (isArray(value) && value.length > 0 && value?.[0]?.team_name) {
  //     return [{
  //       title: '所属团队',
  //       dataIndex: 'team_name',
  //       ellipsis: true
  //     }, ...columns]
  //   }
  //   return columns;
  // }
  return (
    <>
      <div className='role-member-list'>
        <Table scroll={{y:true}} pagination={false} ellipsis={true} borderCell={true} columns={columns} data={value} />
      </div>
    </>

  );
}

export default RoleMemberList;
