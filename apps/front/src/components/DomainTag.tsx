import React from 'react';
import { ChallengeDomain } from 'shared';
import { Tag } from './Tag';

interface DomainTagProps {
  domain: ChallengeDomain;
  onClick?: () => void;
  url?: string;
  testId?: string;
}

export function DomainTag(props: DomainTagProps) {
  const { testId, domain, onClick, url } = props;

  return (
    <Tag testId={testId} type={domain} onClick={onClick} url={url}>
      {domain}
    </Tag>
  );
}
