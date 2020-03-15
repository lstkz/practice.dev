import React from 'react';
import { ChallengeDomain } from 'shared';
import { Tag } from './Tag';

interface DomainTagProps {
  domain: ChallengeDomain;
  onClick?: () => void;
  url?: string;
}

export function DomainTag(props: DomainTagProps) {
  const { domain, onClick, url } = props;

  return (
    <Tag type={domain} onClick={onClick} url={url}>
      {domain}
    </Tag>
  );
}
