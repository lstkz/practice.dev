import React from 'react';
import { ChallengeDomain } from 'shared';
import { Tag } from './Tag';

interface DomainTagProps {
  domain: ChallengeDomain;
  onClick?: () => void;
}

export function DomainTag(props: DomainTagProps) {
  const { domain, onClick } = props;

  return (
    <Tag type={domain} onClick={onClick}>
      {domain}
    </Tag>
  );
}
