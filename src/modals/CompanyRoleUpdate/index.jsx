import { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Message } from '@arco-design/web-react';
import { ServiceGetUserRole } from '@services/role';
import { companyRoleUpdate } from '@services/company';
import { serviceTeamRoleUpdate } from '@services/team';
import { debounce, isArray } from 'lodash';
import './index.less';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;
const CompanyRoleUpdate = (props) => {
  const { onCancel, user, initRoleMemberList, roleList,company_id,team_id } = props;
  const { t } = useTranslation();
  const [tempRoleId, setTempRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    if(isArray(roleList) && roleList.length > 0){
      setRoles(roleList);
    }else{
      if (user?.team_id) {
        ServiceGetUserRole({
          team_id,
        }).then((res) => {
          if (res?.code == 0 && isArray(res?.data?.usable_roles)) {
            setRoles(res?.data?.usable_roles);
          }
        });
      }else{
        ServiceGetUserRole({
          company_id,
        }).then((res) => {
          if (res?.code == 0 && isArray(res?.data?.usable_roles)) {
            setRoles(res?.data?.usable_roles);
          }
        });
      }
    }
  }, [roleList]);
  const updateRole = async () => {
    try {
      if (user?.team_id) {
        const res = await serviceTeamRoleUpdate({
          "team_id": user?.team_id,
          "role_id": tempRoleId || roles?.[0]?.role_id, //角色ID
          "target_user_id": user?.user_id
        });
        if (res?.code == 0) {
          Message.success(t('text.update_role_success'));
          initRoleMemberList();
          onCancel();
        }
      } else {
        const resp = await companyRoleUpdate({
          "company_id": localStorage.getItem('company_id'), //企业id
          "role_id": tempRoleId || roles?.[0]?.role_id, //角色ID
          "target_user_id": user?.user_id
        });
        if (resp?.code == 0) {
          Message.success(t('text.update_role_success'));
          initRoleMemberList();
          onCancel();
        }
      }
    } catch (error) { }
  };
  console.log("roleList",roleList);
  return (
    <Modal
      title={t('text.change_role')}
      className="runnerGo-update-role-modal"
      style={{
        width: '535px',
        height: '241px',
      }}
      visible
      onOk={() => { updateRole() }}
      onCancel={() => onCancel()}
      autoFocus={false}
      focusLock={true}
    >
      <div>
        <p>{t('text.will')}{user?.nickname || '-'}{t('text.update_role_text')}</p>
        <Select
          placeholder={t('text.role_select')}
          bordered={false}
          style={{ width: 469, marginTop: '5px' }}
          onChange={(value) => {
            setTempRoleId(value);
          }}
          size='large'
          value={tempRoleId || roles?.[0]?.role_id}
          getPopupContainer={()=>document.body}
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: 'bl',
          }}
        >
          {roles.map((i) => (
            <Option key={i?.role_id} value={i?.role_id}>
              {i?.name}
            </Option>
          ))}
        </Select>
      </div>
    </Modal >

  );
}

export default CompanyRoleUpdate;

