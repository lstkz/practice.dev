import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { Theme } from 'ui';

interface IconCounterProps {
  className?: string;
  icon: React.ReactNode;
  count: number;
  tooltip: string;
  testId: string;
}

const _IconCounter = (props: IconCounterProps) => {
  const { className, icon, count, tooltip, testId } = props;
  return (
    <>
      <div className={className} data-tip={tooltip} data-test={testId}>
        {icon} {count}
      </div>
      <ReactTooltip place="top" type="dark" effect="solid" />
    </>
  );
};

export const IconCounter = styled(_IconCounter)`
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  color: ${Theme.textDark};
  font-weight: 500;
  svg {
    margin-right: 5px;
  }
`;
