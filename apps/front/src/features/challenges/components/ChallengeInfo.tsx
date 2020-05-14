import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Button } from 'ui';
import { Challenge } from 'shared';
import { Theme } from 'src/common/Theme';
import { FrontendIcon } from 'src/icons/FrontendIcon';
import { UserIcon } from 'src/icons/UserIcon';
import { FileIcon } from 'src/icons/FileIcon';
import { createUrl } from 'src/common/url';
import { Tag } from 'src/components/Tag';
import { ChallengeCard } from './ChallengeCard';
import { BackendIcon } from 'src/icons/BackendIcon';
import { SolvedTag } from 'src/components/SolvedTag';
import { ChallengeTags } from 'src/components/ChallengeTags';
import { Title } from 'src/components/Title';

const Top = styled.div`
  display: flex;
  align-items: center;
  a {
    color: ${Theme.textDark};
  }
  ${SolvedTag} {
    margin-right: 10px;
  }
`;

const Col1 = styled.div`
  width: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const Col2 = styled.div`
  flex-grow: 1;
  padding-left: 25px;
  padding-right: 30px;
`;

const Col3 = styled.div`
  width: 280px;
  height: 40px;
  flex-shrink: 0;
  display: flex;

  ${Button} {
    margin-left: auto;
    margin-right: 0;
  }
`;

const IconCounter = styled.div`
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  color: ${Theme.textDark};
  font-weight: 500;
  svg {
    margin-right: 5px;
  }
`;

const Tags = styled.div`
  ${Tag} + ${Tag} {
    margin-left: 10px;
  } 
`;

const Desc = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
`;

interface ChallengeInfoProps {
  challenge: Challenge;
}

export function ChallengeInfo(props: ChallengeInfoProps) {
  const { challenge } = props;
  return (
    <ChallengeCard data-test={`challenge_${challenge.id}`}>
      <Col1>
        {challenge.domain === 'frontend' ? (
          <FrontendIcon />
        ) : challenge.domain === 'backend' ? (
          <BackendIcon />
        ) : null}
      </Col1>
      <Col2>
        <Top>
          {challenge.isSolved && <SolvedTag />}
          <Title
            href={createUrl({
              name: 'challenge',
              id: challenge.id,
            })}
            testId="title"
          >
            {challenge.title}
          </Title>
        </Top>
        <Desc data-test="desc">{challenge.description}</Desc>
        <Tags>
          <ChallengeTags challenge={challenge} />
        </Tags>
      </Col2>
      <Col3>
        <IconCounter data-tip="Total Submissions" data-test="submissions">
          <FileIcon /> {challenge.stats.submissions}
        </IconCounter>
        <ReactTooltip place="top" type="dark" effect="solid" />
        <IconCounter data-tip="User Solved" data-test="solved">
          <UserIcon /> {challenge.stats.solved}
        </IconCounter>
        <ReactTooltip place="top" type="dark" effect="solid" />
        <Button
          testId="solve-btn"
          type="primary"
          href={createUrl({ name: 'challenge', id: challenge.id })}
        >
          SOLVE
        </Button>
      </Col3>
    </ChallengeCard>
  );
}
