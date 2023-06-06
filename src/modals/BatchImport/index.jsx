import React, { useState } from 'react';
import { Modal, Button, Input, Select, Tooltip, Upload, Progress, Message, Table } from '@arco-design/web-react';
import IconXlsx from '@assets/xlsx.svg';
import cn from 'classnames';
import { RD_BASE_URL } from '@config';
import { getBatchImportFile, companyMemeberImport } from '@services/company';
import IconNoFile from '@assets/no_file.svg';

import { useTranslation } from 'react-i18next';
import './index.less';
import { debounce, isArray, isNumber, isPlainObject, isString } from 'lodash';

const Option = Select.Option;
const BatchImport = (props) => {
  const { onCancel, initMemberList } = props;

  const [step, setStep] = useState('upload_file'); // upload_file | import_data | success
  const [successInfo, setSuccessInfo] = useState({});
  const [import_err_desc, setImport_err_desc] = useState([]);
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);

  const { t } = useTranslation();

  const onSelectFile = (files) => {
    if (isArray(files) && files.length > 0 && files[0]?.originFile instanceof File) {
      setFile(files[0]?.originFile);
    }
    return false;
  };

  // const onReupload = (files) => {
  //   return false;
  // };
  const viewErrorReport = () => {
    const columns = [
      {
        title: t('text.account'),
        dataIndex: 'account',
        ellipsis: true
      },

      {
        title: t('text.err_msg'),
        dataIndex: 'err_msg',
        ellipsis: true
      },
    ];
    Modal.confirm({
      title: t('text.err_report'),
      className: "runnerGo-view-error-report-modal",
      style: {
        width: '900px',
        height: '640px',
        padding: '0px',
      },
      content: <div className='info'>
        {/* <div className='lable'>{t('text.err_report')}</div> */}
        <Table pagination={false} ellipsis={true} borderCell={true} columns={columns} data={import_err_desc || []} />
      </div>,
      closable: true,
      icon: null,
      onOk: () => {
        return new Promise((resolve, reject) => {
          updateUserData('password', '').then(data => resolve()).catch(err => reject())
        })
      },
    });
  }
  const renderContent = () => {
    switch (step) {
      case 'upload_file':
        // 选中文件
        if (file != null && file instanceof File) {
          return <div className="content select-file">
            <div className="svg">
              <IconXlsx />
            </div>
            <div className="support-text">
              {file?.name}
              <span className='size'>{`(${isNumber(file?.size) ? (file.size / 1024).toFixed(2) : '-'}k)`}</span>
            </div>
            <Upload fileList={[]} showUploadList={false} onChange={onSelectFile} autoUpload={false} accept=".xls,.xlsx">
              <Button type='outline' onClick={(e) => {
                e.stopPropagation();
                setFile(null)
              }}>{t('text.reselect')}</Button>
            </Upload>
          </div>
        } else {
          return <div className="content">
            <div className="left">
              <div className="title">{t('text.upload_file_text')}</div>
              <div className="svg">
                <IconXlsx />
              </div>
              <div className="support-text"></div>
              <Button type='outline'>
                <a href={'/xlsx/RunnerGo创建成员批量导入模板.xlsx'} target="_blank" rel="nofollow noreferrer">
                  {t('text.download_template')}
                </a>
              </Button>
            </div>
            <div className="line"></div>
            <div className="right">
              <div className="title">{t('text.upload_file_after_text')}</div>
              <div className="svg">
                <IconNoFile />
              </div>
              <div className="support-text">
                {t('text.support_files')}
              </div>
              <Upload fileList={[]} showUploadList={false} onChange={onSelectFile} autoUpload={false} accept=".xls,.xlsx">
                <Button type='outline' onClick={() => console.log('')}>{t('text.upload_file')}</Button>
              </Upload>
            </div>
          </div>
        }
        break;
      case 'import_data':
        return (
          <>
            <div className='progress'>
              <Progress color='var(--theme-color)' size='large' type='circle' percent={percent} style={{ color: "var(--theme-color)" }} />
            </div>
            <div className='progress-text'>{t('text.importing')}...</div>
          </>
        )
        break;
      case 'success':
        return (
          <>
            <div className='progress'>
              <Progress size='large' type='circle' percent={100} style={{ color: "var(--theme-color)" }} />
            </div>
            <div className='progress-text'>{t('message.importSuccess')}</div>
            <div className='progress-text' style={{ marginTop: '10px' }}>{t('message.importSuccess')}{successInfo?.success_num || '0'}{t('text.article')}，{t('text.import_failure')}{successInfo?.fail_num || '0'}{t('text.article')} </div>
            {isString(successInfo?.path) && successInfo.path.length > 0 && (<div className='progress-text'> {t('text.please_check')}<Button onClick={()=>{}} style={{ color: 'var(--theme-color)' }} type='text'><a href={`${RD_BASE_URL}${successInfo.path}`}>{t('text.err_report')}</a></Button>，{t('text.modify_import_again')}</div>)}
          </>
        )
        break;
      default:
        break;
    }
  }
  const importFile = debounce(async () => {
    if (file == null) {
      Message.error(t('text.upload_file_befort_import'))
      return;
    }
    if (step == 'success') {
      setStep('upload_file');
      setFile(null);
      return;
    }
    setStep('import_data');
    let company_id = localStorage.getItem('company_id');
    try {
      const resp = await companyMemeberImport({ company_id, file: file }, (progressEvent) => {
        const temp_percent = parseInt((progressEvent.loaded / progressEvent.total) * 100);
        setPercent(temp_percent);
      })
      if (resp?.code == 0 && isPlainObject(resp?.data)) {
        // 上传成功
        setSuccessInfo(resp?.data);
        setImport_err_desc(resp?.data?.import_err_desc || []);
        if (resp?.data?.success_num > 0) {
          initMemberList && initMemberList();
        }
        setStep('success');
      }
    } catch (error) {
      setStep('upload_file');
    }
  }, 200)
  return (
    <>
      <Modal
        title={t('text.batch_import')}
        className="runnerGo-batch-import-modal"
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
                if (step == 'success') {
                  importFile();
                } else {
                  onCancel();
                }
              }}
            >
              {step == 'success' ? t('text.continue_import') : t('btn.close')}
            </Button>
            <Button
              onClick={() => {
                if (step == 'success') {
                  onCancel();
                } else {
                  importFile();
                }
              }}
            >
              {step == 'success' ? t('text.complete') : t('text.import')}
            </Button>
          </>
        }
        style={{ width: 800, height: 416 }}
      >
        <div className="step">
          <div className={cn('step-number', {
            active: step == 'upload_file'
          })}>1</div>
          <label htmlFor="">{t('text.upload_file')}</label>
          <div className="line"></div>
          <div className={cn('step-number', {
            active: step == 'import_data'
          })}>2</div>
          <label htmlFor="">{t('text.import_data')}</label>
          <div className="line"></div>
          <div className={cn('step-number', {
            active: step == 'success'
          })}>3</div>
          <label htmlFor="">{t('text.complete')}</label>
        </div>
        {renderContent()}
      </Modal >
    </>
  )
};

export default BatchImport;