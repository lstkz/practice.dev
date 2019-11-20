import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from './Grid';
import { Container } from './Container';

interface FooterProps {
  className?: string;
}

const Copyright = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
`;
const Links = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;

  li {
    a {
      font-size: 0.875rem;
      color: #8492a6;
      display: block;
      padding: 4px 16px;
    }
  }
`;

const _Footer = (props: FooterProps) => {
  const { className } = props;
  return (
    <Container className={className}>
      <Row>
        <Col lg={6}>
          <Copyright>
            © {new Date().getFullYear()} Practice.dev. All rights reserved.
          </Copyright>
        </Col>
        <Col lg={6}>
          <Links>
            <li>
              <a href="void:">Support</a>
            </li>
            <li>
              <a href="void:">Terms</a>
            </li>
            <li>
              <a href="void:">Privacy</a>
            </li>
          </Links>
        </Col>
      </Row>
    </Container>
  );
};

export const Footer = styled(_Footer)`
  display: block;
  border-top: 1px solid #eff2f7 !important;
  margin-top: auto;
  padding: 24px 0;
`;
