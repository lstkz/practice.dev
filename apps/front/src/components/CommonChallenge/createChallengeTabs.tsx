import React from 'react';
import { Tab } from '../Tabs';
import { TabContent } from './TabContent';
import { TestSuite } from './TestSuite';
import { MyRecentSubmissions } from './MyRecentSubmissions';
import { TestInfo, Submission } from 'shared';
import { ApiSpecTab } from './ApiSpecTab';

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
  recentSubmissions: Submission[]
) {
  return (
    <Tab title="Test Suite" name="testSuite">
      <TabContent
        left={<TestSuite testCase={testCase} />}
        right={<MyRecentSubmissions recentSubmissions={recentSubmissions} />}
      />
    </Tab>
  );
}
