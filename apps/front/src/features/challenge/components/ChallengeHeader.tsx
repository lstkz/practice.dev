import * as React from 'react';
import styled from 'styled-components';
import { FrontendIcon } from 'src/icons/FrontendIcon';
import { Theme } from 'src/common/Theme';
import { Tag } from 'src/components/Tag';
import { getChallengeState } from '../interface';
import { DomainTag } from 'src/components/DomainTag';
import { Button } from 'ui';
import { useActions } from 'typeless';
import { SubmitActions, getSubmitState } from 'src/features/submit/interface';
import { SolutionActions } from 'src/features/solution/interface';

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
        <Title>{challenge.title}</Title>
        <Tags>
          <DomainTag domain={challenge.domain} />
          <Tag type="difficulty">{challenge.difficulty}</Tag>
          {challenge.tags.map((tag, i) => (
            <Tag key={i} type="custom">
              {tag}
            </Tag>
          ))}
        </Tags>
      </Col2>
      <Col3 double={challenge.isSolved}>
        <Buttons>
          <Button
            block
            type={challenge.isSolved ? 'secondary' : 'primary'}
            onClick={showSubmit}
            disabled={status === 'testing'}
          >
            SUBMIT
          </Button>
          {challenge.isSolved && (
            <Button block type="primary" onClick={showSolution}>
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
