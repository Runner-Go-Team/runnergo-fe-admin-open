import React, { useEffect, useState } from 'react'
import './index.less';
import { Button, Input, Message, Popconfirm, Select, Switch, Tooltip } from '@arco-design/web-react';
import { ServiceGetNoticeGroupList, ServiceGetNoticeGroupDetail, ServiceRemoveNoticeGroup } from '@services/notice';
import Bus from '@utils/eventBus';
import { FotmatTimeStamp } from '@utils';
import { debounce, isArray, isPlainObject, isString } from 'lodash';
import { IconDelete, IconEdit, IconSearch } from '@arco-design/web-react/icon';

const Option = Select.Option;
const NotifGroup = () => {

  const [noticeData, setNoticeData] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [selectTypeVal, setSelectTypeVal] = useState('0');
  const typeOptions = {
    '1': '飞书群机器人',
    '2': '飞书企业应用',
    '4': '企业微信机器人',
    '5': '邮箱',
    '6': '钉钉群机器人',
    '7': '钉钉企业应用'
  }
  const initNoticeList = async () => {
    try {
      const resp = await ServiceGetNoticeGroupList({ keyword: searchVal, channel_id: selectTypeVal });
      if (resp?.code == 0 && isArray(resp?.data?.list)) {
        setNoticeData(resp.data.list);
      }
    } catch (error) { }
  }

  useEffect(() => {
    initNoticeList();
  }, [searchVal, selectTypeVal]);

  const delNoticeItem = debounce(async (group_id) => {
    const res = await ServiceRemoveNoticeGroup({ group_id })
    if (res?.code == 0) {
      Message.success(`删除成功`);
      initNoticeList();
    }
  }, 200)

  const editNoticeGroupItem = debounce(async (group_id) => {
    const res = await ServiceGetNoticeGroupDetail({ group_id })
    if (res?.code == 0 && isPlainObject(res?.data?.group)) {
      Bus.$emit('openModal', 'AddNotifGroup', { initNoticeList, groupData: res.data.group })
    }
  }, 200)

  return (
    <div className='msg-notif-group-management'>
      <div className='title'>
        <label>通知组管理</label>
        <Button onClick={() => Bus.$emit('openModal', 'AddNotifGroup', { initNoticeList })} type='primary'>新建</Button>
      </div>
      <div className="search">
        <Input allowClear value={searchVal} onChange={setSearchVal} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={'搜索通知组名称'} />
        <div className="type">
          <label>通知类型：</label>
          <Select
            value={selectTypeVal}
            onChange={(val) => {
              setSelectTypeVal(val)
            }}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'bl',
            }}
          >
            <Option key={'0'} value={'0'}>全部</Option>
            {Object.keys(typeOptions).map((key) => (
              <Option key={key} value={key}>{typeOptions[key]}</Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="content">
        <div className="card-list">
          {isArray(noticeData) && noticeData.map((i) => {
            let typeStr = '-';
            let thirdNameStr = '';
            if (isArray(i?.notice)) {
              typeStr = i.notice.reduce(function (acc, obj) {
                if (isString(obj?.channel_name) && !acc.includes(obj.channel_name)) {
                  if (acc !== '') {
                    acc += ',' + obj.channel_name;
                  } else {
                    acc = obj.channel_name;
                  }
                }
                if (isString(obj?.name) && !thirdNameStr.includes(obj.name)) {
                  if (thirdNameStr !== '') {
                    thirdNameStr += ',' + obj.name;
                  } else {
                    thirdNameStr = obj.name;
                  }
                }
                return acc;
              }, '');
            }

            return (
              <div className="item" key={i?.group_id}>
                <div className="column name">
                  <div className="title">通知组名称</div>
                  <div className="value text-ellipsis">{i?.name || '-'}</div>
                </div>
                <div className="column third-name">
                  <div className="title">第三方集成名称</div>
                  <Tooltip content={thirdNameStr || '-'}>
                  <div className="value text-ellipsis">
                      {thirdNameStr || '-'}
                  </div>
                  </Tooltip>
                </div>
                <div className="column type">
                  <div className="title">通知类型</div>
                  <div className="value text-ellipsis">
                    <Tooltip content={typeStr}>
                      <div className='text-ellipsis'>{typeStr}</div>
                    </Tooltip>
                  </div>
                </div>
                <div className="column create-time">
                  <div className="title">创建时间</div>
                  <div className="value">{i?.created_time_sec ? (FotmatTimeStamp(i?.created_time_sec, 'YYYY-MM-DD HH:mm') || '-') : "-"}</div>
                </div>
                <div className="column controls">
                  <div className="title">操作</div>
                  <div className="value">
                    <Button className='edit-btn' type='text' onClick={() => editNoticeGroupItem(i?.group_id)}>
                    <Tooltip position='top' trigger='hover' content={'编辑'}>
                          <IconEdit width={16}/>
                        </Tooltip>
                    </Button>
                    <Popconfirm
                      focusLock
                      title='确认删除'
                      content='是否确定要删除？'
                      onOk={() => delNoticeItem(i?.group_id)}
                    >
                      <Tooltip position='top' trigger='hover' content={'删除'}>
                          <IconDelete width={16} style={{marginLeft:'10px',cursor:'pointer'}}/>
                        </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default NotifGroup;