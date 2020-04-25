import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { Theme } from 'ui';
import styled from 'styled-components';

export function ProfileInfoLoader() {
  return (
    <ContentLoader
      speed={2}
      width={300}
      height={500}
      viewBox="0 0 300 500"
      primaryColor={Theme.loaderPrimary}
      secondaryColor={Theme.loaderSecondary}
    >
      <rect x="673" y="0" rx="0" ry="0" width="44" height="25" />
      <rect x="626" y="35" rx="0" ry="0" width="75" height="25" />
      <circle cx="150" cy="100" r="70" />
      <rect x="60" y="190" rx="0" ry="0" width="180" height="32" />
      <rect x="115" y="234" rx="0" ry="0" width="70" height="17" />
    </ContentLoader>
  );
}

interface ProfileContentLoaderProps {
  className?: string;
}

const _ProfileContentLoader = (props: ProfileContentLoaderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <ContentLoader
        speed={2}
        width={400}
        height={475}
        viewBox="0 0 400 475"
        primaryColor={Theme.loaderPrimary}
        secondaryColor={Theme.loaderSecondary}
      >
        <rect x="0" y="10" rx="2" ry="2" width="350" height="20" />
        <rect x="0" y="45" rx="2" ry="2" width="250" height="20" />
        <rect x="0" y="80" rx="2" ry="2" width="300" height="20" />
        <rect x="0" y="115" rx="2" ry="2" width="350" height="20" />
        <rect x="0" y="150" rx="2" ry="2" width="300" height="20" />
      </ContentLoader>
    </div>
  );
};

export const ProfileContentLoader = styled(_ProfileContentLoader)`
  display: block;
  width: 400px;
  height: 475px;
  padding: 0 30px;
`;
