import React from 'react';
import './handleTags.less';
import { useTranslation } from 'react-i18next';
/**
 * type:
 * 新建 - #2BA58F - create
 * 修改 - var(--log-blue) - update
 * 删除 - var(--theme-color) - delete
 * 导入 var(--sub-color-4) import
 * 解散 var(--sub-color-5) dissolve
 * 移除  var(--sub-color-6) remove
 * 移交 var(--sub-color-7) hand_over
 */

const HandleTags = (props) => {
    const { t } = useTranslation();
    const tagList = {
        '1': ['var(--sub-color-1)', t('btn.add')],
        '2': ['var(--sub-color-3)', t('text.modify')],
        '3': ['var(--run-red)', t('btn.delete')],
        '4':['var(--sub-color-4)',t('text.import')],
        '5':['var(--sub-color-5)',t('text.dissolve')],
        '6':['var(--sub-color-6)',t('text.remove')],
        '7':['var(--sub-color-7)',t('text.hand_over')]
    };
    const { type } = props;
    const [color, text] = tagList[type];

    return (
        <div className='handle-tag' style={{ backgroundColor: color }}>
            {text}
        </div>
    )
};

export default HandleTags;