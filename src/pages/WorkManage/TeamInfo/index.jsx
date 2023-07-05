import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Input, Button, Modal, Message, Tooltip } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/TextInput';
import Empty from '@components/Empty'
import { FE_WOEK_URL } from '@config';
import { ServiceGetUserVerifyUsable } from '@services/user';
import { FotmatTimeStamp, openLinkInNewTab } from '@utils';
import { updateTeamInfo, serviceDisbandTeam, serviceTeamStressPlanList, serviceTeamAutoPlanList } from '@services/team';
import context from '../Context';
import Bus from '@utils/eventBus';
import './index.less';
import { debounce, isArray, isString, trim } from 'lodash';
import { useSelector } from 'react-redux';
const TextArea = Input.TextArea;

const TeamInfo = (props) => {
  const { value } = props;
  const {
    updateTeamData,
    updateTeamList,
    CURRENT_TEAM_ID
  } = useContext(context);
  const [planList, setPlanList] = useState([]);
  const teamPermissions = useSelector((store) => store?.permission?.teamPermissions?.[value?.team_id]) || [];
  const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
  const checkPermission = useCallback((mark) => {
    if (teamPermissions.includes(mark) || companyPermissions.includes(mark)) {
      return true;
    }
    return false;
  }, [teamPermissions, companyPermissions])
  const textInputRef = useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = useState(null);
  const [disbandTeamVisible, setDisbandTeamVisible] = React.useState(false);
  useEffect(() => {
    setText(null);
  }, [CURRENT_TEAM_ID]);

  const { t } = useTranslation();

  const getPlanList = async () => {
    try {
      let planList_temp = [];
      const resp = await serviceTeamStressPlanList({
        team_id: value?.team_id,
        page: 1,
        size: 10
      });
      if (resp?.code == 0 && isArray(resp?.data)) {
        planList_temp = planList_temp.concat(resp?.data);
      }
      const res = await serviceTeamAutoPlanList({
        team_id: value?.team_id,
        page: 1,
        size: 10
      });
      if (res?.code == 0 && isArray(res?.data)) {
        planList_temp = planList_temp.concat(res?.data);
      }
      setPlanList(planList_temp.sort((a, b) => b?.updated_at - a?.updated_at).slice(0, 10));
    } catch (error) { }
  }

  useEffect(() => {
    if (isString(value?.team_id)) {
      getPlanList();
    }
  }, [value?.team_id]);

  return (
    <div className='team-info'>
      <Modal
        className='runnerGo-team-make-public-modal'
        title={t("text.make_public")}
        visible={visible}
        okText={t('btn.ok')}
        cancelText={t('btn.cancel')}
        onOk={() => {
          updateTeamData(value?.team_id, { team_type: 2 })
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
        style={{ width: 414, height: 220 }}
      >
        <p>
          {t("text.make_public_p_context")}
        </p>
      </Modal>
      <Modal
        className='runnerGo-disband-team-modal'
        title={t("modal.dissmissTeam")}
        visible={disbandTeamVisible}
        okText={t('btn.ok')}
        cancelText={t('btn.cancel')}
        onOk={() => {
          serviceDisbandTeam({
            team_id: value?.team_id
          }).then((res) => {
            if (res?.code == 0) {
              Message.success(t('text.disband_team'));
              updateTeamList();
              setDisbandTeamVisible(false)
            }
          })
        }}
        onCancel={() => setDisbandTeamVisible(false)}
        style={{ width: 414, height: 272 }}
      >
        <p>
          {t('text.sure_disband_team_p')}
        </p>
      </Modal>
      <div className="title">
        <div
          className={cn('team-type', {
            parvite: value?.type == 1,
          })}>
          {value?.type == 1 ? t('text.pr') : t('text.pu')}
        </div>
        <div className="name">
          <TextInput
            ref={textInputRef}
            value={value?.name}
            onChange={(val) => {
              return updateTeamData(value?.team_id, { name: val })
            }}
            placeholder={t('text.team_name_input')}
            maxLength={30}
          />
        </div>
        <Tooltip disabled={checkPermission('team_update')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
          <IconEdit
            onClick={() => {
              if (!checkPermission('team_update')) {
                return;
              }

              textInputRef?.current?.toggleView();
            }}
            style={{ fontSize: '20px', cursor: !checkPermission('team_update') ? 'not-allowed' : 'pointer' }}
          />
        </Tooltip>

      </div>
      <div className="create_time">
        {t('text.create_time')}: {FotmatTimeStamp(value?.created_time_sec, 'YYYY-MM-DD HH:mm:ss') || '-'}
      </div>
      <div className="description">
        <Tooltip disabled={checkPermission('team_update')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
          <div>
            <TextArea
              value={text == null ? value?.description || '' : text}
              onChange={(val) => { setText(val) }}
              onBlur={(val) => {
                if(value?.description != val?.target?.value){
                  updateTeamData(value?.team_id, { description: val?.target?.value })
                }
              }} disabled={!checkPermission('team_update')}
              spellCheck='false' placeholder={t('text.team_description_placeholder')} style={{ minHeight: 100, width: 316, resize: 'none' }} maxLength={100} />
          </div>
        </Tooltip>
      </div>
      <div className="operation-btn">
        <Button onClick={() => {
          ServiceGetUserVerifyUsable({ team_id: value?.team_id }).then((res) => {
            if (res?.code == 0 && res?.data?.is_usable) {
              let newTabUrl = `${FE_WOEK_URL}/#/index?team_id=${value?.team_id}`;
              openLinkInNewTab(newTabUrl);
            } else {
              Message.error('您当前不在该团队中!');
              setTimeout(() => {
                location.reload();
              }, 1500);
            }
          })

        }}>{t('text.join_team')}</Button>
        {value?.type == 1 ?
          (
            <Tooltip disabled={checkPermission('team_update')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
              <Button disabled={!checkPermission('team_update')} onClick={() => setVisible(true)} type='outline'>{t('text.make_public')}</Button>
            </Tooltip>
          )
          : <Button onClick={() => Bus.$emit('openModal', 'InternalMember', {
            team_id: value?.team_id,
            updateTeamList
          })} type='outline'>{t('text.add_member')}</Button>}

      </div>
      <div className="latest-plan-title">{t("text.latest_plan")}</div>
      <div className="footer">
        <div className="latest-plan-list">
          {isArray(planList) && planList.length > 0 ? (
            planList.map((item) => (<div className='list-item' key={item?.plan_id}>
              <div className="left">
                <label>{t('text.operator')}</label>
                <div className="user-data">
                  <img className="head-portrait" src={item?.user_avatar || '-'} alt="" />
                  <div className="name text-ellipsis">{item?.username || '-'}</div>
                </div>
              </div>
              <div className="right">
                <label>{item?.plan_type == 'auto' ? t('text.auto_plan_name') : t('text.stress_plan_name')}</label>
                <div className="name text-ellipsis">
                  {item?.plan_name || '-'}
                </div>
              </div>
            </div>))
          ) : <div className='not-plan'><Empty /></div>}
        </div>
        <Tooltip disabled={checkPermission('team_disband')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
          <Button className='arco-btn-error' disabled={!checkPermission('team_disband')} onClick={() => setDisbandTeamVisible(true)}>{t('modal.dissmissTeam')}</Button>
        </Tooltip>
      </div>
    </div>
  )
};

export default TeamInfo;