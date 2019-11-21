import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../common/Theme';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  type: 'success' | 'danger';
}

const _Alert = (props: AlertProps) => {
  const { className, children } = props;
  return <div className={className}>{children}</div>;
};

export const Alert = styled(_Alert)`
  display: block;
  font-size: 0.875rem;
  position: relative;
  margin-bottom: 16px;
  padding: 14px 14px;
  border: 1px solid transparent;
  border-radius: 6px;

  ${props => {
    switch (props.type) {
      case 'success':
        return css`
          color: #fff;
          border-color: ${Theme.bgSuccess};
          background-color: ${Theme.bgSuccess};
        `;
      case 'danger':
        return css`
          color: #fff;
          border-color: ${Theme.bgDanger};
          background-color: ${Theme.bgDanger};
        `;
    }
  }};
`;
