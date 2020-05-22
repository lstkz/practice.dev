import React from 'react';
import { ProjectDomain, ChallengeDomain } from 'shared';
import { BackendIcon } from 'src/icons/BackendIcon';
import { FrontendIcon } from 'src/icons/FrontendIcon';

interface DomainIconProps {
  domain: ProjectDomain | ChallengeDomain;
}

export function DomainIcon(props: DomainIconProps) {
  switch (props.domain) {
    case 'frontend':
      return <FrontendIcon />;
    case 'backend':
      return <BackendIcon />;
  }
  return null;
}
