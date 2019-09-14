import React from 'react';
import * as Rx from 'rxjs';
import { createModule } from 'typeless';
import { LandingSymbol } from '../../symbols';
import { css } from 'emotion';
import { Container } from '../../components/Container';
import { Card } from '../../components/Card';
import { Col, Row } from '../../components/Grid';

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
    <div
      className={css`
        position: relative;
        margin-top: 50px;
      `}
    >
      <div
        className={css`
          position: absolute;
          z-index: -2;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          max-width: 75%;
          border-radius: 0px 5rem 5rem 0px;
          background-color: #0c66ff;
          overflow: hidden;
        `}
      >
        <img
          className={css`
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            mix-blend-mode: multiply;
          `}
          src={require('../../../assets/bg.jpg')}
        />
      </div>
      <Container>
        <Row>
          <Col lg={7}>
            <Card>
              <div
                className={css`
                  padding: 4.5rem 3rem;
                `}
              >
                <h2
                  className={css`
                    padding: 4.5rem 3rem;
                    font-weight: 600;
                    color: #3c4858;
                    font-size: calc(1.375rem + 1.5vw);
                  `}
                >
                  Digital experiences crafted with{' '}
                </h2>
                <p
                  className={css`
                    line-height: 1.8 !important;
                    font-size: 1.25rem;
                    font-weight: 300;
                  `}
                >
                  With we have optimized the customization process to save your
                  team time when building websites.
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      Landing
    </div>
  );
}
