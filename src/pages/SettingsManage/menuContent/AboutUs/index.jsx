import React from 'react'
import { APP_VERSION } from '@config';
import './index.less';
import { useSelector } from 'react-redux';
import AboutUsSvg from '@assets/aboutus.svg';

const CompanyInfo = () => {

  const company_name = useSelector((store) => store?.company?.name);

  return (
    <div className='settings-about-us'>
      <div className='title'>关于RunnerGo</div>
      <div className="content">
        <div className="icon">
          <AboutUsSvg />
        </div>
        <div className="right">
          <div className="name-text">RunnerGo</div>
          <div className="version">当前版本：{APP_VERSION}</div>
        </div>
      </div>
      <div className="other-data">
        <p className="other">其他信息</p>
        <p className="doc" onClick={()=>window.open('https://wiki.runnergo.cn/docs/1')}>使用文档</p>
        <p className="official-site" onClick={()=>window.open('https://www.runnergo.com')}>RunnerGo官网</p>
      </div>
    </div>
  )
}
export default CompanyInfo;