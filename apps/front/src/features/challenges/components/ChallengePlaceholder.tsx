import React from 'react';
import ContentLoader from 'react-content-loader';
import { ChallengeCard } from './ChallengeCard';

export const ChallengePlaceholder = () => (
  <ChallengeCard block>
    <ContentLoader
      height={110}
      width={800}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="30" height="30" />
      <rect x="55" y="0" rx="0" ry="0" width="150" height="20" />
      <rect x="55" y="45" rx="0" ry="0" width="350" height="20" />
      <rect x="55" y="90" rx="0" ry="0" width="50" height="20" />
      <rect x="120" y="90" rx="0" ry="0" width="60" height="20" />
    </ContentLoader>
  </ChallengeCard>
);
