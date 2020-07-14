import * as React from 'react';
import styled from 'styled-components';
import { Title } from './Title';

import { MOBILE } from 'src/Theme';

interface FormModalContentProps {
  className?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const _FormModalContent = (props: FormModalContentProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      {title && (
        <Title center mb="md">
          {title}
        </Title>
      )}
      {children}
    </div>
  );
};

export const FormModalContent = styled(_FormModalContent)`
  padding: 40px 50px 30px;

  ${MOBILE} {
    padding: 20px 25px 15px;
  }
`;
