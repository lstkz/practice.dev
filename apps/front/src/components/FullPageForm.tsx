import * as React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { Theme } from '../common/Theme';

interface AuthFormProps {
  className?: string;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  bottom?: React.ReactNode;
}

const CardInner = styled.div`
  padding: 46px;
`;

const CardContainer = styled.div`
  width: 500px;
  margin: auto;
  ${Card} {
    margin: 0;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Top = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const SubTitle = styled.div`
  color: #8492a6;
`;

const Title = styled.h3`
  font-size: calc(1.3rem + 0.6vw);
  margin: 0;
`;

const Bottom = styled.div`
  margin-top: 24px;
  text-align: center;
`;

const Bg = styled.div`
  border-radius: 0 80px 80px 0;
  position: absolute;
  z-index: -2;
  top: 0;
  width: 50%;
  height: 100%;
  background: ${Theme.bgPrimary};
  overflow: hidden;

  img {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }
`;

export function FullPageForm(props: AuthFormProps) {
  const { title, subTitle, children, bottom } = props;
  return (
    <>
      <Bg>
        <img src={require('../../assets/login-bg.jpg')} />
      </Bg>
      <CardContainer>
        <Card>
          <CardInner>
            <Top>
              <Title>{title}</Title>
              {subTitle && <SubTitle>{subTitle}</SubTitle>}
            </Top>
            {children}
            {bottom && (
              <Bottom>
                <small>{bottom}</small>
              </Bottom>
            )}
          </CardInner>
        </Card>
      </CardContainer>
    </>
  );
}
