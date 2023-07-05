import React, { useEffect, useState } from 'react';
import { Input, Button, Tabs, Tooltip, Pagination } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import { getCompanyMemberList } from '@services/company';
import Bus from '@utils/eventBus';
import MemberTable from './memberTable';
import context from './Context';
import './index.less';
import { debounce, isArray, isNumber } from 'lodash';
import { useSelector } from 'react-redux';


const TabPane = Tabs.TabPane;
const MemberAdminManage = () => {
    const { Provider } = context;
    const [searchValue, setSearchValue] = useState(null);
    const [memberList, setMemberList] = useState([]);
    const [pageSize, setPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
    const initMemberList = async () => {
        let company_id = localStorage.getItem('company_id');
        const resp = await getCompanyMemberList({
            company_id,
            keyword: searchValue || '',
            page,
            size: pageSize
        });
        if (resp?.code == 0) {
            if (isArray(resp?.data?.members)) {
                setMemberList(resp?.data?.members);
            }
            if (isNumber(resp?.data.total)) {
                setTotal(resp.data.total);
            }
        }
    }
    const debounceInitMemberList = debounce(() => initMemberList(), 200);
    useEffect(() => {
        initMemberList();
    }, [page, pageSize])
    useEffect(() => {
        if (searchValue != null) {
            if (page != 1) {
                // 回到第一页
                setPage(1);
            } else {
                debounceInitMemberList();
            }
        }
    }, [searchValue])
    const { t } = useTranslation();
    return (
        <Provider value={{
            initMemberList
        }}>
            <div className='member-admin-manage'>
                <div className="left">
                    <div className="title">{t('menu.memberAdmin')}</div>
                    <div className="operation">
                        <div className="l">
                            <Input allowClear value={searchValue || ''} onChange={setSearchValue} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={t('text.search_account_or_nickname')} />
                        </div>
                        <div className="r">
                            <Tooltip disabled={companyPermissions.includes('company_save_member')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                                <Button disabled={!companyPermissions.includes('company_save_member')} onClick={() => Bus.$emit('openModal', 'CreateMember', { initMemberList })}>{t('text.create_member')}</Button>
                            </Tooltip>
                            <Tooltip disabled={companyPermissions.includes('company_export_member')} position='top' trigger='hover' content={t('tooltip.permission_denied')}>
                                <Button className='company_export_member' disabled={!companyPermissions.includes('company_export_member')} onClick={() => Bus.$emit('openModal', 'BatchImport', { initMemberList })}>{t('text.batch_import')}</Button>
                            </Tooltip>
                        </div>
                    </div>

                    <MemberTable value={memberList} />
                    <Pagination pageSize={pageSize} onPageSizeChange={(val) => {
                        setPageSize(val);
                    }} size='default' current={page} onChange={(val) => {
                        setPage(val);
                    }} total={total} showTotal showJumper sizeCanChange />
                </div>
            </div>
        </Provider>
    )
};

export default MemberAdminManage;