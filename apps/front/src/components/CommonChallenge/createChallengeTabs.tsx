import React from 'react';
import { Tab } from '../Tabs';
import { TabContent } from './TabContent';
import { TestSuite } from './TestSuite';
import { MyRecentSubmissions } from './MyRecentSubmissions';
import { TestInfo, Submission } from 'shared';
import { ApiSpecTab } from './ApiSpecTab';
import { DiscussionTab } from './Discussion/DiscussionTab';
import { TargetChallengeValues } from 'src/types';

export function createDetailsTab(
  component: React.ReactNode,
  right: React.ReactNode
) {
  return (
    <Tab testId="details-tab" title="Details" name="details">
      <TabContent testId="challenge-details" left={component} right={right} />
    </Tab>
  );
}

export function createSwaggerTab(
  assets?: Record<string, string> | null | undefined
) {
  return assets?.swagger ? (
    <Tab title="API Spec" name="apiSpec">
      <ApiSpecTab swaggerKey={assets.swagger} />
    </Tab>
  ) : null;
}

export function createTestSuiteTab(
  testCase: TestInfo[],
  recentSubmissions?: Submission[]
) {
  return (
    <Tab title="Test Suite" name="testSuite">
      <div style={{ padding: 40 }}>
        <TestSuite testCase={testCase} />
      </div>
      {/* <TabContent
        left={<TestSuite testCase={testCase} />}
        right={<div />}
        // right={<MyRecentSubmissions recentSubmissions={recentSubmissions} />}
      /> */}
    </Tab>
  );
}

export function createDiscussionTab(target: TargetChallengeValues) {
  return (
    <Tab testId="discussion-tab" title="Discussion" name="discussion">
      <DiscussionTab target={target} />
    </Tab>
  );
}
