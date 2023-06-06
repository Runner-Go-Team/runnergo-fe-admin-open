import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Tooltip } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { FotmatTimeStamp } from '@utils/index';
import Bus from '@utils/eventBus';
import context from '../Context';
import './index.less';
import { isArray } from 'lodash';

const UserHeadPortraitList = (props) => {
  const { value, team_id } = props;

  const {
    updateTeamList,
    current_team
  } = useContext(context);

  const { t } = useTranslation();
  const renderList = (list) => {
    const temp_list = list.slice(0, 7);
    let zIndex = -1;
    return (<>
      {temp_list.map((item) => {
        zIndex++;
        return (
          <div key={item?.user_id} className='user-list-item' style={{ zIndex, marginLeft: `${zIndex > 0 ? -10 : 0}px` }}>
            <Tooltip position='top' trigger='hover' content={<div>
              <div className="name"> {t('sign.nickname')}:{item?.nickname || '-'}</div>
              <div className="account">{t('text.account')}:{item?.account || '-'}</div>
            </div>}>
              <img src={item?.avatar} alt="" />
            </Tooltip>

          </div>
        )
      })}
      {list.length > 7 && (
        <div onClick={(e) => {
          e.stopPropagation();
          Bus.$emit('openModal', 'TeamMember', {
            team_id,
            updateTeamList,
            type: current_team?.type
          })
        }} key={list.length} className='user-list-more' style={{ zIndex: zIndex + 1, marginLeft: '-10px', cursor: 'pointer' }}>
          {`${list.length}+`}
        </div>
      )}
    </>)
  }
  return (
    <div className="user-list">
      {isArray(value) && value.length > 0 ?
        renderList(value)
        : t('text.not_user')}
    </div>
  )
};

export default UserHeadPortraitList;
