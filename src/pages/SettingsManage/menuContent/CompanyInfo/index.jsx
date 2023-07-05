import React from 'react'
import './index.less';
import { useSelector } from 'react-redux';

const CompanyInfo = () => {

  const company_name = useSelector((store) => store?.company?.name);

  return (
    <div className='settings-company-info'>
      <div className='title'>公司信息</div>
      <div className="name">
        <label>公司名称：</label>
        <span className='text'>{company_name || '-'}</span>
      </div>
    </div>
  )
}
export default CompanyInfo;