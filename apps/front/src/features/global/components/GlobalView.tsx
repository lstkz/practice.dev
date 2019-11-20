import React from 'react';
import { useGlobalModule } from '../module';

export function GlobalView() {
  useGlobalModule();

  return <div>Feature global</div>;
};
