import * as React from 'react';
import styled from 'styled-components';
import { Container } from 'src/components/Container';
import { Row, Col } from 'src/components/Grid';
import { Box } from './Box';
import { TrophyIcon } from 'src/icons/TrophyIcon';
import { Theme } from 'src/common/Theme';
import { AutomaticTestingIcon } from 'src/icons/AutomaticTestingIcon';
import { OpenSourceIcon } from 'src/icons/OpenSourceIcon';
import { TwoPeopleIcon } from 'src/icons/TwoPeopleIcon';
import { ProjectsIcon } from 'src/icons/ProjectsIcon';
import { SetupIcon } from 'src/icons/SetupIcon';

interface WhatsPracticeProps {
  className?: string;
}

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  color: ${Theme.textDark};
  font-weight: normal;
`;

const _WhatsPractice = (props: WhatsPracticeProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Container>
        <Title>What is Practice.dev?</Title>
        <Row gutter={60}>
          <Col lg={6}>
            <Box icon={<TrophyIcon />} title="Many Challenges">
              We've prepared many challenges that reflect problems from real
              projects. A challenge is a simple task that focuses on a
              particular area. You can solve them with any languages, technology
              or library.
            </Box>
          </Col>
          <Col lg={6}>
            <Box icon={<TwoPeopleIcon />} title="Not Only for Beginners">
              Are you an experienced developer and want to try a new shiny
              framework or compare libraries? Practice.dev is a perfect place
              for you.
            </Box>
          </Col>
        </Row>
        <Row gutter={60}>
          <Col lg={6}>
            <Box icon={<AutomaticTestingIcon />} title="Automatic Testing">
              All your work is verified automatically by our testing engine. You
              can submit an unlimited number of times. There are no fees!
            </Box>
          </Col>
          <Col lg={6}>
            <Box icon={<OpenSourceIcon />} title="Open Source">
              We love open-source! All challenges are open-sourced. If you have
              an idea for a challenge or found a bug, feel free to submit a pull
              request
            </Box>
          </Col>
        </Row>
        <Row gutter={60}>
          <Col lg={6}>
            <Box icon={<ProjectsIcon />} title="Complete Projects">
              Are you looking for app ideas for your portfolio? Try to complete
              a project and create a fully working solution. Projects are much
              more complex than challenges and are split into multiple parts.
            </Box>
          </Col>
          <Col lg={6}>
            <Box icon={<SetupIcon />} title="No Complex Setup">
              No in-browser IDE required or any special software. You can solve
              everything on your local machine or deploy it to your favorite
              cloud provider. All we need is just the URL.
            </Box>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export const WhatsPractice = styled(_WhatsPractice)`
  display: block;
  background: white;
  padding-top: 70px;
  padding-bottom: 80px;
`;
