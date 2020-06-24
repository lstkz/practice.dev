import React from 'react';
import { Dashboard } from '../components/Dashboard';

export function HomePage() {
  return (
    <Dashboard>
      <div className="home-page">
        <span className="home-page__placeholder" data-test="placeholder">
          home page placeholder
        </span>
      </div>
    </Dashboard>
  );
}
