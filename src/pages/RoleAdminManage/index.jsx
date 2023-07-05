import React, { useEffect, useState } from 'react';
import { Input, Button, Tabs, Modal, Select, Message, Tooltip, Pagination } from '@arco-design/web-react';
import { IconSearch, IconPlus } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import RoleTreeList from './roleTreeList';
import FunctionalAuthority from './functionalAuthority';
import RoleMemberList from './roleMemberList';
import { getSimpleCompanyTeamList } from '@services/company';
import { getRoleList, saveRoleInfo, ServiceGetRoleMemberList, ServiceIsRemoveRole } from '@services/role';
import { getPermissionList } from '@services/permission';
import context from './Context';
import './index.less';
import { debounce, isArray, isNumber, isString } from 'lodash';
import { useSelector } from 'react-redux';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RoleAdminManage = () => {
  const [CURRENT_ROLE, setCURRENT_ROLE] = useState(null);
  const [currentRoleType, setCurrentRoleType] = useState(1);
  const [currentTeamId, setCurrentTeamId] = useState('');
  const [teamList, setTeamList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [roleMemberList, setRoleMemberList] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
  const [checkPremissionKeys, setCheckPremissionKeys] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [roleObj, setRoleObj] = useState({});
  const { Provider } = context;
  const { t } = useTranslation();
  const company_id = localStorage.getItem('company_id');
  const initRoleList = debounce(async () => {
    const resp = await getRoleList({ company_id })
    if (resp?.code == 0 && isArray(resp?.data?.role_list) && resp?.data?.role_list.length > 0) {
      setRoleList(resp?.data?.role_list);
      if (CURRENT_ROLE == null || resp?.data?.role_list.filter(item => item?.role_id == CURRENT_ROLE).length <= 0) {
        setCURRENT_ROLE(resp?.data?.role_list?.[0]?.role_id);
      }
    }
  }, 200)
  const initRoleMemberList = debounce(async () => {
    let param = { role_id: CURRENT_ROLE, keyword: searchValue || '', page, size: pageSize };
    if (currentRoleType === 2) {
      if (currentTeamId) {
        param.team_id = currentTeamId;
      } else {
        setRoleMemberList([]);
        return;
      }
    }
    // 获取角色成员列表
    const res = await ServiceGetRoleMemberList(param)
    if (res?.code == 0) {
      if (isArray(res?.data?.members)) {
        setRoleMemberList(res?.data?.members);
      }
      if (isNumber(res?.data.total)) {
        setTotal(res.data.total);
      }
    }
  }, 200);
  useEffect(() => {
    if (currentRoleType === 2 && currentTeamId) {
      initRoleMemberList();
    }
  }, [currentTeamId]);

  const getCurrentPerMissionList = async () => {
    try {
      const resp = await getPermissionList({ role_id: CURRENT_ROLE })
      if (resp?.code == 0 && isArray(resp?.data?.list) && resp?.data?.list.length > 0) {
        setPermissionList(resp?.data?.list);
      }
    } catch (error) { }
  }

  useEffect(() => {
    if (CURRENT_ROLE != null && isString(CURRENT_ROLE)) {
      setPage(1);
      setPageSize(20);
      // 获取角色权限列表
      getCurrentPerMissionList();
      // 获取角色成员列表
      initRoleMemberList();
      const current = roleList.find((item) => item?.role_id == CURRENT_ROLE)
      setRoleName(current?.name);
      setRoleObj(current || {});
    }
  }, [CURRENT_ROLE]);

  useEffect(() => {
    if (CURRENT_ROLE != null && isString(CURRENT_ROLE)) {
      // 获取角色成员列表
      initRoleMemberList();
    }
  }, [page, pageSize]);

  useEffect(() => {
    if (CURRENT_ROLE != null && isString(CURRENT_ROLE) && searchValue != null) {
      if (page != 1) {
        // 回到第一页
        setPage(1);
      } else {
        initRoleMemberList();
      }
    }
  }, [searchValue])

  useEffect(() => {
    // 获取团队
    if (currentRoleType === 2) {
      getSimpleCompanyTeamList({
        company_id
      }).then(resp => {
        if (resp?.code == 0 && isArray(resp?.data?.teams) && resp.data.teams.length > 0) {
          setCurrentTeamId(resp.data.teams?.[0]?.team_id);
          setTeamList(resp?.data?.teams);
        }
      });
    }
  }, [currentRoleType]);

  useEffect(() => {
    // if (CURRENT_TEAM_ID == '' && teamList.length > 0) {
    //     setCURRENT_TEAM_ID(teamList[0]?.team_id);
    // }
    initRoleList();
  }, []);
  const deleteRole = debounce(async () => {
    try {
      const res = await ServiceIsRemoveRole({ role_id: CURRENT_ROLE });
      if (res?.code == 0 && res?.data?.is_allow_remove) {
        Bus.$emit('openModal', 'RoleDelete', {
          role_id: CURRENT_ROLE,
          initRoleList,
          roleMemberList
        })
      } else {
        Message.error(t('text.role_cannot_delete'))
      }
    } catch (error) { }

  }, 200);
  const saveRole = () => {
    saveRoleInfo({
      role_id: CURRENT_ROLE, //角色ID
      permission_marks: checkPremissionKeys || [], //权限ID 数组
      role_name: roleName
    }).then((res) => {
      if (res?.code == 0) {
        initRoleList();
        getCurrentPerMissionList();
        Message.success(`${t('text.save_role_success')}!`)
      }
    });
  }
  return (
    <Provider value={{
      CURRENT_ROLE,
      setCURRENT_ROLE,
      initRoleMemberList,
      setCurrentRoleType,
      getCurrentPerMissionList,
    }}>
      <div className='role-admin-manage'>
        <div className="title">{t('menu.roleAdmin')}</div>
        <div className="content">
          <div className="left">
            <div className="btn-new-role">
              <Tooltip disabled={companyPermissions.includes('role_save')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                <Button disabled={!companyPermissions.includes('role_save')} type='outline' onClick={() => Bus.$emit('openModal', 'NewRole', {
                  initRoleList
                })}><IconPlus /> {t('text.new_role')}</Button>
              </Tooltip>
            </div>
            <RoleTreeList value={roleList}></RoleTreeList>
          </div>
          <div className="right">
            <div className="header">
              <div className="l"> <div className='role-name'>{t('text.role_name')}：</div>
                <Input allowClear onChange={(val) => setRoleName(val)} value={roleName} placeholder={t('text.please_role_name')}></Input>
                {isArray(teamList) && teamList.length > 0 && currentRoleType === 2 && (
                  <>
                    <div style={{ marginLeft: '12px' }}>{t('text.switch_team')}：</div>
                    <Select
                      placeholder={t('text.select_team')}
                      bordered={false}
                      style={{ width: 200, height: 30 }}
                      onChange={(value) => {
                        setCurrentTeamId(value);
                      }}
                      size='default'
                      value={currentTeamId || teamList?.[0]?.team_id}
                      triggerProps={{
                        autoAlignPopupWidth: false,
                        autoAlignPopupMinWidth: true,
                        position: 'bl',
                      }}
                    >
                      {teamList.map((ii) => (
                        <Option key={ii?.team_id} value={ii?.team_id}>
                          {ii?.name}
                        </Option>
                      ))}
                    </Select>
                  </>
                )}
              </div>
              <div className="r">
                {roleObj?.attr?.is_update_permission && (
                  <Tooltip disabled={companyPermissions.includes('role_set')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                    <Button disabled={!companyPermissions.includes('role_set')} onClick={() => saveRole()}>{t('text.role_save')}</Button>
                  </Tooltip>
                )}
                {roleObj?.is_default != 1 && (
                  <Tooltip disabled={companyPermissions.includes('role_remove')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                    <Button className='role_remove' disabled={!companyPermissions.includes('role_remove')} style={{ marginLeft: '20px' }} type='outline' onClick={() => deleteRole()}>{t('text.role_delete')}</Button>
                  </Tooltip>
                )}
              </div>
            </div>
            <Tabs destroyOnHide={true} defaultActiveTab='1'>
              <TabPane key='1' title={t('text.functional_authority')}>
                <FunctionalAuthority is_update_permission={roleObj?.attr?.is_update_permission} value={permissionList} checkPremissionKeys={checkPremissionKeys} setCheckPremissionKeys={setCheckPremissionKeys} />
              </TabPane>
              <TabPane key='2' title={t('text.role_member')}>
                <Input allowClear value={searchValue || ''} onChange={setSearchValue} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={t('text.search_account_or_nickname')} />
                <RoleMemberList value={roleMemberList} company_id={company_id} team_id={currentTeamId} />
                <Pagination pageSize={pageSize} onPageSizeChange={(val) => {
                  setPageSize(val);
                }} size='default' current={page} onChange={(val) => {
                  setPage(val);
                }} total={total} showTotal showJumper sizeCanChange />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Provider>
  )
};

export default RoleAdminManage;