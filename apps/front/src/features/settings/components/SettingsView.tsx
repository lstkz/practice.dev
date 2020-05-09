import React from 'react';
import { useSettingsModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { getSettingsState, SettingsTab, SettingsActions } from '../interface';
import { Tabs, Tab } from 'src/components/Tabs';
import { useActions } from 'typeless';
import { Container } from 'src/components/Container';
import styled from 'styled-components';
import { Theme } from 'ui';
import { PictureSection } from './PictureSection';
import { PageLoader } from 'src/components/PageLoader';
import { PublicProfileSection } from './PublicProfileSection';

const Wrapper = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  background: ${Theme.bgLightGray10};
  border: 1px solid ${Theme.grayLight};
  border-radius: 5px;
  ${Tab} {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const TabContent = styled.div`
  width: 350px;
  padding-bottom: 40px;
  padding-top: 40px;
  margin: 0 auto;
`;

export function SettingsView() {
  useSettingsModule();
  const { tab, isLoaded } = getSettingsState.useState();
  const { changeTab } = useActions(SettingsActions);
  const renderContent = () => {
    if (!isLoaded) {
      return <PageLoader />;
    }
    return (
      <Wrapper>
        <Tabs
          selectedTab={tab}
          onIndexChange={(value: SettingsTab) => changeTab(value)}
          paddingLeft="small"
        >
          <Tab title="Profile" name="profile" testId="profile-tab">
            <TabContent>
              <PictureSection />
              <PublicProfileSection />
            </TabContent>
          </Tab>
          <Tab title="Account" name="account" testId="account-tab">
            <TabContent>content a</TabContent>
          </Tab>
        </Tabs>
      </Wrapper>
    );
  };
  return (
    <Dashboard>
      <Container data-test="setting-page">{renderContent()}</Container>
    </Dashboard>
  );
}
