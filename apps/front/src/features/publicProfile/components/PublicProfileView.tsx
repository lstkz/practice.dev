import React from 'react';
import { usePublicProfileModule } from '../module';
import {
  getPublicProfileState,
  ProfileTab,
  PublicProfileActions,
} from '../interface';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Dashboard } from 'src/components/Dashboard';
import { Tabs, Tab } from 'src/components/Tabs';
import { useActions } from 'typeless';
import { ProfileInfo } from './ProfileInfo';
import { OverviewContent } from './OverviewContent';
import { SolutionsTab, useSolutionsModule } from './SolutionsTab';
import { SolutionModal } from 'src/features/solution/components/SolutionModal';
import { LikesTab, useLikesModule } from './LikesTab';
import { PageLoader } from 'src/components/PageLoader';
import { Theme, MOBILE } from 'src/Theme';

const Wrapper = styled.div`
  margin-top: 30px;
  border-radius: 5px;
  border: 1px solid ${Theme.grayLight};
  display: flex;
  min-height: 500px;
  background: ${Theme.bgLightGray10};
  ${MOBILE} {
    flex-direction: column;
  }
`;

const Left = styled.div`
  width: 300px;
  ${MOBILE} {
    width: 100%;
  }
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
  ${MOBILE} {
    border-left: none;
    border-top: 1px solid ${Theme.grayLight};
  }
`;

const NotExistsWrapper = styled(Wrapper)`
  min-height: 0;
  text-align: center;
  display: block;
  padding: 30px;
`;

export function PublicProfileView() {
  usePublicProfileModule();
  useSolutionsModule();
  useLikesModule();

  const {
    isLoaded,
    tab,
    profile,
    isNotFound,
  } = getPublicProfileState.useState();
  const { changeTab } = useActions(PublicProfileActions);

  const renderContent = () => {
    if (isNotFound) {
      return (
        <NotExistsWrapper data-test="user-not-found">
          User doesn't exist
        </NotExistsWrapper>
      );
    }
    if (!isLoaded) {
      return <PageLoader />;
    }
    return (
      <Wrapper>
        <SolutionModal />
        <Left>
          <ProfileInfo />
        </Left>
        <Right>
          <Tabs
            paddingLeft="md"
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
              <LikesTab />
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
