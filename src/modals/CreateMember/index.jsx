import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, Tooltip, Message } from '@arco-design/web-react';
import { IconQuestionCircle, IconPlus } from '@arco-design/web-react/icon';
import { addCompanyMember, getSimpleCompanyTeamList } from '@services/company';
import { ServiceGetUserRole } from '@services/role';
import { useTranslation } from 'react-i18next';
import './index.less';
import { debounce, isArray, isPlainObject, trim } from 'lodash';
import { EamilReg } from '@utils';

const Option = Select.Option;
const CreateMember = (props) => {
  const { onCancel,initMemberList } = props;
  const company_id = localStorage.getItem('company_id');
  const [simpleTeamList, setSimpleTeamList] = useState([]);
  const [companyRoleList, setCompanyRoleList] = useState([]);
  const [data, setData] = useState({
    account: '', // 账号
    password: '', // 密码
    nickname: '', //昵称
    role_id: '', // 企业角色
    email: '', // 邮箱
    team_detail: [] //团队列表
  });

  const { t } = useTranslation();

  // 获取一个剩下未选中的团队
  const selectTeamItem = () => {
    for (let index = 0; index < simpleTeamList.length; index++) {
      const item = simpleTeamList[index];
      if (!data?.team_detail.some((i) => i?.team_id == item?.team_id)) {
        return item;
      }
    }
    return null;
  }

  const onChange = (key, value) => {
    setData({ ...data, [key]: value });
  }

  const addTeam = debounce(async () => {
    const nextTeam = selectTeamItem();
    if (nextTeam != null && isPlainObject(nextTeam)) {
      // 获取团队可选角色列表
      const result = await ServiceGetUserRole({ company_id, team_id: nextTeam?.team_id });
      if (result?.code == 0 && isArray(result?.data?.usable_roles) && result?.data?.usable_roles.length > 0) {
        onChange('team_detail', [...data.team_detail, {
          team_id: nextTeam?.team_id,
          role_id: result?.data?.usable_roles?.[0].role_id,
          role_list: result?.data?.usable_roles
        }])
      }
    } else {
      Message.error(t('text.no_team_add'));
    }
  }, 200);

  const selectTeam = debounce(async (old_team_id, new_team_id) => {
    const temp_team_detail = [...data?.team_detail];
    if (temp_team_detail.some((i) => i?.team_id == new_team_id)) {
      Message.error(t('text.team_has_added'))
      return;
    }
    const indexToReplace = temp_team_detail.findIndex(item => item.team_id === old_team_id);
    if (indexToReplace !== -1) {
      // 获取团队可选角色列表
      const result = await ServiceGetUserRole({ company_id, team_id: new_team_id });
      if (result?.code == 0 && isArray(result?.data?.usable_roles) && result?.data?.usable_roles.length > 0) {
        const newDetail = {
          team_id: new_team_id,
          role_id: result?.data?.usable_roles?.[0].role_id,
          role_list: result?.data?.usable_roles
        };
        temp_team_detail[indexToReplace] = newDetail;
        onChange('team_detail', temp_team_detail)
      }
    }
  }, 200)

  const deleteTeam = (team_id) => {
    const temp_list = [...data.team_detail];
    const indexToDelete = temp_list.findIndex(item => item?.team_id === team_id);
    if (indexToDelete !== -1) {
      temp_list.splice(indexToDelete, 1);
      onChange('team_detail', temp_list)
    }
  }

  const updateTeamRole = (team_id, role_id) => {
    const temp_list = [...data.team_detail];
    const indexToDelete = temp_list.findIndex(item => item?.team_id === team_id);
    if (indexToDelete !== -1) {
      temp_list[indexToDelete].role_id = role_id;
      onChange('team_detail', temp_list)
    }
  }

  const init = async () => {
    try {
      const resp = await getSimpleCompanyTeamList({
        company_id
      });
      if (resp?.code == 0 && isArray(resp?.data?.teams)) {
        setSimpleTeamList(resp?.data?.teams.filter((item)=>item?.type == 2));
      }
      const result = await ServiceGetUserRole({ company_id });
      if (result?.code == 0 && isArray(result?.data?.usable_roles)) {
        setCompanyRoleList(result?.data?.usable_roles);
      }
    } catch (error) { }
  }

  useEffect(() => {
    init();
  }, []);

  const onSave = debounce(() => {
    if (trim(data?.account).length < 6) {
      if(trim(data?.account).length <= 0){
        Message.error(t('text.init_account_cannot_null'));
      }else{
        Message.error(t('text.placeholder_create_member_account_error'));
      }
      return;
    }
    if (trim(data?.password).length <= 0) {
      Message.error(t('text.init_password_cannot_null'));
      return;
    }
    if (trim(data?.nickname).length < 2) {
      if(trim(data?.nickname).length <= 0){
        Message.error(t('text.nickname_cannot_null'));
      }else{
        Message.error(t('text.placeholder_create_member_nickname_error'));
      }
      return;
    }
    if (data?.email && !EamilReg(data?.email)) {
      Message.error(t('message.plsInputTrueEmail'));
      return;
    }
    addCompanyMember({
      ...data,
      company_id,
      role_id: data?.role_id || companyRoleList?.[0]?.role_id,
    }).then((res) => {
      if (res?.code == 0) {
        Message.success(t('text.create_member_success'));
        initMemberList && initMemberList();
        onCancel()
      }
    })
  }, 200)

  return (
    <>
      <Modal
        title={t('text.create_member')}
        className="runnerGo-create-member-modal"
        visible
        onOk={() => onCancel()}
        onCancel={onCancel}
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
            <Button
              onClick={onSave}
            >
              {t('btn.save')}
            </Button>
          </>
        }
        style={{ width: 535, height: 650 }}
      >
        <div className="card init-account-number">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{t('text.init_account')}</span>
          </label>
          <Input maxLength={30} allowClear onChange={(val) => onChange('account', val)} value={data?.account || ''} style={{ width: 469, height: 40 }} placeholder={t('text.placeholder_create_member')} />
        </div>
        <div className="card init-account-password">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{t('text.init_password')}</span>
          </label>
          <Input maxLength={30} allowClear onChange={(val) => onChange('password', val)} value={data?.password || ''} style={{ width: 469, height: 40 }} placeholder={t('text.placeholder_create_member')} />
        </div>

        <div className="card init-account-name">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{t('sign.nickname')}</span>
          </label>
          <Input maxLength={30} allowClear onChange={(val) => onChange('nickname', val)} value={data?.nickname || ''} style={{ width: 469, height: 40 }} placeholder={t('text.placeholder_create_member_nickname')} />
        </div>

        <div className="card init-email">
          <label htmlFor="">
            <span>{t('sign.email')}</span>
          </label>
          <Input allowClear onChange={(val) => onChange('email', val)} value={data?.email || ''} style={{ width: 469, height: 40 }} placeholder={t('text.please_enter_email')} />
        </div>

        <div className="card init-comany-role">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{t('text.company_role')}</span>
            <Tooltip position='top' content={t('text.tooltip_question_circle')}>
              <IconQuestionCircle />
            </Tooltip>
          </label>
          {isArray(companyRoleList) && companyRoleList.length > 0 && (
            <Select
              placeholder={t('text.role_team_select')}
              bordered={false}
              style={{ width: 469 }}
              onChange={(value) => {
                onChange('role_id', value);
              }}
              size='large'
              value={data?.role_id || companyRoleList?.[0]?.role_id}
              getPopupContainer={()=>document.body}
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
          )}

        </div>


        <div className="card init-comany-role">
          <label htmlFor="">
            <span>{t('modal.team')}</span>
            <Tooltip position='top' content={t('text.tooltip_team_question_circle')}>
              <IconQuestionCircle />
            </Tooltip>
          </label>
          <div className="select-team-list">
            {isArray(data?.team_detail) && data.team_detail.length > 0 && (
              data.team_detail.map((item) => (
                <div className="select-team-list-item">
                  <span>{t('text.select_team')}：</span>
                  {isArray(simpleTeamList) && simpleTeamList.length > 0 && (
                    <Select
                      placeholder={t('text.select_team')}
                      bordered={false}
                      style={{ width: 138 }}
                      onChange={(value) => {
                        selectTeam(item?.team_id, value);
                      }}
                      size='large'
                      value={item?.team_id}
                      getPopupContainer={()=>document.body}
                      triggerProps={{
                        autoAlignPopupWidth: false,
                        autoAlignPopupMinWidth: true,
                        position: 'bl',
                      }}
                    >
                      {simpleTeamList.map((ii) => (
                        <Option key={ii?.team_id} value={ii?.team_id}>
                          {ii?.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {isArray(item?.role_list) && item?.role_list.length > 0 && (
                    <><span>{t('text.member_role')}：</span><Select
                      placeholder={t('text.role_team_select')}
                      bordered={false}
                      style={{ width: 138 }}
                      onChange={(value) => {
                        updateTeamRole(item?.team_id, value);
                      }}
                      size='large'
                      value={item?.role_id}
                      getPopupContainer={()=>document.body}
                      triggerProps={{
                        autoAlignPopupWidth: false,
                        autoAlignPopupMinWidth: true,
                        position: 'bl',
                      }}
                    >
                      {item?.role_list.map((i) => (
                        <Option key={i?.role_id} value={i?.role_id}>
                          {i?.name}
                        </Option>
                      ))}
                    </Select></>
                  )}
                  <Button type='text' onClick={() => deleteTeam(item?.team_id)}>
                    {t('btn.delete')}
                  </Button>
                </div>
              ))
            )}
            <div className='add-team'>
              <Button style={{
                width: '84px',
                height: '26px'
              }} type='outline' onClick={() => addTeam()}>
                <IconPlus />
                {t('text.add_team')}
              </Button>
            </div>
          </div>
        </div>

      </Modal >
    </>
  )
};

export default CreateMember;