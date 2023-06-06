import { useEffect } from 'react';
import { useEventBus } from '@utils/eventBus';
import { useDispatch, useSelector } from 'react-redux';
import { isArray } from 'lodash';

const usePermission = () => {
  const companyPermissions = useSelector((store) => store?.permission?.companyPermissions);
  const checkCompanyPermission = (permissionMark) => {
    if(isArray(companyPermissions)){
      return companyPermissions.includes(permissionMark);
    }
    return false;
  }
  
  useEventBus('checkCompanyPermission',checkCompanyPermission,[companyPermissions]);

};

export default usePermission;
