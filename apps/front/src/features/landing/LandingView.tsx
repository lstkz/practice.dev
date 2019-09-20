import React from 'react';
import * as Rx from 'rxjs';
import { createModule } from 'typeless';
import { LandingSymbol } from '../../symbols';
import { css } from 'emotion';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Col, Row } from '../../components/Grid';
import { TopBanner } from './TopBanner';

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
    <div>
      <TopBanner />
    </div>
  );
}
