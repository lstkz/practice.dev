import React from 'react';
import * as Rx from 'rxjs';
import { createModule } from 'typeless';
import { LandingSymbol } from '../../../symbols';
import { css } from 'emotion';
import { Container } from '../../../components/Container';
import { Card } from '../../../components/Card';
import { Col, Row } from '../../../components/Grid';
import { TopBanner } from './TopBanner';
import { Button } from '../../../components/Button';
import styled from 'styled-components';
import { ReadyToCode } from './ReadyToCode';
import { Footer } from '../../../components/Footer';
import { WhatsPracticeDev } from './WhatsPracticeDev';

export const [handle, LandingActions] = createModule(LandingSymbol).withActions(
  {
    $mounted: null,
  }
);

handle.epic().on(LandingActions.$mounted, () => {
  return Rx.empty();
});

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  ${Button} + ${Button} {
    margin-left: 10px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 400;
  color: #3c4858;
`;
const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export function LandingView() {
  return (
    <>
      <Container>
        <Nav>
          <Brand>Practice.dev</Brand>
          <Buttons>
            <Button size="small" type="secondary" href="/login">
              Log in
            </Button>
            <Button size="small" type="primary">
              Join Now
            </Button>
          </Buttons>
        </Nav>
      </Container>
      <TopBanner />
      <WhatsPracticeDev />
      <ReadyToCode />
      <Footer />
    </>
  );
}
