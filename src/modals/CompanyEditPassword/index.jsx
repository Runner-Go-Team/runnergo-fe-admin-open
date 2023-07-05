import { useState, useEffect } from 'react';
import {  Modal, Message, Input } from '@arco-design/web-react';
import { companyUpdatePassword } from '@services/company';
import { debounce, trim } from 'lodash';
import './index.less';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CompanyEditPassword = (props) => {
  const { onCancel, user, initMemberList } = props;
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const onOk = debounce(async () => {
    if(trim(password).length < 6 || trim(password).length > 30){
      Message.error('请输入6-30位字母/数字/字符')
      return;
    }

    try {
      const resp = await companyUpdatePassword({
        "company_id": localStorage.getItem('company_id'), //企业id
        "target_user_id": user?.user_id, //目标用户ID
        "new_password": password
      });
      if (resp?.code == 0) {
        initMemberList && initMemberList();
        Message.success('修改成功');
        onCancel();
      }
    } catch (error) { }

  }, 200)

  return (
    <Modal
      title={t('modal.editPwd')}
      className="runnerGo-company-editPwd-modal"
      style={{
        width: '535px',
        height: '241px',
      }}
      visible
      onOk={onOk}
      onCancel={() => onCancel()}
      autoFocus={false}
      focusLock={true}
    >
      <div>
        <p>{`将${user?.nickname || '-'}的账号密码更改为`}</p>
        <Input maxLength={30} allowClear onChange={(val) => setPassword(val)} value={password} style={{ width: 469, height: 40 }} placeholder={t('text.placeholder_create_member')} />
      </div>
    </Modal >

  );
}

export default CompanyEditPassword;

