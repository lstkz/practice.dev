import * as React from 'react';
import styled from 'styled-components';
import { Theme } from '../common/Theme';
import { Logo } from './Logo';

interface AuthFormProps {
  className?: string;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  bottom?: React.ReactNode;
}

const Card = styled.div`
  border: 1px solid ${Theme.grayLight};
  border-radius: 5px;
  background: white;
  padding: 20px 55px 30px;
`;

const Wrapper = styled.div`
  width: 460px;
  margin: 0 auto;
  padding-top: 110px;
  ${Card} {
    margin: 0;
  }
  ${Logo} {
    margin-bottom: 30px;
    font-size: 0;
    svg {
      width: 200px;
      height: auto;
    }
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Top = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SubTitle = styled.div`
  margin-top: 10px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  color: ${Theme.textDark};
`;

const Bottom = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export function FullPageForm(props: AuthFormProps) {
  const { title, subTitle, children, bottom } = props;
  return (
    <Wrapper>
      <Logo type="dark" />
      <Card>
        <Top>
          <Title>{title}</Title>
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </Top>
        {children}
        {bottom && <Bottom>{bottom}</Bottom>}
      </Card>
    </Wrapper>
  );
}
