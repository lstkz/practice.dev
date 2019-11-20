import React from 'react';
import { useLoginModule } from '../module';
import styled from 'styled-components';
import { Theme } from '../../../common/Theme';
import { Container } from '../../../components/Container';
import { Card } from '../../../components/Card';
import { Col, Row } from '../../../components/Grid';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { PasswordIcon } from '../../../components/Icons/PasswordIcon';
import { EmailIcon } from '../../../components/Icons/EmailIcon';
import { AccountIcon } from '../../../components/Icons/AccountIcon';
import { GithubIcon } from '../../../components/Icons/GithubIcon';
import { GoogleIcon } from '../../../components/Icons/GoogleIcon';
import { Link } from '../../../components/Link';

const Bg = styled.div`
  border-radius: 0 80px 80px 0;
  position: absolute;
  z-index: -2;
  top: 0;
  width: 50%;
  height: 100%;
  background: ${Theme.bgPrimary};
  overflow: hidden;

  img {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }
`;

const Title = styled.h3`
  font-size: calc(1.3rem + 0.6vw);
  margin: 0;
  margin-bottom: 40px;
  text-align: center;
`;

const CardInner = styled.div`
  padding: 46px;
`;

const CardContainer = styled.div`
  width: 500px;
  margin: 80px auto 0;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Or = styled.div`
  padding: 16px 0;
  text-align: center;
  font-size: 0.75rem;
`;

const Bottom = styled.div`
  margin-top: 24px;
  text-align: center;
`;

export function LoginView() {
  useLoginModule();

  return (
    <>
      <Bg>
        <img src={require('../../../../assets/login-bg.jpg')} />
      </Bg>
      <CardContainer>
        <Card>
          <CardInner>
            <Title>Create your account</Title>
            <form
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <Input
                label="username"
                placeholder="coder"
                icon={<AccountIcon />}
                value="abc"
                state="valid"
              />

              <Input
                label="email address"
                placeholder="name@example.com"
                icon={<EmailIcon />}
                value="abc"
                state="error"
                feedback="invalid email"
              />

              <Input
                label="password"
                placeholder="********"
                type="password"
                icon={<PasswordIcon />}
              />
              <Button type="primary" block>
                Create my account
              </Button>
              <Or>OR</Or>
              <Row>
                <Col lg={6}>
                  <Button type="neutral" block icon={<GithubIcon size={20} />}>
                    Github
                  </Button>
                </Col>
                <Col lg={6}>
                  <Button type="neutral" block icon={<GoogleIcon size={20} />}>
                    Google
                  </Button>
                </Col>
              </Row>
              <Bottom>
                <small>
                  Already have an account?{' '}
                  <Link href="/register">
                    <strong>Sign in</strong>
                  </Link>
                </small>
              </Bottom>
            </form>
          </CardInner>
        </Card>
      </CardContainer>
    </>
  );
}
