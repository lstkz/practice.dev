import * as React from 'react';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Theme } from 'src/common/Theme';
import { Button, MOBILE } from 'ui';
import { ReadyToCodeSvg } from './ReadyToCodeSvg';
import { createUrl } from 'src/common/url';
import { SvgMobileWrapper } from './SvgMobileWrapper';

interface ReadyToCodeProps {
  className?: string;
}

const Inner = styled.div`
  height: 150px;
  border-radius: 10px;
  background: ${Theme.lightBlue};
  padding: 0 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  ${MOBILE} {
    height: auto;
    flex-direction: column;
    padding: 30px 15px;
  }
`;

const Text = styled.div`
  font-size: 24px;
  color: ${Theme.textDark};
`;

const _ReadyToCode = (props: ReadyToCodeProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Container>
        <Inner>
          <Text>Ready to code?</Text>
          <SvgMobileWrapper>
            <ReadyToCodeSvg />
          </SvgMobileWrapper>
          <Button
            testId="start-coding-register-btn"
            type="primary"
            href={createUrl({ name: 'register' })}
          >
            START CODING
          </Button>
        </Inner>
      </Container>
    </div>
  );
};

export const ReadyToCode = styled(_ReadyToCode)`
  display: block;
  background: white;
  padding: 190px 0;
  svg {
    position: absolute;
    left: 50%;
    top: -50px;
    transform: translateX(-50%);
  }
  ${MOBILE} {
    padding: 40px 30px;
    svg {
      position: static;
      transform: none;
      margin: 30px 0 40px;
    }
  }
`;
