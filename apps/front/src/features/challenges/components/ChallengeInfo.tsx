import React from 'react';
import { Button } from 'ui';
import { Challenge } from 'shared';
import { UserIcon } from 'src/icons/UserIcon';
import { FileIcon } from 'src/icons/FileIcon';
import { createUrl } from 'src/common/url';
import { SolvedTag } from 'src/components/SolvedTag';
import { ChallengeTags } from 'src/components/ChallengeTags';
import { Title } from 'src/components/Title';
import { IconCounter } from 'src/components/IconCounter';
import { MediaCard } from 'src/components/MediaCard';
import { DomainIcon } from 'src/components/DomainIcon';

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
        <>
          <IconCounter
            icon={<FileIcon />}
            count={challenge.stats.submissions}
            tooltip="Total Submissions"
            testId="submissions"
          />
          <IconCounter
            icon={<UserIcon />}
            count={challenge.stats.solved}
            tooltip="User Solved"
            testId="solved"
          />
        </>
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
