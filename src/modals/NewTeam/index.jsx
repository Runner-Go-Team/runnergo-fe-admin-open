import React, { useState } from 'react';
import { Modal, Button, Input, Radio, Message } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { serviceNewTeam } from '@services/team';
import './index.less';
import { trim } from 'lodash';
const RadioGroup = Radio.Group;

const NewTeamModal = (props) => {
  const { visible, setVisible , updateTeamList } = props;
  const { t } = useTranslation();
  const [teamData, setTeamData] = useState({
    name: '',
    teamProperty: 2
  });

  const newTeam = async () => {
    try {
      if (trim(teamData.name).length <= 0) {
        Message.error(t('message.teamNameNotNull'));
        return;
      }
      let resp =await serviceNewTeam({
        company_id: localStorage.getItem('company_id'), //企业id
        name: trim(teamData.name),
        team_type: teamData.teamProperty, //团队类型 1: 私有团队；2: 公开团队
      })
      if(resp?.code == 0){
        Message.success(t('btn.newTeamSuccess'));
        // 刷新团队列表
        updateTeamList && updateTeamList();
        setVisible(false)
      }
    } catch (error) {}
  }

  return (
    <Modal
      title={t('btn.newTeam')}
      className="runnerGo-newteam-modal"
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      autoFocus={false}
      focusLock={true}
      footer={
        <>
          <Button
          className='btn-close'
            onClick={() => {
              setVisible(false);
            }}
          >
            {t('btn.close')}
          </Button>
          <Button
            onClick={() => {
              newTeam();
            }}
          >
            {t('btn.save')}
          </Button>
        </>
      }
    >
      <div className="team-name">
        {t('modal.teamName')}
      </div>
      <Input
        allowClear
        placeholder={t('text.placeholder_new_team')}
        maxLength={30}
        height={40}
        value={teamData?.name}
        onChange={(val) => setTeamData((lastState) => ({ ...lastState, name: val }))}
      />
      <div className="team-property">
        {t('text.team_property')}
      </div>
      <RadioGroup onChange={(val) => setTeamData((lastState) => ({ ...lastState, teamProperty: val }))} value={teamData?.teamProperty} style={{ marginTop: 8 }}>
        <Radio value={1}>{t('text.private')}</Radio>
        <Radio value={2}>{t('text.public')}</Radio>
      </RadioGroup>
    </Modal>
  )
};

export default NewTeamModal;