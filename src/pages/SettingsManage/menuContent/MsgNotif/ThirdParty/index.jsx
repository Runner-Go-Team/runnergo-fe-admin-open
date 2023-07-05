import React, { useEffect, useState } from 'react'
import './index.less';
import { Button, Message, Popconfirm, Switch, Tooltip } from '@arco-design/web-react';
import { ServiceGetNoticeList, ServiceSetNoticeStatus, ServiceRemoveNotice, ServiceGetNoticeDetail } from '@services/notice';
import Bus from '@utils/eventBus';
import { debounce, isArray, isPlainObject } from 'lodash';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';

const ThirdParty = () => {

  const [noticeData, setNoticeData] = useState({});

  const titleColor = {
    "飞书": '#00D6B9',
    "邮箱": '#4052EC',
    "钉钉": '#0285FC',
    "企业微信": '#FC6500'
  }

  const initNoticeList = async () => {
    try {
      const resp = await ServiceGetNoticeList();
      if (resp?.code == 0 && isArray(resp?.data?.list)) {
        const newNoticeObj = {};
        resp.data.list.forEach((item) => {
          if (newNoticeObj[item?.channel_type_name]) {
            newNoticeObj[item?.channel_type_name].push(item);
          } else {
            newNoticeObj[item?.channel_type_name] = [item];
          }
        });
        setNoticeData(newNoticeObj);
      }
    } catch (error) { }
  }

  useEffect(() => {
    initNoticeList();
  }, []);

  const setNoticeStatus = debounce(async (notice_id, status) => {
    try {
      const res = await ServiceSetNoticeStatus({ notice_id, status: status == '1' ? 2 : 1 })
      if (res?.code == 0) {
        Message.success(`${status == '1' ? '禁用' : '启用'}成功`);
        initNoticeList();
      }
    } catch (error) { }
  }, 200);

  const delNoticeItem = debounce(async (notice_id) => {
    const res = await ServiceRemoveNotice({ notice_id })
    if (res?.code == 0) {
      Message.success(`删除成功`);
      initNoticeList();
    }
  }, 200)

  const openEditNotice = debounce(async (notice_id) => {
    const res = await ServiceGetNoticeDetail({ notice_id })
    if (res?.code == 0 && isPlainObject(res?.data?.notice)) {
      Bus.$emit('openModal', 'AddThirdPartyIntegration', { initNoticeList, notice: res.data.notice })
    }
  }, 200)

  return (
    <div className='msg-notif-third-party'>
      <div className='title'>
        <label>第三方通知</label>
        <Button onClick={() => Bus.$emit('openModal', 'AddThirdPartyIntegration', { initNoticeList })} type='primary'>新建</Button>
      </div>
      <div className="content">
        {isPlainObject(noticeData) && Object.keys(noticeData).map((key) => (
          <div className="card-item" key={key}>
            <div className="card-title" style={{ borderColor: titleColor?.[key] || '#00D6B9' }}>{key}</div>
            <div className="card-list" key={key}>
              {isArray(noticeData[key]) && noticeData[key].map((i) => (
                <div className="item" key={i?.notice_id}>
                  <div className="column name">
                    <div className="title">名称</div>
                    <div className="value text-ellipsis">{i?.name || '-'}</div>
                  </div>
                  <div className="column type">
                    <div className="title">通知类型</div>
                    <div className="value text-ellipsis">{i?.channel_name || '-'}</div>
                  </div>
                  <div className="column check-open">
                    <div className="title">启用</div>
                    <div className="value"><Switch size='small' style={{}} checked={i?.status == '1'} onClick={() => setNoticeStatus(i?.notice_id, i?.status)} /></div>
                  </div>
                  <div className="column controls">
                    <div className="title">操作</div>
                    <div className="value">
                      <Button className='edit-btn' type='text' onClick={() => openEditNotice(i?.notice_id)}>
                        <Tooltip position='top' trigger='hover' content={'编辑'}>
                          <IconEdit width={16}/>
                        </Tooltip>
                        </Button>
                      <Popconfirm
                        focusLock
                        title='确认删除'
                        content='是否确定要删除？'
                        onOk={() => delNoticeItem(i?.notice_id)}
                      >
                        <Tooltip position='top' trigger='hover' content={'删除'}>
                          <IconDelete width={16} style={{marginLeft:'10px',cursor:'pointer'}}/>
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
export default ThirdParty;