import * as React from 'react';
import styled from 'styled-components';
import { Container } from '../../../components/Container';
import { Button } from '../../../components/Button';

interface ReadyToCodeProps {
  className?: string;
}

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease;
  opacity: 0.7;
  background: linear-gradient(50deg, #0c66ff 0, #0c1dff 100%) !important;
`;

const _ReadyToCode = (props: ReadyToCodeProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Mask />
      <Container>
        <h2>Ready to code?</h2>
        <Button type="warning">Start Coding</Button>
      </Container>
    </div>
  );
};

export const ReadyToCode = styled(_ReadyToCode)`
  position: relative;
  display: block;
  background: no-repeat center center/cover;
  background-image: url(${require('../../../../assets/ready-to-code-bg.jpg')});
  padding: 10.5rem 0;

  h2 {
    font-size: 3rem;
    font-weight: 400;
    line-height: 1.3;
    color: white;
  }

  ${Container} {
    position: relative;
    text-align: center;
  }
`;
