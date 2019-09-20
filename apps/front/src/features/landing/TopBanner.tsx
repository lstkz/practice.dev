import React from 'react';
import styled from 'styled-components';
import { Row, Col } from '../../components/Grid';
import { Card } from '../../components/Card';
import { Theme } from '../../common/Theme';
import { Container } from '../../components/Container';
import Typed from 'typed.js';
import { Button } from '../../components/Button';

interface TopBannerProps {
  className?: string;
}

const BgWrapper = styled.div`
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
`;

const BgImg = styled.img`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
`;

const Title = styled.h2`
  padding: 4.5rem 3rem;
  font-weight: 600;
  color: #3c4858;
  font-size: calc(1.375rem + 1.5vw);
  line-height: 1.5;
  margin: 0;
  padding: 0;
`;

const Desc = styled.p`
  line-height: 1.8;
  font-size: 1.25rem;
  font-weight: 300;
`;

const CardInner = styled.div`
  padding: 4.5rem 3rem;
`;
const Animated = styled.span`
  display: inline-block;
  span:first-child {
    color: ${Theme.warning};
  }
  width: 200px;
`;

const _TopBanner = (props: TopBannerProps) => {
  const { className } = props;

  React.useLayoutEffect(() => {
    var typed = new Typed('#typed-text', {
      strings: ['frontend', 'backend', 'full-stack'],
      typeSpeed: 70,
      backSpeed: 30,
      loop: true,
    });
  }, []);

  return (
    <div className={className}>
      <BgWrapper>
        <BgImg src={require('../../../assets/bg.jpg')} />
      </BgWrapper>

      <Container>
        <Row>
          <Col lg={7} style={{ marginLeft: 'auto' }}>
            <Card shadow="lg">
              <CardInner>
                <Title>
                  Boost your{' '}
                  <Animated>
                    <span id="typed-text"></span>
                  </Animated>{' '}
                  <br />
                  skills.
                </Title>
                <Desc>
                  Solve real web development challenges using your favorite
                  language and technology, and learn by doing.
                </Desc>
                <Button type="warning" hoverTranslateY>
                  Join Now
                </Button>
              </CardInner>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export const TopBanner = styled(_TopBanner)`
  position: relative;
  margin-top: 50px;
  padding: 7rem 5rem;
`;
