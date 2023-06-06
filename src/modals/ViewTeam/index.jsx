import React, { useState } from 'react';
import { Modal, Button, Table, Message } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { ServiceNewRole } from '@services/role';
import './index.less';
import { isArray, trim } from 'lodash';
import { FotmatTimeStamp } from '@utils';

const ViewTeamModal = (props) => {
  const { onCancel, userData } = props;
  const { user_info, team_list } = userData || {};
  const { t } = useTranslation();

  const columns = [
    {
      title: t('text.belong_to_team'),
      dataIndex: 'team_name',
      ellipsis: true
    },

    {
      title: t('text.role'),
      dataIndex: 'role_name',
      ellipsis: true
    },
    {
      title: t('text.join_date'),
      dataIndex: 'join_time_sec',
      ellipsis: true,
      render: (col) => (<span>
        {col ? (FotmatTimeStamp(col, 'YYYY-MM-DD') || '-') : '-'}
      </span>),
    },
  ];

  return (
    <Modal
      title={t('text.view_team')}
      className="runnerGo-viewteam-modal"
      visible
      onOk={() => onCancel()}
      onCancel={() => onCancel()}
      autoFocus={false}
      focusLock={true}
      footer={
        <>
          <Button
            className='btn-close'
            onClick={() => {
              onCancel();
            }}
          >
            {t('btn.close')}
          </Button>
        </>
      }
    >
      <div className="user-name ">
        <img src={user_info?.avatar} alt="" />
        <span className="nickname text-ellipsis"> {user_info?.nickname}</span>
        <span className='account text-ellipsis'>{`(${user_info?.account})`}</span>
      </div>
      {/* <div className="company_role">
        <label>企业角色：</label>
      </div> */}
      <div className="team_role">
        <div className='title'>{t('text.role_team')}：</div>
        {isArray(team_list) && (
          <Table pagination={false} ellipsis={true} borderCell={true} columns={columns} data={team_list || []} />
        )}
      </div>

    </Modal>
  )
};

export default ViewTeamModal;