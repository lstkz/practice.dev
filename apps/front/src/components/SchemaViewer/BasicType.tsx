import * as React from 'react';
import styled from 'styled-components';

interface BasicTypeProps {
  className?: string;
  type: string;
}

const _BasicType = (props: BasicTypeProps) => {
  const { className, type } = props;
  return <span className={className}>{type}</span>;
};

export const BasicType = styled(_BasicType)`
  color: #5854ae;
`;
