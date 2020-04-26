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
import { OverviewContent } from './OverviewContent';
import { ProfileInfoLoader, ProfileContentLoader } from './PublicProfileLoader';
import { SolutionsTab, useSolutionsModule } from './SolutionsTab';
import { SolutionModal } from 'src/features/solution/components/SolutionModal';

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
  flex: 1 0 auto;
  padding-top: 30px;
  ${Tab} {
    min-height: 600px;
    border-bottom-right-radius: 5px;
    padding: 30px 50px;
  }
`;

export function PublicProfileView() {
  usePublicProfileModule();
  useSolutionsModule();

  const { isLoaded, tab, profile } = getPublicProfileState.useState();
  const { changeTab } = useActions(PublicProfileActions);

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <Wrapper>
          <Left>
            <ProfileInfoLoader />
          </Left>
          <Right>
            <ProfileContentLoader />
          </Right>
        </Wrapper>
      );
    }
    return (
      <Wrapper>
        <SolutionModal />
        <Left>
          <ProfileInfo />
        </Left>
        <Right>
          <Tabs
            selectedTab={tab}
            onIndexChange={(value: ProfileTab) => changeTab(value)}
          >
            <Tab testId="overview-tab" title="Overview" name="overview">
              <OverviewContent />
            </Tab>
            <Tab
              testId="solutions-tab"
              title={`Solutions (${profile.solutionsCount})`}
              name="solutions"
            >
              <SolutionsTab />
            </Tab>
            <Tab
              testId="likes-tab"
              title={`Likes (${profile.likesCount})`}
              name="likes"
            >
              Likes
            </Tab>
            {/* <Tab
              testId="followers-tab"
              title={`Followers (${profile.followersCount})`}
              name="followers"
            >
              Followers
            </Tab>
            <Tab
              testId="following-tab"
              title={`Following (${profile.followingCount})`}
              name="following"
            >
              Following
            </Tab> */}
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
