import styled from 'styled-components';
import React from 'react';
import { Row, Col } from './Grid';
import { Button } from './Button';
import { GithubIcon } from './Icons/GithubIcon';
import { GoogleIcon } from './Icons/GoogleIcon';

const Or = styled.div`
  padding: 16px 0;
  text-align: center;
  font-size: 0.75rem;
`;

interface SocialFormButtonsProps {
  onGithubClick: () => void;
  onGoogleClick: () => void;
}

export function SocialFormButtons(props: SocialFormButtonsProps) {
  const { onGithubClick, onGoogleClick } = props;
  return (
    <>
      <Or>OR</Or>
      <Row>
        <Col lg={6}>
          <Button
            onClick={onGithubClick}
            type="neutral"
            block
            icon={<GithubIcon size={20} />}
          >
            Github
          </Button>
        </Col>
        <Col lg={6}>
          <Button
            onClick={onGoogleClick}
            type="neutral"
            block
            icon={<GoogleIcon size={20} />}
          >
            Google
          </Button>
        </Col>
      </Row>
    </>
  );
}
