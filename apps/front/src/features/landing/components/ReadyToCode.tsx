import * as React from 'react';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Theme } from 'src/common/Theme';
import { Button } from 'src/components/Button';
import { ReadyToCodeSvg } from './ReadyToCodeSvg';

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
          <ReadyToCodeSvg />
          <Button type="primary">START CODING</Button>
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
`;
