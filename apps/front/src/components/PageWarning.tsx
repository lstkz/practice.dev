import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/Theme';
import { WarningIcon } from 'src/icons/WarningIcon';

interface PageWarningProps {
  className?: string;
  children: React.ReactNode;
}

const Inner = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 9px;
  }
  color: ${Theme.textDark};
`;

const _PageWarning = (props: PageWarningProps) => {
  const { className, children } = props;
  return (
    <div className={className} data-test="page-warning">
      <Inner>
        <WarningIcon />
        {children}
      </Inner>
    </div>
  );
};

export const PageWarning = styled(_PageWarning)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 3px #0000001c;
  background: ${Theme.lightYellow};
  padding: 15px;
`;
