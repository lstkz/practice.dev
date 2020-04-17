import React from 'react';
import { usePublicProfileModule } from '../module';
import {
  getPublicProfileState,
  ProfileTab,
  PublicProfileActions,
} from '../interface';
import styled from 'styled-components';
import { Theme } from 'ui';
import { Container } from 'src/components/Container';
import { Dashboard } from 'src/components/Dashboard';
import { Tabs, Tab } from 'src/components/Tabs';
import { useActions } from 'typeless';
import { ProfileInfo } from './ProfileInfo';

const Wrapper = styled.div`
  margin-top: 30px;
  border-radius: 5px;
  border: 1px solid ${Theme.grayLight};
  display: flex;
  min-height: 500px;
  background: ${Theme.bgLightGray7};
`;

const Left = styled.div`
  width: 300px;
`;
const Right = styled.div`
  border-left: 1px solid ${Theme.grayLight};
  flex: 1 0 0;
  padding-top: 30px;
`;

export function PublicProfileView() {
  usePublicProfileModule();
  const { isLoaded, tab } = getPublicProfileState.useState();
  const { changeTab } = useActions(PublicProfileActions);

  const renderContent = () => {
    if (!isLoaded) {
      return <div>loading...</div>;
    }
    return (
      <Wrapper>
        <Left>
          <ProfileInfo />
        </Left>
        <Right>
          <Tabs
            selectedTab={tab}
            onIndexChange={(value: ProfileTab) => changeTab(value)}
          >
            <Tab testId="overview-tab" title="Overview" name="overview">
              Overview
            </Tab>
            <Tab testId="solutions-tab" title="Solutions (15)" name="solutions">
              Solutions
            </Tab>
            <Tab testId="likes-tab" title="Likes (10)" name="likes">
              Likes
            </Tab>
            <Tab testId="followers-tab" title="Followers (10)" name="followers">
              Followers
            </Tab>
            <Tab testId="following-tab" title="Following (20)" name="following">
              Following
            </Tab>
          </Tabs>
        </Right>
      </Wrapper>
    );
  };

  return (
    <Dashboard>
      <Container data-test="profile-page">{renderContent()}</Container>
    </Dashboard>
  );
}
