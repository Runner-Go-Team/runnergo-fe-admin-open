import React, { useState } from 'react';
import { Modal, Button, Input, Radio, Message } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { ServiceNewRole } from '@services/role';
import './index.less';
import { trim } from 'lodash';
const RadioGroup = Radio.Group;

const NewRoleModal = (props) => {
  const { onCancel , initRoleList } = props;
  const { t } = useTranslation();
  const [roleData, setRoleData] = useState({
    name: '',
    teamProperty: 1
  });

  const newTeam = async () => {
    try {
      if (trim(roleData.name).length <= 0) {
        Message.error(`${t('text.role_name_cannot_null')}!`);
        return;
      }
     
      let resp =await ServiceNewRole({
        company_id: localStorage.getItem('company_id'), 
        name: trim(roleData.name),
        role_type: roleData.teamProperty, 
      })
      if(resp?.code == 0){
        Message.success(t('text.new_role_success'));
        // 刷新角色列表
        initRoleList && initRoleList();
        onCancel()
      }
    } catch (error) {}
  }

  return (
    <Modal
      title={t('text.new_role')}
      className="runnerGo-newrole-modal"
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
          <Button
            onClick={() => {
              newTeam();
            }}
          >
            {t('btn.save')}
          </Button>
        </>
      }
    >
      <div className="role-name">
        {t('text.role_name')}
      </div>
      <Input
        allowClear
        placeholder={t('text.placeholder_new_team')}
        maxLength={30}
        height={40}
        value={roleData?.name}
        onChange={(val) => setRoleData((lastState) => ({ ...lastState, name: val }))}
      />
      <div className="role-property">
        {t('text.role_property')}
      </div>
      <RadioGroup onChange={(val) => setRoleData((lastState) => ({ ...lastState, teamProperty: val }))} value={roleData?.teamProperty} style={{ marginTop: 8 }}>
        <Radio value={1}>{t('text.company_role')}</Radio>
        <Radio value={2}>{t('text.role_team')}</Radio>
      </RadioGroup>
    </Modal>
  )
};

export default NewRoleModal;