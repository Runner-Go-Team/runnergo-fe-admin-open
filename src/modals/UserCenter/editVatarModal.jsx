import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Radio, Message, Upload } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';
import cn from 'classnames';
import OSS from 'ali-oss';
import { OSS_Config } from '@config';
import { ServiceUpdateUserAvatar } from '@services/user';
import './editVatarModal.less';
import { useDispatch } from 'react-redux';
import { debounce, trim } from 'lodash';
const RadioGroup = Radio.Group;

const EditVatarModal = (props) => {
  const { visible, setVisible, avatar } = props;
  const [selectDefault, setSelectDefault] = useState(null);
  const [avatarNow, setAvatarNow] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const defaultAvatar = [
    "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default1.png",
    "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default2.png",
    "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default3.png"
  ];
  useEffect(() => {
    setAvatarNow(avatar);
  }, [avatar]);

  const uploadFile = async (file) => {
    if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
      Message.error(t('message.setOssConfig'));
      return;
    }
    const fileMaxSize = 1024 * 3;
    const fileType = ['jpg', 'jpeg', 'png'];
    const { originFile: { size, name } } = file;
    const nameType = name.split('.')[1];

    if (size / 1024 > fileMaxSize) {
      Message.error(t('message.maxFileSize'));
      return;
    };
    if (!fileType.includes(nameType)) {
      Message.error(t('message.AvatarType'));
      return;
    }

    // let formData = new FormData();
    // formData.append('file', files[0].originFile);

    // const res = await axios.post(`${RD_FileURL}/api/upload`, formData);
    // const url = `${RD_FileURL}/${res.data[0].filename}`;


    const client = new OSS(OSS_Config);
    const { name: res_name, url } = await client.put(
      `kunpeng/avatar/${v4()}.${nameType}`,
      file.originFile,
    )
    setAvatarNow(url);
  };
  const updateAvatar = debounce(async () => {
    try {
      const resp= await ServiceUpdateUserAvatar({
        avatar_url: avatarNow,
      });
      if(resp?.code == 0){
        Message.success(t('message.updateSuccess'));
        dispatch({
          type: 'user/updateUser',
          payload: {
            avatar: avatarNow
          }
        })
        setVisible(false);
      }
    } catch (error) {}
  }, 200);
  return (
    <Modal
      title=''
      className="runnerGo-user-edit-avatar-modal"
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      autoFocus={false}
      focusLock={true}
      footer={null}
    >
      <div className='container'>
        <p className='title'>{t('modal.defaultAvatar')}</p>
        <div className='default-avatar'>
          {
            defaultAvatar.map((item, index) => (
              <div className='avatar-body'>
                <img className={cn('default-avatar-item', {
                  'select-avatar': selectDefault === index
                })} key={index} src={item} onClick={() => {
                  setSelectDefault(index);
                  setAvatarNow(defaultAvatar[index])
                }} />
              </div>
            ))
          }
        </div>
        <p className='title' style={{ marginTop: '50px' }}>{t('modal.diyAvatar')}</p>
        <Upload showUploadList={false} onChange={(_, currentFile) => uploadFile(currentFile)}>
          <img className='avatar' src={avatarNow || avatar} alt="" />
        </Upload>
        <p className='avatar-tips'>{t('modal.avatarTips')}</p>

        <div className='btn'>
          <Upload showUploadList={false} onChange={(_, currentFile) => uploadFile(currentFile)}>
            <Button type='outline' className='select-btn'>{t('btn.selectImg')}</Button>
          </Upload>
          <Button type='outline' className='cancel-btn' onClick={() => setVisible(false)}>{t('btn.cancel')}</Button>
          <Button className='ok-btn' onClick={() => updateAvatar()}>{t('btn.ok')}</Button>
        </div>
      </div>
    </Modal>
  )
};

export default EditVatarModal;