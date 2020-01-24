import * as React from 'react';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Theme } from 'src/common/Theme';
import { HowItWorksSvg } from './HowItWorksSvg';
import { LineSvg } from './LineSvg';
import { Step } from './Step';
import { PickIcon } from 'src/icons/PickIcon';

interface HowItWorksProps {
  className?: string;
}

const Title = styled.h2`
  font-size: 24px;
  color: ${Theme.textDark};
  font-weight: normal;
  text-align: center;
`;

const Left = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LineBg = styled.div`
  svg {
    width: 200px;
  }
`;

const Right = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
`;

const StepsWrapper = styled.div`
  width: 400px;
`;

const _HowItWorks = (props: HowItWorksProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Container>
        <Title>How it works</Title>
        <Content>
          <Left>
            <LineBg>
              <LineSvg />
            </LineBg>
            <StepsWrapper>
              <Step nr={1} icon={<PickIcon />}>
                Pick a Challenge
              </Step>
            </StepsWrapper>
          </Left>
          <Right>
            <HowItWorksSvg />
          </Right>
        </Content>
      </Container>
    </div>
  );
};

export const HowItWorks = styled(_HowItWorks)`
  display: block;
  background: ${Theme.bgLightGray3};
  padding: 70px 0;
`;
