import * as React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Col, Row } from '../../components/Grid';
import { Box } from './Box';
import { CodeIcon } from '../../components/Icons/CodeIcon';
import { TargetIcon } from '../../components/Icons/TargetIcon';
import { ChatIcon } from '../../components/Icons/ChatIcon';
import { StrengthIcon } from '../../components/Icons/StrengthIcon';

interface WhatsPracticeDevProps {
  className?: string;
}

const Border = styled.div`
  border-top: 1px solid #eff2f7;
  border-bottom: 1px solid #eff2f7;

  ${Row} + ${Row} {
    border-top: 1px solid #eff2f7;
  }
`;

const ColSep = styled(Col)`
  border-left: 1px solid #eff2f7;
`;

const _WhatsPracticeDev = (props: WhatsPracticeDevProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <h1>What is Practice.dev?</h1>
      <Border>
        <Container>
          <Row>
            <Col lg={5}>
              <Box
                title="100+ Challenges"
                text="We've prepared many challenges that reflect problems from real projects. You can solve them with any languages, technology or library."
                icon={<CodeIcon />}
              />
            </Col>
            <Col lg={1}></Col>
            <ColSep lg={1}></ColSep>
            <Col lg={5}>
              <Box
                title="Automatic testing"
                text="Your solution will be verified automatically by our testing engine. You only have to provide the URL to your application. You can submit unlimited number of times."
                icon={<TargetIcon />}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              <Box
                title="Not only for beginners"
                text="Are you an experience developer and want to try a new shiny framework? Practice.dev is a perfect place for you."
                icon={<StrengthIcon />}
              />
            </Col>
            <Col lg={1}></Col>
            <ColSep lg={1}></ColSep>
            <Col lg={5}>
              <Box
                title="Open Source"
                text="We love open-source! All challenges are open-sourced. If you have an idea for a challenge or found a bug, feel free to submit a pull request."
                icon={<ChatIcon />}
              />
            </Col>
          </Row>
        </Container>
      </Border>
    </div>
  );
};

export const WhatsPracticeDev = styled(_WhatsPracticeDev)`
  display: block;
  margin-top: 40px;

  h1 {
    font-size: 2.5rem;
    font-weight: 400;
    line-height: 1.5;
    color: #3c4858;
    text-align: center;
  }
`;
