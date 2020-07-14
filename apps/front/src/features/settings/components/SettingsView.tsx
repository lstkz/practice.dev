import React from 'react';
import { useSettingsModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import { getSettingsState, SettingsTab, SettingsActions } from '../interface';
import { Tabs, Tab } from 'src/components/Tabs';
import { useActions } from 'typeless';
import { Container } from 'src/components/Container';
import styled from 'styled-components';
import { Theme } from 'src/Theme';
import { PictureSection } from './PictureSection';
import { PageLoader } from 'src/components/PageLoader';
import { PublicProfileSection } from './PublicProfileSection';
import { EmailSection } from './EmailSection';
import { PasswordSection } from './PasswordSection';
import { getRouterState } from 'typeless-router';
import { parseQueryString } from 'src/common/url';

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
  max-width: 430px;
  padding-bottom: 40px;
  padding-top: 40px;
  width: 100%;
  margin: 0 auto;
`;

export function SettingsView() {
  useSettingsModule();
  const { isLoaded } = getSettingsState.useState();
  const { changeTab } = useActions(SettingsActions);
  const { location } = getRouterState.useState();
  const tab = React.useMemo(() => {
    const qs = parseQueryString(location?.search);
    if (qs.tab === 'account') {
      return 'account' as SettingsTab;
    }
    return 'profile' as SettingsTab;
  }, [location]);
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
            <TabContent>
              <EmailSection />
              <PasswordSection />
            </TabContent>
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
