import { useEffect } from 'react';
import useInit from './modules/useInit';
import usePermission from './modules/usePermission';

const useGlobal = (props) => {
  useInit();
  usePermission();
};

export default useGlobal;
