import * as React from 'react';
import styled from 'styled-components';
import { Theme, MOBILE } from 'src/Theme';

interface FilterLayoutProps {
  className?: string;

  content: React.ReactChild;
  filter: React.ReactChild;
}

const Left = styled.div`
  padding-right: 40px;
  width: calc(100% - 250px);
  border-right: 1px solid ${Theme.bgLightGray6};
`;

const Right = styled.div`
  padding-left: 30px;
  width: 250px;
`;

const _FilterLayout = (props: FilterLayoutProps) => {
  const { className, content, filter } = props;
  return (
    <div className={className}>
      <Left>{content}</Left>
      <Right>{filter}</Right>
    </div>
  );
};

export const FilterLayout = styled(_FilterLayout)`
  display: flex;
  ${MOBILE} {
    ${Left} {
      width: 100%;
      border: none;
      padding: 0;
    }
    ${Right} {
      display: none;
    }
  }
`;
