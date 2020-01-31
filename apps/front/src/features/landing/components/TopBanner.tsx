import * as React from 'react';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Theme } from 'src/common/Theme';
import { createUrl } from 'src/common/url';
import { Button } from 'ui';
import { BannerSvg } from './BannerSvg';
import Typed from 'typed.js';
import { Logo } from 'src/components/Logo';

interface TopBannerProps {
  className?: string;
}

const TopNav = styled.div`
  display: flex;
  margin-bottom: 60px;
`;

const Buttons = styled.div`
  display: flex;
  margin-left: auto;
  ${Button} + ${Button} {
    margin-left: 20px;
  }
`;

const Main = styled.div`
  display: flex;
`;
const Left = styled.div``;
const Right = styled.div`
  padding-left: 60px;
`;

const Title = styled.h1`
  font-size: 34px;
  color: ${Theme.textDark};
  font-weight: 500;
  margin: 0;
  line-height: 1.3;
`;

const Animated = styled.span`
  display: inline-block;
  white-space: nowrap;
  span:first-child {
    color: ${Theme.green};
  }
  width: 200px;
`;

const Desc = styled.div`
  margin-top: 25px;
  margin-bottom: 30px;
  font-size: 22px;
  color: ${Theme.textDark};
`;

const BannerButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const FreeText = styled.div`
  color: ${Theme.green};
  font-size: 16px;
  margin-left: 20px;
`;

const _TopBanner = (props: TopBannerProps) => {
  const { className } = props;

  React.useLayoutEffect(() => {
    new Typed('#typed-text', {
      strings: ['frontend', 'backend', 'full-stack'],
      typeSpeed: 70,
      backSpeed: 30,
      loop: true,
    });
  }, []);

  return (
    <div className={className}>
      <Container>
        <TopNav>
          <div>
            <Logo type="dark" />
          </div>
          <Buttons>
            <Button type="secondary" href={createUrl({ name: 'login' })}>
              LOGIN
            </Button>
            <Button type="primary" href={createUrl({ name: 'register' })}>
              JOIN NOW
            </Button>
          </Buttons>
        </TopNav>
        <Main>
          <Left>
            <BannerSvg />
          </Left>
          <Right>
            <Title>
              Boost your{' '}
              <Animated>
                <span id="typed-text"></span>
              </Animated>{' '}
              <br />
              skills.
            </Title>
            <Desc>
              Solve real web development challenges using favorite language and
              technology, and learn by doing.
            </Desc>
            <BannerButtonWrapper>
              <Button type="primary" href={createUrl({ name: 'register' })}>
                JOIN NOW
              </Button>
              <FreeText>It’s free!</FreeText>
            </BannerButtonWrapper>
          </Right>
        </Main>
      </Container>
    </div>
  );
};

export const TopBanner = styled(_TopBanner)`
  display: block;
  padding: 30px 0;
  background: ${Theme.bgLightGray};
`;
