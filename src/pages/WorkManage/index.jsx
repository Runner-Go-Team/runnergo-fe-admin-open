import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Input, Button, Tabs, Message, Tooltip } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Bus from '@utils/eventBus';
import { getTeamList, updateTeamInfo } from '@services/team';
import NewTeamModal from '@modals/NewTeam';
import TeamList from './TeamList';
import TeamInfo from './TeamInfo';
import SvgSwap from '@assets/swap.svg';
import context from './Context';
import './index.less';
import { isArray, debounce, trim, isString, isPlainObject, isEmpty } from 'lodash';


const TabPane = Tabs.TabPane;
const WorkManage = () => {
    const [CURRENT_TEAM_ID, setCURRENT_TEAM_ID] = useState('');
    const [newTeamVisible, setNewTeamVisible] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [activeTab, setActiveTab] = useState('1');
    const [teamList, setTeamList] = useState([]);
    const [reverseOrder, setReverseOrder] = useState(false);
    const { t } = useTranslation();
    const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
    const current_team = useMemo(() => teamList.find((item) => item?.team_id == CURRENT_TEAM_ID) || {}, [CURRENT_TEAM_ID, teamList]);
    const initTeamList = async (order, keyword = '') => {
        try {
            let company_id = localStorage.getItem('company_id');
            const resp = await getTeamList({
                company_id,
                order,
                keyword
            });
            if (isArray(resp?.data?.teams)) {
                setTeamList(resp.data.teams);
            }
        } catch (error) { }
    }
    const debounceInitTeamList = useCallback(debounce((activeTab, searchVal) => {
        initTeamList(activeTab, searchVal);
    }, 200), []);
    useEffect(() => {
        if (searchVal) {
            debounceInitTeamList(activeTab, searchVal);
        } else {
            initTeamList(activeTab, searchVal);
        }
    }, [searchVal, activeTab]);

    const { Provider } = context;

    useEffect(() => {
        if (isArray(teamList) && teamList.length > 0 && teamList.find((item) => item?.team_id == CURRENT_TEAM_ID) == undefined) {
            setCURRENT_TEAM_ID(teamList[0]?.team_id);
        }
    }, [teamList]);

    const tabsChange = (key) => {
        setActiveTab(key);
    }

    const updateTeamData = debounce(async (team_id, data) => {
        if (isString(data?.name) && trim(data?.name).length <= 0) {
            Message.error(t('message.teamNameNotNull'))
            return false;
        }

        await updateTeamInfo({
            ...data,
            team_id,
        }).then((res) => {
            if (res?.code == 0) {
                Message.success(t('message.updateTeamInfo'));
                // 刷新团队列表
                initTeamList(activeTab, searchVal);
            }
        })
    }, 200)

    useEffect(() => {
        if (isArray(teamList) && teamList.length > 0) {
            if (!reverseOrder) {
                setTeamList((lastState) => [...lastState].sort((a, b) => b?.updated_time_sec - a?.updated_time_sec))
            } else {
                setTeamList((lastState) => [...lastState].sort((a, b) => a?.updated_time_sec - b?.updated_time_sec))
            }
        }
    }, [reverseOrder]);

    return (
        <Provider value={{
            CURRENT_TEAM_ID,
            setCURRENT_TEAM_ID,
            updateTeamList: () => initTeamList(activeTab, searchVal),
            updateTeamData,
            current_team,
        }}>
            {newTeamVisible ? (<NewTeamModal updateTeamList={() => initTeamList(activeTab, searchVal)} visible={newTeamVisible} setVisible={setNewTeamVisible} ></NewTeamModal>) : null}
            <div className='work-manage'>
                <div className="left">
                    <div className="title">{t('menu.work')}</div>
                    <div className="operation">
                        <div className="l">
                            <Input allowClear value={searchVal} onChange={setSearchVal} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={t('placeholder.searchTeam')} />
                        </div>
                        <div className="r">
                            <Tooltip disabled={companyPermissions.includes('team_save')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                                <Button disabled={!companyPermissions.includes('team_save')} onClick={() => setNewTeamVisible(true)}>{t('btn.newTeam')}</Button>
                            </Tooltip>
                        </div>
                    </div>

                    <Tabs onChange={tabsChange} destroyOnHide={true} activeTab={activeTab} extra={
                        <span className='update-time-sort' onClick={() => setReverseOrder(!reverseOrder)}>
                            {reverseOrder ? t('text.update_time_positive_sort') : t('text.update_time_sort')}
                            <SvgSwap className="arco-icon"></SvgSwap>
                        </span>
                    }>
                        <TabPane key='1' title={t("text.all_team")}>
                            <TeamList value={teamList} />
                        </TabPane>
                        <TabPane key='2' title={t("text.my_team")}>
                            <TeamList value={teamList} />
                        </TabPane>
                        <TabPane key='3' title={t("text.collect_team")}>
                            <TeamList value={teamList} />
                        </TabPane>
                    </Tabs>

                </div>
                {isPlainObject(current_team) && !isEmpty(current_team) && (<div className="right">
                    <TeamInfo value={current_team} />
                </div>)}
            </div>
        </Provider>
    )
};

export default WorkManage;