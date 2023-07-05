import { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Message, Pagination, Collapse, Tooltip } from '@arco-design/web-react';
import { ServiceGetUserOperationLog } from '@services/user';
import { companyRoleUpdate } from '@services/company';
import { serviceTeamRoleUpdate } from '@services/team';
import { debounce, isArray, isNumber } from 'lodash';
import './index.less';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HandleTags from './handleTags';
import dayjs from 'dayjs';
const CollapseItem = Collapse.Item;



const OperationLog = (props) => {
  const { onCancel } = props;
  const { t } = useTranslation();
  const logType = {
    101: t('text.create_member'),
    102: t('text.batch_import_members'),
    103: t('text.editor_member'),
    104: t('text.delete_member'),
    105: t('text.update_company_role'),
    201: t('btn.newTeam'),
    202: t('text.editor_team'),
    203: t('text.add_team_member'),
    204: t('text.remove_team_member'),
    205: t('text.change_team_role'),
    206: t('modal.dissmissTeam'),
    207: t('text.transition_team_admin'),
    301: t('text.new_role'),
    302: t('text.setting_role_permisson'),
    303: t('text.role_delete'),
    401: t('text.new_third_notif'),
    402: t('text.update_third_notif'),
    403: t('text.open_third_notif'),
    404: t('text.del_third_notif'),
    501: t('text.new_third_group_notif'),
    502: t('text.update_third_group_notif'),
    503: t('text.del_third_group_notif'),
  }
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [operationList, setOperationList] = useState([]);
  const [retentionDays, setRetentionDays] = useState(7)
  const [] = useState([]);
  const getOperationlog = debounce(async () => {
    try {
      const resp = await ServiceGetUserOperationLog({
        page,
        size: pageSize
      })
      if (resp?.code == 0) {
        if (isNumber(resp?.data?.total)) {
          setTotal(resp?.data?.total);
        }
        if (isNumber(resp?.data?.retention_days)) {
          setRetentionDays(resp?.data?.retention_days);
        }
        const operations = resp?.data?.operations || [];
        if (isArray(operations) && operations.length > 0) {
          let list = [];
          operations.forEach(item => {
            const itemData = {
              ...item,
              time: dayjs(item.created_time_sec * 1000).format('YYYY-MM-DD'),
              created_time_sec: dayjs(item.created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
            };


            if (list.length === 0) {
              list.push({
                time: itemData.time,
                created_time_sec: itemData.created_time_sec,
                data: [itemData]
              });
            } else {
              for (let i = 0; i < list.length; i++) {
                if (list[i].time === itemData.time) {
                  list[i].data.push(itemData);
                } else if (i === list.length - 1) {
                  list.push({
                    time: itemData.time,
                    created_time_sec: itemData.created_time_sec,
                    data: [itemData]
                  });
                }
              }
            }
          });
          setOperationList(list);
        }
      }
    } catch (error) { }
  }, 200);
  useEffect(() => {
    getOperationlog();
  }, [page, pageSize]);

  const TitleTime = (time) => {
    const dayIndex = dayjs().diff(dayjs(time), 'day');
    const currentTime = dayIndex === 0 ? t('modal.today') : dayIndex === 1 ? t('modal.yesterday') : time;
    return currentTime;
  };
  return (
    <Modal
      title={`${t('text.operation_log')}（${t('text.save_only')}${retentionDays}${t('text.record_day')}）`}
      className="runnerGo-operation-log-modal"
      style={{
        width: '800px',
        height: '588px',
      }}
      onCancel={onCancel}
      visible
      footer={<>
        <Pagination pageSize={pageSize} onPageSizeChange={(val) => {
          setPageSize(val);
        }} size='default' current={page} onChange={(val) => {
          setPage(val);
        }} total={total} showTotal showJumper sizeCanChange />
        <Button className='btn-close' onClick={() => onCancel()}>{t('btn.close')}</Button>
      </>}
      autoFocus={false}
      focusLock={true}
    >
      <div className="teamwork-log-content">
        <Collapse
          defaultActiveKey={['1']}
          style={{ maxHeight: "450px", overflowY: 'auto' }}
          expandIconPosition='right'
          bordered={false}
        >
          {operationList?.map((it, index) => (
            <CollapseItem header={<>{TitleTime(it?.time)}</>} name='1'>
              {
                it?.data?.map((logItem, logIndex) => (
                  <div key={logIndex} className="teamwork-log_collapse_con_item">
                    <div className="operator">
                      <img className="avatar" src={logItem.user_avatar || "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default1.png"} alt="" />
                      <Tooltip content={logItem.user_name}>
                        <div className='name'>
                          {logItem.user_name}
                        </div>
                      </Tooltip>
                      {logItem.user_status === -1 && <span className="logOff">已注销</span>}
                    </div>
                    <div className="action">
                      <HandleTags type={logItem.category} />
                      <div className="text-ellipsis logitem-text" style={{ marginLeft: '6px', display: 'flex' }}>

                        <Tooltip content={`${logType[logItem.action]} - ${logItem.name}`}>
                          <span className='text-ellipsis'> {logType[logItem.action]} - {logItem.name}</span>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="time">
                      {logItem.created_time_sec}
                    </div>
                  </div>
                ))
              }
            </CollapseItem>
          ))}
        </Collapse>
      </div>
    </Modal >

  );
}

export default OperationLog;

