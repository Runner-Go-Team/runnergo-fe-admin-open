import React, { useState, useEffect } from "react";
import './index.less';
import { Menu } from '@arco-design/web-react';
import { IconSettings, IconMenuUnfold } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SvgWorkBench from '@assets/menu/workbench';
import SvgMember from '@assets/menu/member';
import SvgRole from '@assets/menu/role';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const LeftBar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useSelector((store) => store.user.theme) || 'dark';
    const language = useSelector((store) => store.user.language) || 'cn';

    const onClickMenuItem = (key) => {
    };
    const menuList = [
        {
            key: '/work',
            label: t('menu.work'),
            icon: <SvgWorkBench className='arco-icon' />
        },
        {
            key: '/memberadmin',
            label: t('menu.memberAdmin'),
            icon: <SvgMember className='arco-icon' />
        },
        {
            key: '/roleadmin',
            label: t('menu.roleAdmin'),
            icon: <SvgRole className='arco-icon' />
        }
        ,
        {
            key: '/settings',
            label: t('menu.settings'),
            icon: <IconSettings className='arco-icon' />
        }
    ]
    // mode="pop"
    return (
        <div className="left-bar">
            <Menu
                hasCollapseButton
                selectedKeys={location.pathname.includes('/settings') ? ['/settings'] : [location.pathname]}
                theme = "dark"
                onClickMenuItem = { onClickMenuItem }
                style = {{ height: '100%', width: 120 }}
                tooltipProps={{
                    color: 'var(--select-hover)',
                    style: { border: 'none', display: 'flex' }
                }}
            // icons={{
            //     collapseDefault: <IconMenuUnfold />
            // }}
            >
                {
                    menuList.map(item => {
                        console.log(location.pathname.includes(item.key), item.key, location);
                        return (<MenuItem key={item.key} title={item.label}>
                            <Link to={`${item.key}`} className={cn('runnerGo-menu-item-link', { active: location.pathname.includes(item.key) })}>
                                {item.icon}
                                <label>{item.label}</label>
                            </Link>
                        </MenuItem>)
                    }
                    )
                }
                <div className="dividing-line"></div>
                {/* <SubMenu
                    key='setting'
                    title={
                        <>
                            <IconSettings />
                            设置
                        </>
                    }
                >
                    <Menu
                        theme="dark"
                        mode="pop"
                        defaultOpenKeys={['0']}
                        selectedKeys={[theme, language]}
                    >
                        <SubMenu
                            key='theme'
                            title={
                                <>
                                    主题
                                </>
                            }
                        >
                            <MenuItem key='dark' onClick={() => {
                                dispatch({
                                    type: 'user/updateUser',
                                    payload: {
                                        theme: 'dark'
                                    }
                                })
                            }}>暗色模式</MenuItem>
                            <MenuItem key='white' onClick={() => {
                                dispatch({
                                    type: 'user/updateUser',
                                    payload: {
                                        theme: 'white'
                                    }
                                })
                            }}>浅色模式</MenuItem>
                        </SubMenu>
                        <SubMenu
                            key='language'
                            title={
                                <>
                                    语言
                                </>
                            }
                        >
                            <MenuItem key='cn' onClick={() => {
                                dispatch({
                                    type: 'user/updateUser',
                                    payload: {
                                        language: 'cn'
                                    }
                                })
                            }}>简体中文</MenuItem>
                            <MenuItem key='en' onClick={() => {
                                dispatch({
                                    type: 'user/updateUser',
                                    payload: {
                                        language: 'en'
                                    }
                                })
                            }}>English</MenuItem>
                        </SubMenu>
                    </Menu>
                </SubMenu> */}
            </Menu>
        </div>
    )
};

export default LeftBar;