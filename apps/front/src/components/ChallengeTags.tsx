import * as React from 'react';
import { Challenge } from 'shared';
import { DomainTag } from './DomainTag';
import { createFullChallengesUrl } from 'src/common/url';
import { Tag } from './Tag';

interface ChallengeTagsProps {
  className?: string;
  challenge: Challenge;
}

export function ChallengeTags(props: ChallengeTagsProps) {
  const { challenge } = props;
  return (
    <>
      <DomainTag
        domain={challenge.domain}
        url={createFullChallengesUrl({
          domains: [challenge.domain],
        })}
      />
      <Tag
        type="difficulty"
        url={createFullChallengesUrl({
          difficulties: [challenge.difficulty],
        })}
      >
        {challenge.difficulty}
      </Tag>
      {challenge.tags.map((tag, i) => (
        <Tag
          key={i}
          type="custom"
          url={createFullChallengesUrl({
            tags: [tag],
          })}
        >
          {tag}
        </Tag>
      ))}
    </>
  );
}
