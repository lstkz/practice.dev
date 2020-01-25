import styled from 'styled-components';
import React from 'react';
import { Row, Col } from './Grid';
import { Button } from './Button';
import { GithubIcon } from 'src/icons/GithubIcon';
import { GoogleIcon } from 'src/icons/GoogleIcon';

const Or = styled.div`
  padding: 20px 0;
  text-align: center;
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
      <Row gutter={10}>
        <Col lg={6}>
          <Button
            onClick={onGithubClick}
            type="secondary"
            block
            icon={<GithubIcon size={20} />}
          >
            Github
          </Button>
        </Col>
        <Col lg={6}>
          <Button
            onClick={onGoogleClick}
            type="secondary"
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
