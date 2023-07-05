import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import { Input, Button, Dropdown, Menu, Message, } from '@arco-design/web-react';
import { IconStar, IconStarFill, IconMore } from '@arco-design/web-react/icon';
import Bus from '@utils/eventBus';
import { useTranslation } from 'react-i18next';
import { ServiceGetUserVerifyUsable } from '@services/user';
import { FotmatTimeStamp, openLinkInNewTab } from '@utils';
import { serviceTeamCollection } from '@services/team';
import UserHeadPortraitList from './userHeadPortraitList';
import context from '../Context';
import './index.less';
import { isArray } from 'lodash';
import { FE_WOEK_URL } from '@config';

const TeamListItem = (props) => {
  const { value } = props;
  const { t } = useTranslation();
  const {
    CURRENT_TEAM_ID,
    setCURRENT_TEAM_ID,
    updateTeamList,
    current_team,
  } = useContext(context);

  const onClickMenuItem = (key, team_id) => {
    switch (key) {
      case 'joinTeam':
        ServiceGetUserVerifyUsable({team_id}).then((res)=>{
          if(res?.code == 0 && res?.data?.is_usable){
            let newTabUrl = `${FE_WOEK_URL}/#/index?team_id=${team_id}`;
            openLinkInNewTab(newTabUrl);
          }else{
            Message.error('您当前不在该团队中!');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }
        })
        break;
      case 'addMember': //添加成员
        if (value?.type == 1) {
          Message.error(t('text.team_add_member_error'))
          return;
        }
        Bus.$emit('openModal', 'InternalMember', {
          team_id,
          updateTeamList
        });
        break;
      case 'teamMember':
        Bus.$emit('openModal', 'TeamMember', {
          team_id,
          updateTeamList,
          type: current_team?.type
        });
        break;
      default:
        break;
    }
  }

  const renderDropList = (team_id) => {
    return (
      <Menu onClickMenuItem={(key) => onClickMenuItem(key, team_id)}>
        <Menu.Item key='joinTeam'>{t("text.join_team")}</Menu.Item>
        <Menu.Item key='addMember'>{t("text.add_member")}</Menu.Item>
        <Menu.Item key='teamMember'>{t("modal.teamMemTitle")}</Menu.Item>
      </Menu>
    )
  };
  const teamCollection = async (team_id, is_collect) => {
    try {
      const resp = await serviceTeamCollection({
        team_id,
        status: is_collect ? 2 : 1 //状态：1-收藏，2-取消收藏
      })
      if (resp?.code == 0) {
        updateTeamList();
        Message.success(is_collect ? t('text.cancel_collect') : t('text.collect_success'));
      }
    } catch (error) { }
  }
  return (
    <div className={cn('team-list-item', {
      active: value?.team_id == CURRENT_TEAM_ID,
    })} onClick={() => {
      value?.team_id && setCURRENT_TEAM_ID(value.team_id);
    }}>
      <div className="header">
        <div className="left">
          <div
            className={cn('team-type', {
              parvite: value?.type == 1,
            })}>
            {value?.type == 1 ? t('text.pr') : t('text.pu')}
          </div>
          <div className="name text-ellipsis">
            {value?.name || ''}
          </div>
        </div>
        <div className="right" onClick={(e) => {
          e.stopPropagation();
        }}>
          {value?.is_collect ?
            <IconStarFill style={{ fontSize: '20px', cursor: 'pointer', color: '#F7C131' }} onClick={() => teamCollection(value?.team_id, value?.is_collect)} />
            : <IconStar onClick={() => teamCollection(value?.team_id, value?.is_collect)} style={{ fontSize: '20px', cursor: 'pointer' }} />}
          <Dropdown trigger="click" droplist={renderDropList(value?.team_id)}>
            <IconMore style={{ fontSize: '20px' }} />
          </Dropdown>
        </div>
      </div>
      <UserHeadPortraitList value={value?.members || []} team_id={value?.team_id} />
      <div className="update-time">{t("text.recently_updated")}: {FotmatTimeStamp(value?.updated_time_sec, 'YYYY-MM-DD HH:mm:ss') || '-'}</div>
      <div className="submit">
        <Button onClick={() => {
          let newTabUrl = `${FE_WOEK_URL}/#/index?team_id=${value?.team_id}`;
          openLinkInNewTab(newTabUrl);
        }}>{t("text.join_team")}</Button>
      </div>
    </div >
  )
};

export default TeamListItem;