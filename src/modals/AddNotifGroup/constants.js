import CompanyWechatGroupSvg from '@assets/thirdParty/wechat_group.svg';
import CompanyWechatSvg from '@assets/thirdParty/company_wechat.svg';
import CompanyWechatWhiteSvg from '@assets/thirdParty/wechat-white.svg';
import DingDingSvg from '@assets/thirdParty/dingding.svg';
import DingDingDarkSvg from '@assets/thirdParty/dingding-dark.svg';
import DingDingWhiteSvg from '@assets/thirdParty/dingding-white.svg';
import EmailSvg from '@assets/thirdParty/email.svg';
import FeishGroupSvg from '@assets/thirdParty/feishu_group.svg';
import FeishuSvg from '@assets/thirdParty/feishu.svg';
import FeishuWhiteSvg from '@assets/thirdParty/feishu-white.svg';
import React from 'react';

export const THIRD_PARTY = {
  1:{
    name:'飞书群机器人',
    icon:<FeishGroupSvg />,
    iconwhite:<FeishuWhiteSvg />
  },
  2:{
    name:'飞书企业应用',
    icon:<FeishuSvg />
  },
  3:{
    name:'企业微信应用',
    icon:<CompanyWechatSvg />
  },
  4:{
    name:'企业微信机器人',
    icon:<CompanyWechatGroupSvg />,
    iconwhite:<CompanyWechatWhiteSvg />
  },
  5:{
    name:'邮箱',
    icon:<EmailSvg />
  },
  6:{
    name:'钉钉群机器人',
    icon:<DingDingDarkSvg />,
    iconwhite:<DingDingWhiteSvg />
  },
  7:{
    name:'钉钉企业应用',
    icon:<DingDingSvg />
  }
}