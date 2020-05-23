import React from 'react';
import { Button } from 'ui';
import { Challenge } from 'shared';
import { createUrl } from 'src/common/url';
import { SolvedTag } from 'src/components/SolvedTag';
import { ChallengeTags } from 'src/components/ChallengeTags';
import { Title } from 'src/components/Title';
import { MediaCard } from 'src/components/MediaCard';
import { DomainIcon } from 'src/components/DomainIcon';
import { SubmissionStats } from 'src/components/SubmissionStats';

interface ChallengeInfoProps {
  challenge: Challenge;
}

export function ChallengeInfo(props: ChallengeInfoProps) {
  const { challenge } = props;

  return (
    <MediaCard
      testId={`challenge_${challenge.id}`}
      icon={<DomainIcon domain={challenge.domain} />}
      title={
        <>
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
        </>
      }
      description={challenge.description}
      tags={<ChallengeTags challenge={challenge} />}
      stats={
        <SubmissionStats
          submissions={challenge.stats.submissions}
          solved={challenge.stats.solved}
        />
      }
      button={
        <Button
          testId="solve-btn"
          type="primary"
          href={createUrl({ name: 'challenge', id: challenge.id })}
        >
          SOLVE
        </Button>
      }
    />
  );
}
