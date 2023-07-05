import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, Tooltip, Message, Checkbox, TreeSelect, InputTag } from '@arco-design/web-react';
import { IconQuestionCircle, IconPlus, IconCheck } from '@arco-design/web-react/icon';
import { ServiceNewNoticeGroup, ServiceUpdateNoticeGroup, ServiceGetNoticeList, ServiceGetNoticeUsers } from '@services/notice';
import cn from 'classnames';
import { THIRD_PARTY } from './constants';
import { useTranslation } from 'react-i18next';
import './index.less';
import { cloneDeep, debounce, includes, isArray, isPlainObject, isString, set, trim } from 'lodash';
import { EamilReg } from '@utils';
import { useSelector } from 'react-redux';

const Option = Select.Option;
const AddNotifGroup = (props) => {
  const { onCancel, initNoticeList, groupData } = props;
  const [data, setData] = useState({
    name: '', // 通知组名称
    notice_relates: [], // 选择的第三方集成数组
  });
  const theme = useSelector((store) => store?.user?.theme);
  // 已经集成的第三方列表
  const [noticeList, setNoticeList] = useState([]);

  const [noticeArch, setNoticeArch] = useState({});
  console.log(noticeArch,"noticeArch11");
  const [checkIds, setCheckIds] = useState([]);
  const { t } = useTranslation();
  const needUserIDs = [2, 3, 7];
  const needEmailIDs = [5];
  const getUserArch = async (notice_id) => {
    try {
      const resp = await ServiceGetNoticeUsers({ notice_id })
      if (resp?.code == 0 && isPlainObject(resp?.data)) {
        let treeData = [];
        if (isArray(resp?.data?.department_list) && resp.data.department_list.length > 0) {
          treeData = treeData.concat(convertToTreeData(resp.data.department_list));
        }
        if (isArray(resp?.data?.user_list) && resp.data.user_list.length > 0) {
          resp.data.user_list.forEach((item) => {
            if (isString(item?.open_id)) {
              treeData.push({
                key: item.open_id, value: item?.name, title: item?.name || '-'
              })
            }
          });
        }
        if (treeData.length > 0) {
          setNoticeArch({
            ...noticeArch,
            [notice_id]: treeData
          });
        }
      }
    } catch (error) { }

  };
  const getUserArchDebounce = debounce(getUserArch, 200)

  const getEditData = async () => {
    if (isPlainObject(groupData)) {
      if (isArray(groupData?.notice_relates)) {
        const checkArrs = [];
        const temp_noticeArch = {};
        for (let index = 0; index < groupData.notice_relates.length; index++) {
          const item = groupData.notice_relates[index];
          if (isArray(item?.params?.user_ids)) {
            try {
              const resp = await ServiceGetNoticeUsers({ notice_id: item?.notice_id })
              if (resp?.code == 0 && isPlainObject(resp?.data)) {
                let treeData = [];
                if (isArray(resp?.data?.department_list) && resp.data.department_list.length > 0) {
                  treeData = treeData.concat(convertToTreeData(resp.data.department_list));
                }
                if (isArray(resp?.data?.user_list) && resp.data.user_list.length > 0) {
                  resp.data.user_list.forEach((item) => {
                    if (isString(item?.open_id)) {
                      treeData.push({
                        key: item.open_id, value: item?.name, title: item?.name || '-'
                      })
                    }
                  });
                }
                if (treeData.length > 0) {
                  temp_noticeArch[item?.notice_id] = treeData;
                }
              }
            } catch (error) { }
          }
          checkArrs.push(item?.notice_id);
        }
        setNoticeArch(temp_noticeArch);
        setCheckIds(checkArrs);
      }
      setData({ ...data, ...groupData })
    }
  }

  useEffect(() => {
    ServiceGetNoticeList().then((resp) => {
      if (resp?.code == 0 && isArray(resp?.data?.list)) {
        setNoticeList(resp.data.list.filter((i) => i?.status == '1'));
      }
    })
    getEditData();
  }, []);
  const onChange = (key, value) => {
    const newData = cloneDeep(data);
    set(newData, key, value);
    setData(newData);
  }
  const onCheckGroup = (value) => {
    setCheckIds(value);
  }
  const onCheckGroupItem = (checked, item) => {
    let notice = {
      notice_id: item?.notice_id,
      params: {}
    }
    const dataNotices = cloneDeep(data?.notice_relates || []);
    if (checked) {
      if (needUserIDs.includes(item?.channel_id)) {
        getUserArchDebounce(item?.notice_id);
        notice.params.user_ids = [];
      }else if(needEmailIDs.includes(item?.channel_id)){
        notice.params.emails = [];
      }
      dataNotices.push(notice);
      setData({ ...data, notice_relates: dataNotices });
    } else {
      setData({ ...data, notice_relates: dataNotices.filter((i) => i?.notice_id != item?.notice_id) });
    }
  }
  const onSave = debounce(() => {
    if (trim(data.name).length <= 0) {
      Message.error('通知组名称不能为空');
      return;
    }
    if (isPlainObject(groupData)) {
      ServiceUpdateNoticeGroup({
        ...data
      }).then((res) => {
        if (res?.code == 0) {
          Message.success('修改成功');
          initNoticeList && initNoticeList();
          onCancel()
        }
      })
      return;
    }
    ServiceNewNoticeGroup({
      ...data
    }).then((res) => {
      if (res?.code == 0) {
        Message.success('新建成功');
        initNoticeList && initNoticeList();
        onCancel()
      }
    })
  }, 200)

  const convertToTreeData = (objArray) => {
    const treeData = [];
    objArray.forEach(function (obj) {
      var department = {
        title: obj?.name || '-',
        value: obj?.name || '',
        key: obj?.department_id || obj?.open_id,
      };

      if((isArray(obj?.user_list) && obj.user_list.length > 0) || (isArray(obj?.department_list) && obj.department_list.length > 0)){
        department.children = [];
      }

      if (isArray(obj?.user_list) && obj.user_list.length > 0) {
        department.children = obj.user_list.map(function (user) {
          return {
            key: user.open_id, value: user?.name || '', title: user?.name || '-'
          };
        });
      }

      if (isArray(obj?.department_list) && obj.department_list.length > 0) {
        department.children = department.children.concat(convertToTreeData(obj.department_list));
      }

      treeData.push(department);
    });

    return treeData;
  }

  const onTreeSelect = (notice_id, arr) => {
    const notice_relates = data?.notice_relates || [];
    const obj = notice_relates.find((item) => item?.notice_id == notice_id);
    if (isPlainObject(obj) && obj != undefined && isPlainObject(obj?.params)) {
      obj.params.user_ids = arr;
      setData({
        ...data,
        notice_relates
      });
    }
  }

  const needShowUserArch = (notice_id) => {
    const item = noticeList.find((i) => i?.notice_id == notice_id)
    if (item != undefined && needUserIDs.includes(item?.channel_id)) {
      return true;
    }
    return false;
  }

  const needShowEmailInput = (notice_id) => {
    const item = noticeList.find((i) => i?.notice_id == notice_id)
    if (item != undefined && needEmailIDs.includes(item?.channel_id)) {
      return true;
    }
    return false;
  }
  
  const onEmailChange = (notice_id, arr) => {
    const notice_relates = data?.notice_relates || [];
    const obj = notice_relates.find((item) => item?.notice_id == notice_id);
    if (isPlainObject(obj) && obj != undefined && isPlainObject(obj?.params)) {
      obj.params.emails = arr;
      setData({
        ...data,
        notice_relates
      });
    }
  }
  const renderIcon = (channel_id)=>{
    if(theme == 'dark'){
      return THIRD_PARTY?.[channel_id].icon || '';
    }else{
      return THIRD_PARTY?.[channel_id].iconwhite || THIRD_PARTY?.[channel_id].icon || '';
    }
  }
  return (
    <>
      <Modal
        title={'新增通知组'}
        className="runnerGo-add-notif-group-modal"
        visible
        onOk={() => onCancel()}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={true}
        footer={
          <>
            <Button
              className='btn-close'
              onClick={() => {
                onCancel();
              }}
            >
              {t('btn.close')}
            </Button>
            <Button
              onClick={onSave}
            >
              {t('btn.save')}
            </Button>
          </>
        }
        style={{ width: 735, height: 577 }}
      >
        <div className="card name">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{'通知组名称'}</span>
          </label>
          <Input maxLength={30} allowClear onChange={(val) => onChange('name', val)} value={data?.name || ''} style={{ width: 671, height: 40 }} placeholder={'请输入名称'} />
        </div>
        <div className="card third-party">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{'已配置的第三方集成'}</span>
            {/* <span className='help' onClick={() => window.open('https://rhl469webu.feishu.cn/docx/JD5Ldz1Z1onUhoxI4xfc4YHNn9g')}>
              <IconQuestionCircle />
              查看帮助
            </span> */}
          </label>
          <Checkbox.Group value={checkIds} onChange={onCheckGroup} name='button-radio-group'>
            {isArray(noticeList) && noticeList.map((item) => (
              <Checkbox onChange={(val) => {
                onCheckGroupItem(val, item);
              }} key={item?.notice_id} value={item?.notice_id}>
                {({ checked }) => {
                  return (
                    <div className={cn('item-card', {
                      active: checked
                    })}>
                      <div className="icon">{renderIcon(item?.channel_id)}</div>
                      <div className="name">{item?.name || ''}</div>
                      {checked && <div className='item-card-checked'><IconCheck /></div>}
                    </div>
                  );
                }}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
        {isArray(data?.notice_relates) && data.notice_relates.length > 0 ? data.notice_relates.map((item) => {
          if (!checkIds.includes(item?.notice_id)) {
            return null;
          }
          if (needShowUserArch(item?.notice_id)) {
            return <div className="card user-arch">
              <label htmlFor="">
                <span className='required'>*</span>
                <span>{`${noticeList.find((i) => i?.notice_id == item?.notice_id)?.name || ''}-绑定人员`}</span>
              </label>
              <TreeSelect
                showSearch
                allowClear
                treeCheckable
                placeholder='输入关键字进行过滤'
                treeData={isArray(noticeArch[item?.notice_id]) ? noticeArch[item?.notice_id] : []}
                value={isArray(item?.params?.user_ids) && isArray(noticeArch[item?.notice_id]) ? item?.params?.user_ids : []}
                treeCheckedStrategy={TreeSelect.SHOW_CHILD}
                onChange={(value) => {
                  onTreeSelect(item?.notice_id, value);
                }}
                getPopupContainer={() => document.body}
                style={{}}
              />
            </div>
          } else if (needShowEmailInput(item?.notice_id)) {
            return <div className="card user-arch">
              <label htmlFor="">
                <span className='required'>*</span>
                <span>{`${noticeList.find((i) => i?.notice_id == item?.notice_id)?.name || ''}-添加邮箱`}</span>
              </label>
              <InputTag value={isArray(item?.params?.emails) ? item?.params?.emails : []} onChange={(val)=>{
              onEmailChange(item?.notice_id, val)
              }} saveOnBlur placeholder='请输入邮箱,支持多个' />
            </div>
          }
        })
          :
          (<div className='empty-text'>勾选第三方集成后展示具体配置信息(群机器人不需要配置信息)</div>)}
      </Modal >
    </>
  )
};

export default AddNotifGroup;