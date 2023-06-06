import { useContext, useMemo, useState } from 'react';
import { Tree } from '@arco-design/web-react';
import React from 'react';
import { isArray } from 'lodash';
import context from './Context';
import { useTranslation } from 'react-i18next';

const RoleTreeList = (props) => {
  const { value } = props;

  const {
    CURRENT_ROLE,
    setCURRENT_ROLE,
    setCurrentRoleType
  } = useContext(context);
  const { t } = useTranslation();
  const treeData = useMemo(() => {
    if (isArray(value) && value.length > 0) {
      return value.reduce((lastArr, current) => {
        // 企业角色
        if (current?.role_type == 1) {
          lastArr[0].children.push({
            title: current?.name,
            key: current?.role_id,
            role_type: 1,
          })
        }
        // 团队角色
        if (current?.role_type == 2) {
          lastArr[1].children.push({
            title: current?.name,
            key: current?.role_id,
            role_type: 2,
          })
        }
        return lastArr;
      }, [{
        title: t('text.company_role'),
        key: '0', children: []
      }, {
        title: t('text.role_team'),
        key: '1', children: []
      }])
    }

    return []
  }, [value]);
  return (
    <div>
      {isArray(treeData) && treeData.length > 0 && CURRENT_ROLE != null && (
        <Tree
          onSelect={(node_arr, extra) => {
            const { childrenData, role_type } = extra?.node?.props || {}
            if (isArray(node_arr) && node_arr.length > 0) {
              if (!isArray(childrenData) || childrenData.length <= 0) {
                setCURRENT_ROLE(node_arr[0]);
                setCurrentRoleType(role_type || 1);
              }
            }
          }}
          blockNode={true}
          autoExpandParent={true}
          actionOnClick='select'
          selectedKeys={[CURRENT_ROLE]}
          // selectedKeys={[CURRENT_ROLE]}
          renderTitle={({ title }) => (<span className='ertrwtre'>{title}</span>)}
          treeData={treeData}
        />
      )}
    </div>
  );
}

export default RoleTreeList;
