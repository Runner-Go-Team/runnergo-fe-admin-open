import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import './index.less';
import { Menu } from '@arco-design/web-react';
import CompanyInfo from './menuContent/CompanyInfo';
import ThirdParty from './menuContent/MsgNotif/ThirdParty';
import NotifGroup from './menuContent/MsgNotif/NotifGroup';
import AboutUs from './menuContent/AboutUs';
import { Link, Navigate, Route, Routes, useLocation,useNavigate } from 'react-router-dom';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const SettingsManage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate=useNavigate();
  const menuContent =
    (
      <Routes>
      <Route path="company" element={<CompanyInfo />}></Route>
      <Route path="thirdparty" element={<ThirdParty />}></Route>
      <Route path="notifgroup" element={<NotifGroup />}></Route>
      <Route path="aboutus" element={<AboutUs />}></Route>
      <Route path="/*" element={<Navigate to={`company`} />} />
    </Routes>
    );
  return (
    <div className='settings-manage'>
      <div className="title">{t('menu.settings')}</div>
      <div className="content">
        <div className="left">
          <Menu
            style={{ borderRadius: 4 }}
            selectedKeys={[location.pathname]}
            onClickMenuItem={(val) => {
                navigate(val);
            }}
            autoOpen
            levelIndent={20}
          >
            <MenuItem key='/settings/company'>公司信息</MenuItem>
            <SubMenu
              key='msg_notif'
              title={
                <>
                  通知设置
                </>
              }
            >
              <MenuItem key='/settings/thirdparty'>第三方集成</MenuItem>
              <MenuItem key='/settings/notifgroup'>通知组管理</MenuItem>
            </SubMenu>
            <MenuItem key='/settings/aboutus'>关于RunnerGo</MenuItem>
          </Menu>
        </div>
        <div className="right">{menuContent || null}</div>
      </div>
    </div>
  )
}

export default SettingsManage;