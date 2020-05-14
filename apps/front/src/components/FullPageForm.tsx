import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../common/Theme';
import { Logo } from './Logo';
import { Modal } from './Modal';
import { Title } from './Title';

interface AuthFormProps {
  className?: string;
  title: string;
  subTitle?: React.ReactNode;
  children: React.ReactNode;
  bottom?: React.ReactNode;
  padding?: 'sm' | 'default';
  testId?: string;
  modal?: {
    isOpen: boolean;
    onClose: () => void;
  } | null;
}

const Card = styled.div<{
  padding?: 'sm' | 'default';
  noBorder?: boolean;
}>`
  border: 1px solid ${Theme.grayLight};
  border-radius: 5px;
  background: white;
  padding: 20px ${props => (props.padding === 'sm' ? '25px' : '55px')} 30px;
  ${props =>
    props.noBorder &&
    css`
      border: none;
    `}
`;

const Wrapper = styled.div`
  width: 460px;
  margin: 0 auto;
  padding-top: 110px;
  ${Card} {
    margin: 0;
  }
  ${Logo} {
    margin-bottom: 30px;
    font-size: 0;
    svg {
      width: 200px;
      height: auto;
    }
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Top = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SubTitle = styled.div`
  margin-top: 10px;
`;

const Bottom = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export function FullPageForm(props: AuthFormProps) {
  const { title, subTitle, children, bottom, padding, testId, modal } = props;
  if (modal) {
    return (
      <Modal
        isOpen={modal.isOpen}
        testId={testId}
        size="sm"
        close={modal.onClose}
        noBackgroundClose
      >
        <Card padding={padding} noBorder>
          <Top>
            <Title>{title}</Title>
            {subTitle && <SubTitle>{subTitle}</SubTitle>}
          </Top>
          {children}
          {bottom && <Bottom>{bottom}</Bottom>}
        </Card>
      </Modal>
    );
  }
  return (
    <Wrapper data-test={testId}>
      <Logo type="dark" />
      <Card padding={padding}>
        <Top>
          <Title>{title}</Title>
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </Top>
        {children}
        {bottom && <Bottom>{bottom}</Bottom>}
      </Card>
    </Wrapper>
  );
}
