import * as React from 'react';
import { Tabs, Tab } from 'src/components/Tabs';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';
import { TabContent } from './TabContent';

interface ChallengeLoaderProps {
  className?: string;
}

const primaryColor = '#DDDEE4';
const secondaryColor = '#ccc';

const Header = styled.div`
  height: 117px;
  svg {
    width: 400px;
    height: 100px;
  }
`;

const SvgWrapperCol1 = styled.div`
  height: 700px;
  svg {
    display: block;
    margin-bottom: 45px;
    width: 400px;
    height: 110px;
  }
`;

const SvgWrapperCol2 = styled.div`
  svg {
    display: block;
    margin-bottom: 15px;
    width: 240px;
    height: 100px;
  }
`;

function DetailsLoader() {
  return (
    <ContentLoader
      speed={2}
      width={600}
      height={110}
      viewBox="0 0 600 110"
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      <rect x="0" y="0" rx="5" ry="5" width="120" height="26" />
      <rect x="0" y="38" rx="5" ry="5" width="600" height="26" />
      <rect x="0" y="76" rx="5" ry="5" width="300" height="26" />
    </ContentLoader>
  );
}

function SidebarLoader() {
  return (
    <ContentLoader
      speed={2}
      width={240}
      height={100}
      viewBox="0 0 240 100"
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      <rect x="0" y="0" rx="5" ry="5" width="120" height="26" />
      <rect x="0" y="38" rx="5" ry="5" width="240" height="26" />
    </ContentLoader>
  );
}
const _ChallengeLoader = (props: ChallengeLoaderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Header>
        <ContentLoader
          speed={2}
          width={400}
          height={100}
          viewBox="0 0 400 100"
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        >
          <rect x="20" y="20" rx="5" ry="5" width="40" height="40" />
          <rect x="80" y="20" rx="5" ry="5" width="220" height="26" />
          <rect x="80" y="66" rx="5" ry="5" width="120" height="26" />
        </ContentLoader>
      </Header>
      <Tabs
        selectedTab="details"
        onIndexChange={() => {
          //
        }}
      >
        <Tab title="Details" name="details">
          <TabContent
            left={
              <SvgWrapperCol1>
                <DetailsLoader />
                <DetailsLoader />
                <DetailsLoader />
              </SvgWrapperCol1>
            }
            right={
              <SvgWrapperCol2>
                <SidebarLoader />
                <SidebarLoader />
              </SvgWrapperCol2>
            }
          />
        </Tab>
        <Tab title="Test Suite" name="testSuite">
          .
        </Tab>
        <Tab title="Solutions" name="solutions">
          .
        </Tab>
        <Tab title="Discussion" name="discussion">
          .
        </Tab>
      </Tabs>
    </div>
  );
};

export const ChallengeLoader = styled(_ChallengeLoader)`
  display: block;
`;
