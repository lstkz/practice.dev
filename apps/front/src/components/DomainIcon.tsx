import React from 'react';
import { ChallengeDomain } from 'shared';
import { BackendIcon } from 'src/icons/BackendIcon';
import { FrontendIcon } from 'src/icons/FrontendIcon';
import { FullstackIcon } from 'src/icons/FullstackIcon';

interface DomainIconProps {
  domain: ChallengeDomain;
}

export function DomainIcon(props: DomainIconProps) {
  switch (props.domain) {
    case 'frontend':
      return <FrontendIcon />;
    case 'backend':
      return <BackendIcon />;
    case 'fullstack':
      return <FullstackIcon />;
  }
  return null;
}
