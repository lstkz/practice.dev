import * as React from 'react';
import styled from 'styled-components';
import { VoidLink } from './VoidLink';

interface LoadMoreButtonProps {
  className?: string;
  isLoading?: boolean;
  onClick(): void;
}

const _LoadMoreButton = (props: LoadMoreButtonProps) => {
  const { className, isLoading, onClick } = props;
  return (
    <div className={className}>
      {isLoading ? (
        <VoidLink>Loading...</VoidLink>
      ) : (
        <VoidLink data-test="load-more-btn" onClick={onClick}>
          Load More
        </VoidLink>
      )}
    </div>
  );
};

export const LoadMoreButton = styled(_LoadMoreButton)`
  margin-top: 20px;
  text-align: center;
`;
