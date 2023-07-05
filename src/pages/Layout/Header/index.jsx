import React from 'react';
import { Dropdown, Tooltip } from '@arco-design/web-react'
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';
import UserCard from '@components/User/Card';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { FE_WOEK_URL } from '@config';
import './index.less';
import SvgLogoDark from '@assets/logo/runner_dark.svg';
import SvgLogoWhite from '@assets/logo/runner_white.svg';
import Bus from '@utils/eventBus';
import { openLinkInNewTab } from '@utils';

const Header = () => {
    const theme = useSelector((store) => store?.user?.theme);
    const avatar = useSelector((store) => store?.user?.avatar);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    return (
        <div className='layout-header'>
            <Tooltip content={t('menu.work')}>
                {theme == 'dark' ? <SvgLogoDark onClick={() => openLinkInNewTab(FE_WOEK_URL)} /> : <SvgLogoWhite onClick={() => openLinkInNewTab(FE_WOEK_URL)} />}
            </Tooltip>
            <div className="r">
                <Dropdown trigger='click' droplist={<UserCard />} position='bl'>
                    <img className='avatar' src={avatar || "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default1.png"} alt="" />
                </Dropdown>
                <div className="operation-log" onClick={() => {
                    Bus.$emit('openModal', 'OperationLog')
                }}>{t('text.operation_log')}</div>
                <div className="theme">
                    <span onClick={() => {
                        dispatch({
                            type: 'user/updateUser',
                            payload: {
                                theme: 'white'
                            }
                        })
                    }} className={cn({
                        active: theme == 'white'
                    })}>
                        <IconSunFill style={{ 'color': 'var(--icon-sun-color)' }} />
                    </span>
                    <span onClick={() => {
                        dispatch({
                            type: 'user/updateUser',
                            payload: {
                                theme: 'dark'
                            }
                        })
                    }} className={cn({
                        active: theme == 'dark'
                    })} >
                        <IconMoonFill style={{ 'color': 'var(--icon-moon-color)' }} />
                    </span>
                </div>
            </div>

        </div>
    )
};

export default Header;