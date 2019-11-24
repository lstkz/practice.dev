import React from 'react';
import { useChallengesModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';

export function ChallengesView() {
  useChallengesModule();

  return (
    <Dashboard>
      <div>Feature challenges</div>
    </Dashboard>
  );
}
