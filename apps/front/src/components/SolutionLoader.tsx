import * as React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import { Theme } from 'ui';

interface SolutionLoaderProps {
  className?: string;
}

const _SolutionLoader = (props: SolutionLoaderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <ContentLoader
        speed={2}
        width={700}
        height={200}
        viewBox="0 0 700 200"
        primaryColor={Theme.loaderPrimary}
        secondaryColor={Theme.loaderSecondary}
      >
        <rect x="0" y="0" rx="5" ry="5" width="250" height="25" />
        <rect x="0" y="90" rx="5" ry="5" width="356" height="15" />
        <rect x="673" y="0" rx="5" ry="5" width="44" height="25" />
        <rect x="626" y="35" rx="5" ry="5" width="75" height="25" />
        <rect x="0" y="36" rx="5" ry="5" width="80" height="25" />
        <rect x="0" y="110" rx="5" ry="5" width="217" height="15" />
        <rect x="0" y="130" rx="5" ry="5" width="263" height="15" />
        <rect x="0" y="170" rx="5" ry="5" width="50" height="25" />
        <rect x="60" y="170" rx="5" ry="5" width="50" height="25" />
      </ContentLoader>
    </div>
  );
};

export const SolutionLoader = styled(_SolutionLoader)`
  padding-bottom: 35px;
  border-bottom: 1px solid ${Theme.bgLightGray8};
  margin-top: 35px;
  &:first-child {
    margin-top: 0;
  }
`;
