import * as React from 'react';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Theme } from 'src/common/Theme';
import { HowItWorksSvg } from './HowItWorksSvg';
import { LineSvg } from './LineSvg';
import { Step } from './Step';
import { PickIcon } from 'src/icons/PickIcon';
import { SpecIcon } from 'src/icons/SpecIcon';
import { UrlIcon } from 'src/icons/UrlIcon';
import { WaitIcon } from 'src/icons/WaitIcon';
import { SolveIcon } from 'src/icons/SolveIcon';
import { SuccessIcon } from 'src/icons/SuccessIcon';
import { ErrorIcon } from 'src/icons/ErrorIcon';
import { Colored } from 'src/components/Colored';

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
  width: 50%;
`;

const LineBg = styled.div`
  position: absolute;
  left: 65px;
  top: 65px;
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
  margin: 0 auto;
  position: relative;
`;

const _HowItWorks = (props: HowItWorksProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Container>
        <Title>How it works</Title>
        <Content>
          <Left>
            <StepsWrapper>
              <LineBg>
                <LineSvg />
              </LineBg>
              <Step nr={1} icon={<PickIcon />}>
                Pick a Challenge
              </Step>
              <Step nr={2} icon={<SpecIcon />}>
                Read the requirements
              </Step>
              <Step nr={3} icon={<SolveIcon />}>
                Solve it
              </Step>
              <Step nr={4} icon={<UrlIcon />}>
                Provide the URL <br /> of your application
              </Step>
              <Step nr={5} icon={<WaitIcon />}>
                Wait for the testing results.
                <br /> It will take less than 10s.
              </Step>
              <Step nr={6} icon={<SuccessIcon />}>
                <Colored color="green">Success?</Colored> Congrats!
                <br />
                Try to solve the next challenge
              </Step>
              <Step nr={7} icon={<ErrorIcon />}>
                <Colored color="red">Failure?</Colored> Debug the errors, and
                try again
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
