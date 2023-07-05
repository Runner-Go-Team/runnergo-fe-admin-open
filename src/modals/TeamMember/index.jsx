import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Checkbox, Select, Message, Pagination } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { IconSearch } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import { FotmatTimeStamp } from '@utils';
import { getTeamDetail, removeTeamMember, serviceTeamManagerHandOver, serviceTeamRoleUpdate } from '@services/team';
import { companyRoleUpdate } from '@services/company';
import { getRoleList } from '@services/role';
import { ServiceGetUserRole } from '@services/role';
import IconInviteMember from '@assets/invite_member.svg';
import './index.less';
import { debounce, isArray, isNumber } from 'lodash';
const Option = Select.Option;

const TeamMember = (props) => {
  const { onCancel, team_id, updateTeamList, type } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [removeUser, setRemoveUser] = useState({});
  const [createdUserId, setCreatedUserId] = useState('');
  const [teamMemberList, setTeamMemberList] = useState([]);
  const [companyRoleList, setCompanyRoleList] = useState([]);
  const [teamRoleList, setTeamRoleList] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const user_id = useSelector((store) => store?.user?.user_id);
  const company_id = localStorage.getItem('company_id');
  const updateTeamMemberList = () => {
    getTeamDetail({ team_id, keyword: searchValue || '', page, size: pageSize }).then((res) => {
      if (res?.code == 0) {
        if (isArray(res?.data?.team?.members)) {
          setCreatedUserId(res?.data?.team?.created_user_id || '');
          setTeamMemberList(res?.data?.team?.members);
        }
        if (isNumber(res?.data?.total)) {
          setTotal(res.data.total);
        }
      }
    });
    // 获取企业角色列表
    ServiceGetUserRole({
      company_id,
    }).then((res) => {
      if (res?.code == 0 && isArray(res?.data?.usable_roles)) {
        setCompanyRoleList(res?.data?.usable_roles)
      }
    });

    // 获取团队角色列表
    ServiceGetUserRole({
      team_id,
    }).then((res) => {
      if (res?.code == 0 && isArray(res?.data?.usable_roles)) {
        setTeamRoleList(res?.data?.usable_roles)
      }
    });
  }
  const debounceUpdateTeamMemberList = debounce(() => updateTeamMemberList(), 200);
  useEffect(() => {
    updateTeamMemberList();
  }, [page, pageSize]);

  useEffect(() => {
    if (searchValue != null) {
      if (page != 1) {
        // 回到第一页
        setPage(1);
      } else {
        debounceUpdateTeamMemberList();
      }
    }
  }, [searchValue])

  const transferSuperTeam = (user) => {
    Modal.confirm({
      title: t('text.transition_team_admin'),
      className: "runnerGo-handover-super-team-modal",
      style: {
        width: '414px',
        height: '220px',
      },
      content: <p style={{ maxHeight: '80px' }}>
        {`${t('text.confirm_transfer_team_admin')}“${user?.nickname || '-'}”？${t('text.transfer_team_admin_success_prompt')}`}
      </p>,
      closable: true,
      icon: null,
      onOk: () => {
        return new Promise((resolve, reject) => {
          serviceTeamManagerHandOver({
            team_id: team_id,
            target_user_id: user?.user_id
          }).then((res) => {
            if (res?.code == 0) {
              Message.success(`${t('text.transfer_team_admin_success')}!`);
              updateTeamMemberList();
              resolve();
            }
            reject()
          }).catch(err => reject())
        })
      },
    });
  }

  return (
    <>
      <Modal
        title={t('modal.delMem')}
        visible={visible}
        okText={t('btn.ok')}
        cancelText={t('btn.cancel')}
        onOk={() => {
          removeTeamMember({
            team_id,
            target_user_id: removeUser?.user_id,
          }).then((res) => {
            if (res?.code == 0) {
              Message.success(t('text.transfer_team_member_success'))
              updateTeamMemberList();
              setVisible(false)
            }
          })
        }}
        onCancel={() => setVisible(false)}
        style={{ width: 414, height: 200 }}
      >
        <p style={{ maxHeight: '59px' }}>
          {t('btn.okDelMum')}{removeUser?.nickname || '-'}
        </p>
      </Modal>
      <Modal
        title={t('modal.teamMemTitle')}
        className="runnerGo-team-member-modal"
        visible
        onOk={() => onCancel()}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={true}
        footer={<>
          <Pagination pageSize={pageSize} onPageSizeChange={(val) => {
            setPageSize(val);
          }} size='default' current={page} onChange={(val) => {
            setPage(val);
          }} total={total} showTotal showJumper sizeCanChange sizeOptions={[20, 30, 40, 50, 80, 100]} />
        </>}
      >
        <div className="member-search-input">
          <Input allowClear value={searchValue || ''} onChange={setSearchValue} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={t('text.search_account_or_nickname')} />
          <Button onClick={() => {
            if (type == 1) {
              Message.error(t('text.team_add_member_error'))
              return;
            }
            Bus.$emit('openModal', 'InternalMember', {
              team_id,
              updateTeamList,
              updateTeamMemberList
            })
          }}><IconInviteMember className="arco-icon"></IconInviteMember> {t('text.add_member')}</Button>
        </div>


        <div className="member-title">
          <div className="name">{t('sign.nickname')}</div>
          <div className="join-time">{t('text.join_date')}</div>
          <div className="inviter">{t('text.inviter')}</div>
          <div className="company-role">{t('text.company_role')}</div>
          <div className="team-role">{t('text.role_team')}</div>
          <div className="operation">{t('modal.handle')}</div>
        </div>
        <div className="member-list">
          {isArray(teamMemberList) && teamMemberList.length > 0 && teamMemberList.map((item) => (<div key={item?.user_id} className="member-item">
            <div className='name'>
              <div className="headPortrait">
                <img src={item?.avatar} alt="" />
              </div>
              <div className="userData">
                <div className='name text-ellipsis'>
                  {item?.nickname}
                  {createdUserId == item?.user_id && (<span>（{t('text.creator')}）</span>)}
                  {user_id === item?.user_id && (<span>（{t('modal.me')}）</span>)}
                </div>
                <div className="email text-ellipsis">{item?.account}</div>
              </div>
            </div>
            <div className="join-time">{item?.join_time_sec ? (FotmatTimeStamp(item?.join_time_sec, 'YYYY-MM-DD HH:mm') || '-') : "-"}</div>
            <div className="inviter text-ellipsis">{item?.invite_user_name || '-'}</div>
            <div className="company-role">
              {item?.is_operable_company_role && isArray(companyRoleList) && companyRoleList.length > 0 ? (
                <Select
                  placeholder={t('text.select_company_role')}
                  bordered={false}
                  style={{ width: 90, height: 36 }}
                  onChange={(value) => {
                    companyRoleUpdate({
                      company_id, //企业id
                      role_id: value, //角色ID
                      target_user_id: item?.user_id //目标用户ID
                    }).then((res) => {
                      if (res?.code == 0) {
                        Message.success(t('text.update_company_role_success'));
                        updateTeamMemberList();
                      }
                    });
                  }}
                  value={item?.company_role_name}
                  getPopupContainer={() => document.body}
                  triggerProps={{
                    autoAlignPopupWidth: false,
                    autoAlignPopupMinWidth: true,
                    position: 'bl',
                  }}
                >
                  {companyRoleList.map((i) => (
                    <Option key={i?.role_id} value={i?.role_id}>
                      {i?.name}
                    </Option>
                  ))}
                </Select>
              ) : item?.company_role_name || '-'}
            </div>
            <div className="team-role">
              {item?.is_operable_team_role && isArray(teamRoleList) && teamRoleList.length > 0 ? (
                <Select
                  placeholder={t('text.role_team_select')}
                  bordered={false}
                  style={{ width: 90, height: 36 }}
                  onChange={(value) => {
                    serviceTeamRoleUpdate({
                      team_id, //团队id
                      role_id: value, //角色ID
                      target_user_id: item?.user_id //目标用户ID
                    }).then((res) => {
                      if (res?.code == 0) {
                        Message.success(t('text.update_team_role_success'));
                        updateTeamMemberList();
                      }
                    });
                  }}
                  value={item?.team_role_name}
                  getPopupContainer={() => document.body}
                  triggerProps={{
                    autoAlignPopupWidth: false,
                    autoAlignPopupMinWidth: true,
                    position: 'bl',
                  }}
                >
                  {teamRoleList.map((i) => (
                    <Option key={i?.role_id} value={i?.role_id}>
                      {i?.name}
                    </Option>
                  ))}
                </Select>
              ) : item?.team_role_name || '-'}
            </div>
            <div className="operation">
              {item?.is_transfer_super_team && (<Button style={{ marginRight: '8px' }} onClick={() => {
                transferSuperTeam(item);
              }} type='text'>{t('text.hand_over')}</Button>)}
              {item?.is_operable_remove_member && (
                <Button
                  onClick={() => {
                    setRemoveUser(item);
                    setVisible(true);
                  }} type='text'>{t('text.remove')}</Button>
              )}
            </div>
          </div>))}
        </div>
      </Modal >
    </>
  )
};

export default TeamMember;