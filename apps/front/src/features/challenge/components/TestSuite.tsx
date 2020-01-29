import * as React from 'react';
import styled from 'styled-components';
import { getChallengeState } from '../interface';
import { Theme, Spinner } from 'ui';
import { Colored } from 'src/components/Colored';
import { getSubmitState } from 'src/features/submit/interface';
import { TestInfo } from 'shared';

interface TestSuiteProps {
  className?: string;
}

const TestRow = styled.div`
  display: flex;
  color: ${Theme.textDark};
  margin-bottom: 5px;
`;

const TestNumber = styled.div`
  width: 80px;
  font-weight: bold;
  flex-shrink: 0;
`;

const TestContent = styled.div`
  flex-grow: 1;
`;

const TestName = styled.div`
  color: ${Theme.textDark};
  display: flex;
  align-items: center;
  ${Spinner} {
    margin-right: 10px;
  }
`;

const Step = styled.div`
  display: flex;
  color: ${Theme.textLight};
`;

const StepResult = styled.div`
  width: 30px;
`;

const StepError = styled.div`
  display: flex;
`;

function getTestColor(test: TestInfo) {
  switch (test.result) {
    case 'fail':
      return 'red' as const;
    case 'running':
    case 'pending':
    case 'fail-skipped':
      return 'none' as const;
    case 'pass':
      return 'green' as const;
  }
}

const _TestSuite = (props: TestSuiteProps) => {
  const { className } = props;
  const { testCase } = getChallengeState.useState();
  const { tests, status } = getSubmitState.useState();
  const targetTestCase = status === 'none' ? testCase : tests;

  return (
    <div className={className}>
      {targetTestCase.map(test => (
        <TestRow key={test.id}>
          <TestNumber>
            <Colored color={getTestColor(test)}>Test {test.id}:</Colored>
          </TestNumber>
          <TestContent>
            <TestName>
              {test.result === 'running' && <Spinner size="14px" blue />}
              <Colored color={getTestColor(test)}>{test.name}</Colored>
            </TestName>
            {test.steps?.map((step, i) => (
              <React.Fragment key={i}>
                <Step>{step.text}</Step>
              </React.Fragment>
            ))}
            {test.error && (
              <StepError>
                <StepResult>
                  <Colored color="red">✗</Colored>
                </StepResult>
                <Colored color="red">{test.error}</Colored>
              </StepError>
            )}
          </TestContent>
        </TestRow>
      ))}
    </div>
  );
};

export const TestSuite = styled(_TestSuite)`
  display: block;
  font-family: 'Roboto Mono', monospace;
`;