import * as React from 'react';
import styled from 'styled-components';
import { FrontendIcon } from 'src/icons/FrontendIcon';
import { Theme } from 'src/common/Theme';
import { Tag } from 'src/components/Tag';
import { getChallengeState } from '../interface';
import { Button } from 'ui';
import { useActions } from 'typeless';
import { SubmitActions, getSubmitState } from 'src/features/submit/interface';
import { SolutionActions } from 'src/features/solution/interface';
import { ChallengeTags } from 'src/components/ChallengeTags';

interface ChallengeHeaderProps {
  className?: string;
}

const Col1 = styled.div`
  width: 30px;
  flex-shrink: 0;
  padding-top: 5px;
`;
const Col2 = styled.div`
  flex-grow: 1;
  margin-left: 25px;
`;
const Col3 = styled.div<{ double?: boolean }>`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  padding-top: ${props => (props.double ? 20 : 40)}px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin: 0;
  color: ${Theme.textDark};
  margin-right: 10px;
`;

const Tags = styled.div`
  margin-top: 14px;
  ${Tag} + ${Tag} {
    margin-left: 10px;
  } 
`;

const Buttons = styled.div`
  width: 100%;
  ${Button} + ${Button} {
    margin-top: 10px;
  }
`;

const _ChallengeHeader = (props: ChallengeHeaderProps) => {
  const { challenge } = getChallengeState.useState();
  const { status } = getSubmitState.useState();
  const { show: showSubmit } = useActions(SubmitActions);
  const { show: showSolution } = useActions(SolutionActions);
  const { className } = props;
  return (
    <div className={className}>
      <Col1>
        <FrontendIcon />
      </Col1>
      <Col2>
        <Title data-test="challenge-title">{challenge.title}</Title>
        <Tags>
          <ChallengeTags challenge={challenge} />
        </Tags>
      </Col2>
      <Col3 double={challenge.isSolved}>
        <Buttons>
          <Button
            testId="submit-btn"
            block
            type={challenge.isSolved ? 'secondary' : 'primary'}
            onClick={showSubmit}
            disabled={status === 'testing'}
          >
            SUBMIT
          </Button>
          {challenge.isSolved && (
            <Button
              testId="create-solution-btn"
              block
              type="primary"
              onClick={() => showSolution('edit', null)}
            >
              CREATE SOLUTION
            </Button>
          )}
        </Buttons>
      </Col3>
    </div>
  );
};

export const ChallengeHeader = styled(_ChallengeHeader)`
  width: 100%;
  display: flex;
  padding: 20px 30px 17px 25px;
`;
