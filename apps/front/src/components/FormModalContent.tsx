import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';

interface FormModalContentProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const Title = styled.div`
  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
  color: ${Theme.textDark};
`;

const _FormModalContent = (props: FormModalContentProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      {children}
    </div>
  );
};

export const FormModalContent = styled(_FormModalContent)`
  padding: 40px 50px 30px;
`;
