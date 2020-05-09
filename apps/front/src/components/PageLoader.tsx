import * as React from 'react';
import styled from 'styled-components';
import { Loader } from './Loader';

interface PageLoaderProps {
  className?: string;
}

const _PageLoader = (props: PageLoaderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Loader />
    </div>
  );
};

export const PageLoader = styled(_PageLoader)`
  display: block;
  margin: 120px 0;
  text-align: center;
`;
