import React, { useState, useEffect } from 'react';
import Bus from '@utils/eventBus';
import AddInternalMember from '../AddInternalMember';
import TeamMember from '../TeamMember';
import CreateMember from '../CreateMember';
import BatchImport from '../BatchImport';
import UserCenter from '../UserCenter';
import NewRole from '../NewRole';
import ViewTeam from '../ViewTeam';
import CompanyRoleUpdate from '../CompanyRoleUpdate';
import RoleDelete from '../RoleDelete';
import OperationLog from '../OperationLog';
import AddThirdPartyIntegration from '../AddThirdPartyIntegration';
import AddNotifGroup from '../AddNotifGroup';
import CompanyEditPassword from '../CompanyEditPassword';

const GlobalModal = () => {
  const modalsDom = {
    InternalMember: AddInternalMember, // 添加企业内成员弹窗
    TeamMember: TeamMember, // 团队成员弹窗
    CreateMember: CreateMember, // 创建企业成员弹窗
    BatchImport: BatchImport, // 批量导入企业成员弹窗
    UserCenter: UserCenter, // 用户中心弹窗
    NewRole: NewRole, // 新建角色
    ViewTeam: ViewTeam, // 查看团队
    CompanyRoleUpdate: CompanyRoleUpdate, // 更改企业角色 
    RoleDelete:RoleDelete, // 删除角色
    OperationLog:OperationLog, // 操作日志
    AddThirdPartyIntegration:AddThirdPartyIntegration, // 新建第三方集成通知
    AddNotifGroup, // 新建通知组
    CompanyEditPassword, // 企业成员修改密码弹窗
  }

  const [modals, setModals] = useState([]);
  // 移除弹窗
  const removeModal = (modalName) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.name !== modalName));
  }
  useEffect(() => {
    // 打开全局弹窗
    Bus.$on('openModal', (ModalName, ModalProps) => {
      if (modalsDom.hasOwnProperty(ModalName)) {
        const newModal = {
          name: ModalName,
          ModalProps: ModalProps || {},
        };
        setModals((prevModals) => [...prevModals, newModal]);
      }
    });
    return () => {
      Bus.$off('openModal');
    };
  }, []);
  return (
    <>
      {modals.map((modal) => {
        const ModalTag = modalsDom[modal?.name];
        return (
          <ModalTag
            key={modal?.name}
            onCancel={() => {
              removeModal(modal?.name);
            }}
            {...modal?.ModalProps}
          ></ModalTag>
        )
      })}
    </>
  );
};
export default GlobalModal;
