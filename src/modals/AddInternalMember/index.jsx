import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Input, Checkbox, Select, Message, Tooltip } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { getRoleList } from '@services/role'
import { getTeamInviteMemberList, addTeamMember } from '@services/team';
import { ServiceGetUserRole } from '@services/role';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import './index.less';
import { debounce, isArray, set } from 'lodash';
import { useSelector } from 'react-redux';
const Option = Select.Option;

const AddInternalMember = (props) => {
  const { onCancel, team_id, updateTeamList,updateTeamMemberList } = props;
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [value, setValue] = useState([]);
  const [defalutValue, setDefalutValue] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [teamRoleList, setTeamRoleList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const teamPermissions = useSelector((store) => store?.permission?.teamPermissions?.[team_id]) || [];
  const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
  const { t } = useTranslation();
  const checkPermission = useCallback((mark) => {
    if (teamPermissions.includes(mark) || companyPermissions.includes(mark)) {
      return true;
    }
    return false;
  }, [teamPermissions, companyPermissions])
  const initCompanyMemberList = async () => {
    try {
      let company_id = localStorage.getItem('company_id');
      // 获取团队角色列表
      const result = await ServiceGetUserRole({ company_id, team_id });
      if (result?.code == 0 && isArray(result?.data?.usable_roles)) {
        setTeamRoleList(result?.data?.usable_roles);
      }
      const resp = await getTeamInviteMemberList({
        team_id,
        keyword: searchValue
      });
      if (isArray(resp?.data?.members)) {
        setMemberList(resp.data.members);
        let initValue = resp?.data?.members.reduce((total, currentValue) => {
          if (Boolean(currentValue?.team_role_id)) {
            total.push(currentValue?.user_id);
          }
          return total;
        }, [])
        if (isArray(initValue) && initValue.length > 0) {
          setValue(initValue);
          setDefalutValue(initValue);
        }
      }
    } catch (error) { }
  }
  const debounceInitCompanyMemberList = debounce(() => initCompanyMemberList(), 200);
  useEffect(() => {
    if (searchValue) {
      debounceInitCompanyMemberList();
    } else {
      initCompanyMemberList();
    }
  }, [searchValue]);

  const onChangeAll = (checked) => {
    if (checked || indeterminate) {
      setCheckAll(true);
      setValue(memberList.map((item) => item?.user_id));
    } else {
      setCheckAll(false);
      setValue([...defalutValue]);
    }
  }
  useEffect(() => {
    if (!!(value.length && value.length !== memberList.length)) {
      setIndeterminate(true);
    } else {
      setIndeterminate(false);
    }
    if (!!(value.length === memberList.length)) {
      setCheckAll(true);
    }
  }, [value])
  const onChange = (checked, user_id) => {
    let temp_check_list = [...value];
    if (checked) {
      const itemExists = temp_check_list.some((item) => item === user_id);
      if (!itemExists) {
        temp_check_list.push(user_id);
        setValue(temp_check_list);
      }
    } else {
      setValue(temp_check_list.filter((item) => item != user_id))
    }
  }

  const isChecked = (user_id) => {
    if (value.includes(user_id)) {
      return true;
    }

    return false;
  }
  const addTeamMemberOnClick = () => {
    const members = memberList.reduce((last, current) => {
      if (value.includes(current?.user_id) && !defalutValue.includes(current?.user_id)) {
        last.push({
          user_id: current?.user_id,
          team_role_id: current?.team_role_id || teamRoleList[0]?.role_id //角色ID
        })
      }
      return last;
    }, []);
    if (!isArray(members) || members.length <= 0) {
      Message.error(t('text.did_not_select_member'));
      return;
    }
    addTeamMember({
      team_id,
      members
    }).then((res) => {
      if (res?.code == 0) {
        Message.success(`${t('message.addSuccess')}!`)
        updateTeamList && updateTeamList();
        updateTeamMemberList && updateTeamMemberList();
        onCancel();
      }
    })
  }
  return (
    <Modal
      title={t('text.add_company_member')}
      className="runnerGo-addinternal-member-modal"
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
          <Tooltip disabled={checkPermission('team_save_member')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
            <Button
              disabled={!checkPermission('team_save_member')}
              onClick={addTeamMemberOnClick}
            >
              {t('btn.add')}
            </Button>
          </Tooltip>

        </>
      }
    >
      <div className="member-search-input">
        <Input allowClear value={searchValue} onChange={setSearchValue} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={t('text.search_account_or_nickname')} />
      </div>


      <div className="member-title">
        <Checkbox onChange={onChangeAll} checked={checkAll} indeterminate={indeterminate}></Checkbox>
        <div className="name">{t('sign.nickname')}</div>
        <div className="company-role">{t('text.company_role')}</div>
        <div className="team-role">{t('text.role_team')}</div>
      </div>
      <div className="member-list">
        {memberList.map((item, i) => {
          let withinTeam = Boolean(item?.team_role_id) && defalutValue.includes(item.user_id);
          return (
            <div key={item?.user_id} className="member-item">
              <Checkbox onChange={(checked) => onChange(checked, item?.user_id)} checked={isChecked(item?.user_id)} disabled={withinTeam}></Checkbox>
              <div className='name'>
                <div className="headPortrait">
                  <img src={item?.avatar} alt="" />
                </div>
                <div className="userData">
                  <div className='name text-ellipsis'>{item?.nickname}</div>
                  <div className="email text-ellipsis">{item?.account}</div>
                </div>
              </div>
              <div className="company-role">{item?.company_role_name}</div>
              <div className="team-role" onClick={(e) => {
                e.preventDefault();
              }}>
                {withinTeam ? (item?.team_role_name || '-') : (
                  isArray(teamRoleList) && teamRoleList.length > 0 && (
                    <Select
                      placeholder={t('text.role_team_select')}
                      bordered={false}
                      style={{ width: 90, height: 20 }}
                      onChange={(value) => {
                        const newItems = memberList.map((i) => {
                          if (i?.user_id == item?.user_id) {
                            return { ...i, team_role_id: value }
                          }
                          return i;
                        }
                        );
                        setMemberList(newItems);
                      }}
                      value={item?.team_role_id || teamRoleList[0]?.role_id}
                      getPopupContainer={()=>document.body}
                      triggerProps={{
                        autoAlignPopupWidth: false,
                        autoAlignPopupMinWidth: true,
                        position: 'bl',
                      }}
                    >
                      {teamRoleList.map((item) => <Option key={item?.role_id} value={item?.role_id}>
                        {item?.name || '-'}
                      </Option>)}
                    </Select>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Modal >
  )
};

export default AddInternalMember;