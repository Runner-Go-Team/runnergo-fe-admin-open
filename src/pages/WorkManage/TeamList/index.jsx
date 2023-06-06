import React, { useEffect, useState } from 'react';
import { Input, Button, Grid , Empty} from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import SvgSwap from '@assets/swap.svg';
import TeamListItem from './teamListItem';
import './index.less';
import { isArray } from 'lodash';

const { GridItem } = Grid;
const TeamList = (props) => {
  const { value } = props;

  const { t } = useTranslation();
  return (
    <div style={{ width: '100%' }} className='runnerGo-team-list'>
      {isArray(value) && value.length > 0 ? (<Grid cols={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 5 }} colGap={12} rowGap={16} className='grid-responsive-demo'>
        {value.map((item) => <GridItem key={item?.team_id} className='demo-item'><TeamListItem key={item?.team_id} value={item} /></GridItem>)}
      </Grid>) : <Empty /> }
    </div>
  )
};

export default TeamList;