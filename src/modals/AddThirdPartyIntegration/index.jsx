import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, Tooltip, Message, Radio, InputNumber } from '@arco-design/web-react';
import { IconQuestionCircle, IconPlus, IconExclamationCircleFill } from '@arco-design/web-react/icon';
import { ServiceNewNotice, ServiceUpdateNotice } from '@services/notice';
import cn from 'classnames';
import { THIRD_PARTY } from './constants';
import { useTranslation } from 'react-i18next';
import './index.less';
import { cloneDeep, debounce, isArray, isPlainObject, set, trim } from 'lodash';
import { EamilReg } from '@utils';
import { useSelector } from 'react-redux';

const Option = Select.Option;
const AddThirdPartyIntegration = (props) => {
  const { onCancel, initNoticeList, notice } = props;
  const [data, setData] = useState({
    name: '', // 名称
    channel_id: 1, //1:飞书群机器人  2:飞书企业应用  3:企业微信应用  4:企业微信机器人
    fei_shu_robot: {
      webhook_url: '',
      secret: ''
    },
    fei_shu_app: {
      app_id: '',
      app_secret: ''
    },
    wechat_app: {
      id: '',
      app_id: '',
      app_secret: ''
    },
    wechat_robot: {
      webhook_url: '',
    },
    smtp_email: {
      host: '',
      port: 465,
      email: '',
      password: ''
    },
    ding_talk_robot: {
      webhook_url: '',
      secret: '',
    },
    ding_talk_app: {
      agent_id: '',
      app_key: '',
      app_secret: ''
    }
  });
  const theme = useSelector((store) => store?.user?.theme);
  const { t } = useTranslation();
  useEffect(() => {
    if (isPlainObject(notice)) {
      setData({ ...data, ...notice })
    }
  }, [])

  const onChange = (key, value) => {
    console.log(typeof value);
    const newData = cloneDeep(data);
    set(newData, key, value);
    setData(newData);
  }


  const onSave = debounce(() => {

    if (trim(data.name).length <= 0) {
      Message.error('名称不能为空');
      return;
    }

    if (data.channel_id == 1) {
      if (trim(data?.fei_shu_robot?.webhook_url).length <= 0) {
        Message.error('Hook地址不能为空');
        return;
      }
      // if (trim(data?.fei_shu_robot?.secret).length <= 0) {
      //   Message.error('加签密钥不能为空');
      //   return;
      // }
    }
    if (data.channel_id == 2) {
      if (trim(data?.fei_shu_app?.app_id).length <= 0) {
        Message.error('飞书App ID不能为空');
        return;
      }
      if (trim(data?.fei_shu_app?.app_secret).length <= 0) {
        Message.error('飞书App Secret不能为空');
        return;
      }
    }

    if (data.channel_id == 3) {
      if (trim(data?.wechat_app?.id).length <= 0) {
        Message.error('企业ID不能为空');
        return;
      }
      if (trim(data?.wechat_app?.app_id).length <= 0) {
        Message.error('应用的凭证密钥不能为空');
        return;
      }
      if (trim(data?.wechat_app?.app_secret).length <= 0) {
        Message.error('企业应用的ID不能为空');
        return;
      }
    }
    if (data.channel_id == 4) {
      if (trim(data?.wechat_robot?.webhook_url).length <= 0) {
        Message.error('Hook地址不能为空');
        return;
      }
    }

    if (data.channel_id == 5) {
      if (trim(data?.smtp_email?.host).length <= 0) {
        Message.error('SMTP服务器名称不能为空');
        return;
      }
      if (trim(data?.smtp_email?.port).length <= 0) {
        Message.error('SMTP服务器端口不能为空');
        return;
      }
      if (trim(data?.smtp_email?.email).length <= 0) {
        Message.error('邮箱账号不能为空');
        return;
      }
      if (trim(data?.smtp_email?.password).length <= 0) {
        Message.error('邮箱授权密码不能为空');
        return;
      }
    }

    if (data.channel_id == 6) {
      if (trim(data?.ding_talk_robot?.webhook_url).length <= 0) {
        Message.error('Hook地址不能为空');
        return;
      }
      if (trim(data?.ding_talk_robot?.secret).length <= 0) {
        Message.error('Secret不能为空');
        return;
      }
    }

    if (data.channel_id == 7) {
      if (trim(data?.ding_talk_app?.agent_id).length <= 0) {
        Message.error('钉钉Agentld不能为空');
        return;
      }
      if (trim(data?.ding_talk_app?.app_key).length <= 0) {
        Message.error('钉钉App Key不能为空');
        return;
      }
      if (trim(data?.ding_talk_app?.app_secret).length <= 0) {
        Message.error('钉钉App Secret不能为空');
        return;
      }
    }
    if (isPlainObject(notice)) {
      ServiceUpdateNotice({
        ...data,
      }).then((res) => {
        if (res?.code == 0) {
          Message.success('修改成功');
          initNoticeList && initNoticeList();
          onCancel()
        }
      })
      return;
    }
    ServiceNewNotice({
      ...data,
    }).then((res) => {
      if (res?.code == 0) {
        Message.success('新建成功');
        initNoticeList && initNoticeList();
        onCancel()
      }
    })
  }, 200)

  const typeInput = {
    1: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'Hook地址'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('fei_shu_robot.webhook_url', val)} value={data?.fei_shu_robot?.webhook_url || ''} style={{ width: 671, height: 40 }} placeholder={'请输入服务URL'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span>{'加签密钥'}</span>
        </label>

        <Input.Password autoComplete="new-password" maxLength={255} allowClear onChange={(val) => onChange('fei_shu_robot.secret', val)} value={data?.fei_shu_robot?.secret || ''} style={{ width: 671, height: 40 }} placeholder={'请输入加签密钥'} />
        <div className="tips"><IconExclamationCircleFill width={14}/> 如机器人设置了签名校验，必须填写此字段。</div>
      </div>
    </>,
    2: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'飞书App ID'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('fei_shu_app.app_id', val)} value={data?.fei_shu_app?.app_id || ''} style={{ width: 671, height: 40 }} placeholder={'请输入飞书App ID'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'飞书App Secret'}</span>
        </label>
        <Input.Password autoComplete="new-password" maxLength={255} allowClear onChange={(val) => onChange('fei_shu_app.app_secret', val)} value={data?.fei_shu_app?.app_secret || ''} style={{ width: 671, height: 40 }} placeholder={'请输入飞书App Secret'} />
      </div>
    </>,
    3: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'企业ID'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('wechat_app.id', val)} value={data?.wechat_app?.id || ''} style={{ width: 671, height: 40 }} placeholder={'请输入企业ID'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'应用的凭证密钥'}</span>
        </label>
        <Input.Password autoComplete="new-password" maxLength={255} allowClear onChange={(val) => onChange('wechat_app.app_id', val)} value={data?.wechat_app?.app_id || ''} style={{ width: 671, height: 40 }} placeholder={'请输入飞书App Secret'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'企业应用的ID'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('wechat_app.app_secret', val)} value={data?.wechat_app?.app_secret || ''} style={{ width: 671, height: 40 }} placeholder={'请输入企业应用的ID'} />
      </div>
    </>,
    4: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'Hook地址'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('wechat_robot.webhook_url', val)} value={data?.wechat_robot?.webhook_url || ''} style={{ width: 671, height: 40 }} placeholder={'请输入Hook地址'} />
      </div>
    </>,
    5: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'SMTP服务器名称'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('smtp_email.host', val)} value={data?.smtp_email?.host || ''} style={{ width: 671, height: 40 }} placeholder={'请输入SMTP服务器名称'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'SMTP服务器端口'}</span>
        </label>
        <InputNumber
          maxLength={255}
          allowClear
          hideControl
          onChange={(val) => onChange('smtp_email.port', val)}
          value={data?.smtp_email?.port || ''}
          style={{ width: 671, height: 40 }}
          placeholder={'请输入SMTP服务器端口'}
        />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'邮箱账号'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('smtp_email.email', val)} value={data?.smtp_email?.email || ''} style={{ width: 671, height: 40 }} placeholder={'请输入邮箱账号'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'邮箱授权密码'}</span>
        </label>
        <Input.Password autoComplete="new-password" maxLength={255} allowClear onChange={(val) => onChange('smtp_email.password', val)} value={data?.smtp_email?.password || ''} style={{ width: 671, height: 40 }} placeholder={'请输入邮箱授权密码'} />
      </div>
    </>,
    6: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'Hook地址'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('ding_talk_robot.webhook_url', val)} value={data?.ding_talk_robot?.webhook_url || ''} style={{ width: 671, height: 40 }} placeholder={'请输入Hook地址 '} />
      </div>
      <div className="card init-account-name">
        <label>
          <span>{'Secret'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('ding_talk_robot.secret', val)} value={data?.ding_talk_robot?.secret || ''} style={{ width: 671, height: 40 }} placeholder={'请输入Secret '} />
        <div className="tips"><IconExclamationCircleFill width={14}/> 如机器人设置了签名校验，必须填写此字段。</div>
      </div>
    </>,
    7: <>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'钉钉Agentld'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('ding_talk_app.agent_id', val)} value={data?.ding_talk_app?.agent_id || ''} style={{ width: 671, height: 40 }} placeholder={'请输入钉钉Agentld'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'钉钉App Key'}</span>
        </label>
        <Input maxLength={255} allowClear onChange={(val) => onChange('ding_talk_app.app_key', val)} value={data?.ding_talk_app?.app_key || ''} style={{ width: 671, height: 40 }} placeholder={'请输入App Key'} />
      </div>
      <div className="card init-account-name">
        <label>
          <span className='required'>*</span>
          <span>{'钉钉App Secret'}</span>
        </label>
        <Input.Password autoComplete="new-password" maxLength={255} allowClear onChange={(val) => onChange('ding_talk_app.app_secret', val)} value={data?.ding_talk_app?.app_secret || ''} style={{ width: 671, height: 40 }} placeholder={'请输入钉钉App Secret'} />
      </div>
    </>
  }

  const renderIcon = (channel_id)=>{
    if(theme == 'dark'){
      return THIRD_PARTY?.[channel_id]?.icon || '';
    }else{
      return THIRD_PARTY?.[channel_id]?.iconwhite || THIRD_PARTY?.[channel_id]?.icon || '';
    }
  }

  return (
    <>
      <Modal
        title={'新增第三方集成'}
        className="runnerGo-add-third-party-integration-modal"
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
        style={{ width: 735 }}
      >
        <div className="card name">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{'名称'}</span>
          </label>
          <Input maxLength={255} allowClear onChange={(val) => onChange('name', val)} value={data?.name || ''} style={{ width: 671, height: 40 }} placeholder={'请输入名称'} />
        </div>
        <div className="card type">
          <label htmlFor="">
            <span className='required'>*</span>
            <span>{'通知类型'}</span>
            <span className='help' onClick={() => window.open('​https://wiki.runnergo.cn/docs/notice1')}>
              <IconQuestionCircle />
              查看帮助
            </span>
          </label>
          <Radio.Group value={data?.channel_id} onChange={(val) => onChange('channel_id', val)} name='button-radio-group'>
            {[1, 2, 4, 5, 6, 7].map((item) => {
              return (
                <Radio key={item} value={item}>
                  {({ checked }) => {
                    return (
                      <div className={cn('item-card', {
                        [`item-card${item}`]: true,
                        active: checked
                      })}>
                        <div className="icon">{renderIcon(item)}</div>
                        <div className="name">{THIRD_PARTY?.[item].name || ''}</div>
                      </div>
                    );
                  }}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
        {typeInput[data.channel_id] || null}

      </Modal >
    </>
  )
};

export default AddThirdPartyIntegration;