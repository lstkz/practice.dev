import styled, { css } from 'styled-components';
import { Theme } from 'src/Theme';
import React from 'react';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  type: 'success' | 'error';
  testId?: string;
}

const _Alert = (props: AlertProps) => {
  const { className, children, testId } = props;
  return (
    <div className={className} data-test={testId}>
      {children}
    </div>
  );
};

export const Alert = styled(_Alert)`
  padding: 10px 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 15px;
  }
  ${props => {
    switch (props.type) {
      case 'error': {
        return css`
          background: ${Theme.red};
          color: white;
        `;
      }
      case 'success': {
        return css`
          background: ${Theme.lightGreen2};
          color: ${Theme.textDark};
        `;
      }
    }
  }}
`;
