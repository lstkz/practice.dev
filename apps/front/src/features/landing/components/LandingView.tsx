import React from 'react';
import * as Rx from 'rxjs';
import { createModule } from 'typeless';
import { LandingSymbol } from '../../../symbols';
import { TopBanner } from './TopBanner';
import { WhatsPractice } from './WhatsPractice';
import { HowItWorks } from './HowItWorks';

export const [handle, LandingActions] = createModule(LandingSymbol).withActions(
  {
    $mounted: null,
  }
);

handle.epic().on(LandingActions.$mounted, () => {
  return Rx.empty();
});

export function LandingView() {
  return (
    <>
      {/* <TopBanner />
      <WhatsPractice /> */}
      <HowItWorks />
    </>
  );
}
