import { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Message } from '@arco-design/web-react';
import { ServiceGetUserRole, ServeiceDeleteRole } from '@services/role';
import { companyRoleUpdate } from '@services/company';
import { serviceTeamRoleUpdate } from '@services/team';
import { debounce, isArray } from 'lodash';
import './index.less';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;
const RoleDelete = (props) => {
  const { onCancel, role_id, initRoleList, roleList, roleMemberList } = props;
  const { t } = useTranslation();
  const [tempRoleId, setTempRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    if (isArray(roleList) && roleList.length > 0) {
      setRoles(roleList);
    } else {
      ServiceGetUserRole({
        role_id,
      }).then((res) => {
        if (res?.code == 0 && isArray(res?.data?.usable_roles)) {
          setRoles(res?.data?.usable_roles);
        }
      });
    }
  }, [roleList]);
  const deleteRole = debounce(async () => {
    try {
      const resp = await ServeiceDeleteRole({
        "company_id": localStorage.getItem('company_id'), //企业id
        "role_id": role_id, //角色ID
        "change_role_id": tempRoleId || roles?.[0]?.role_id
      });
      if (resp?.code == 0) {
        Message.success(t('text.delete_role_success'));
        initRoleList();
        onCancel();
      }
    } catch (error) { }
  }, 200);
  const getMemberName = () => {
    let text = '';
    if (isArray(roleMemberList)) {
      if (roleMemberList.length > 3) {
        for (let index = 0; index < 3; index++) {
          const item = roleMemberList[index];

          // 最后一个
          if (index == 2) {
            text = text + `${item?.nickname || '-'}`
          } else {
            text = text + `${item?.nickname || '-'}、`
          }
        }

        return `“${text}”...${t('text.etc')}${roleMemberList.length}${t('text.people')}`

      } else {
        for (let index = 0; index < roleMemberList.length; index++) {
          const item = roleMemberList[index];
          // 最后一个
          if (index == roleMemberList.length - 1) {
            text = text + `${item?.nickname || '-'}`
          } else {
            text = text + `${item?.nickname || '-'}、`
          }
        }

        return `“${text}”${roleMemberList.length}${t('text.people')}`
      }
    }
    return '-';
  }
  return (
    <Modal
      title={t('text.role_delete')}
      className="runnerGo-delete-role-modal"
      style={{
        width: '414px',
        height: '296px',
      }}
      visible
      onOk={() => { deleteRole() }}
      onCancel={() => onCancel()}
      autoFocus={false}
      focusLock={true}
    >
      <div>
        <p>{`${t('text.confirm_delete_role')}？
          ${t('text.please_add_member_role')}${getMemberName()}${t('text.set_role_to')}：`}</p>
        <Select
          placeholder={t('text.role_select')}
          bordered={false}
          style={{ width: 350, marginTop: '5px' }}
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
          {roles.map((i) => {
            if (i?.role_id != role_id) {
              return (
                <Option key={i?.role_id} value={i?.role_id}>
                  {i?.name}
                </Option>
              )
            }
          })}
        </Select>

      </div>
    </Modal >

  );
}

export default RoleDelete;

