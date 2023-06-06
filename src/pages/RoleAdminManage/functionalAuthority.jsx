import { useState, useEffect } from 'react';
import { Collapse, Checkbox } from '@arco-design/web-react';
import { isArray } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
const CheckboxGroup = Checkbox.Group;

const CollapseItem = Collapse.Item;
const FunctionalAuthority = (props) => {
  const { value, checkPremissionKeys, setCheckPremissionKeys, is_update_permission } = props;
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const { t } = useTranslation();
  const getAllKeys = (items) => {
    let keys = [];
    items.forEach((item) => {
      if (item.permissions && item.permissions.length > 0) {
        keys = [...keys, ...getAllKeys(item.permissions)];
      }
      if (item.mark && !item?.permissions) {
        keys.push(item.mark);
      }
    });
    return keys;
  };
  useEffect(() => {
    if (checkPremissionKeys.length == getAllKeys(value).length) {
      setCheckAll(true);
      setIndeterminate(false);
    } else if (checkPremissionKeys.length == 0) {
      setCheckAll(false);
      setIndeterminate(false);
    } else if (checkPremissionKeys.length > 0) {
      setCheckAll(false);
      setIndeterminate(true);
    }
  }, [checkPremissionKeys]);
  const getDefaultCheckedKeys = (arr) => {
    let keys = [];
    arr.forEach((item) => {
      if (item.permissions && item.permissions.length > 0) {
        keys = [...keys, ...getDefaultCheckedKeys(item.permissions)];
      }
      if (item?.is_have) {
        keys.push(item.mark);
      }
    });
    return keys;
  }
  useEffect(() => {
    setCheckPremissionKeys(getDefaultCheckedKeys(value));
  }, [value]);
  function onChangeAll(checked) {
    const newCheckedKeys = checked ? getAllKeys(value) : [];
    setCheckPremissionKeys(newCheckedKeys);
    setCheckAll(checked);
    setIndeterminate(false);
  }

  // function onChange(checkList) {
  //   setIndeterminate(!!(checkList.length && checkList.length !== value.length));
  //   setCheckAll(!!(checkList.length === value.length));
  //   setValue(checkList);
  // }
  const onChangeAllCard = (checked, arr) => {
    if (isArray(arr)) {
      const newCheckedKeys = [...checkPremissionKeys];
      arr.forEach((item) => {
        let mark = item.mark;
        if (checked) {
          if(!newCheckedKeys.includes(mark)){
            newCheckedKeys.push(mark);
          
          }
        } else {
          const index = newCheckedKeys.indexOf(mark);
          if (index > -1) {
            newCheckedKeys.splice(index, 1);
          }
        }
      });
      setCheckPremissionKeys(newCheckedKeys);
    }
  }
  const handleCheck = (mark, checked) => {
    const newCheckedKeys = [...checkPremissionKeys];
    if (checked) {
      newCheckedKeys.push(mark);
    } else {
      const index = newCheckedKeys.indexOf(mark);
      if (index > -1) {
        newCheckedKeys.splice(index, 1);
      }
    }
    setCheckPremissionKeys(newCheckedKeys);
  };

  const isAllChecked = (items) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!checkPremissionKeys.includes(item.mark) || (item.permissions && item.permissions.length > 0 && !isAllChecked(item.permissions))) {
        return false;
      }
    }
    return true;
  };

  const isIndeterminate = (items) => {
    let oneCheck = false;
    let oneNotCheck = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // 至少有一个选中
      if (checkPremissionKeys.includes(item.mark)) {
        oneCheck = true;
      }
      // 至少有一个未选中
      if (!checkPremissionKeys.includes(item.mark)) {
        oneNotCheck = true;
      }
    }
    return oneCheck && oneNotCheck ? true : false;
  };

  return (
    <div className='function-authority'>
      <div className='prompt'>{t('text.company_role_cannot_custom')}</div>
      <div>
        <Checkbox disabled={!is_update_permission} onChange={onChangeAll} checked={checkAll} indeterminate={indeterminate}>
          {t('btn.selectAll')}
        </Checkbox>
      </div>
      {isArray(value) && value.map((item) => {
        const isChecked = checkPremissionKeys.includes(item.mark);
        const isItemAllChecked = item.permissions && item.permissions.length > 0 ? isAllChecked(item.permissions) : isChecked;
        const isItemIndeterminate = item.permissions && item.permissions.length > 0 ? isIndeterminate(item.permissions) : false;
        return <Collapse
          defaultActiveKey={['1']}
          expandIconPosition='right'
          style={{ maxWidth: 1180 }}
        >
          <CollapseItem
            header={
              <div onClick={(e) => {
                e.stopPropagation();
              }}>
                <Checkbox disabled={!is_update_permission} onChange={(val) => onChangeAllCard(val, item?.permissions)} checked={isItemAllChecked} indeterminate={isItemIndeterminate}>
                  {item?.group_name || '-'}
                </Checkbox>
              </div>
            }
            name='1'>
            {isArray(item?.permissions) && item.permissions.map((i) => {
              const isChecked = checkPremissionKeys.includes(i.mark);
              return <Checkbox disabled={!is_update_permission} onChange={(checked) => handleCheck(i.mark, checked)} checked={isChecked}>
                {i?.title || '-'}
              </Checkbox>
            })}
          </CollapseItem>
        </Collapse>
      }
      )}
    </div>
  );
}

export default FunctionalAuthority;
