import * as React from 'react';
import styled from 'styled-components';
import { DisplayGroup } from './utils';
import { SwaggerDisplayGroupItem } from './SwaggerDisplayGroupItem';

interface SwaggerDisplayGroupProps {
  className?: string;
  group: DisplayGroup;
}

const Title = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 500;
`;
const Desc = styled.div`
  margin-bottom: 20px;
`;

const _SwaggerDisplayGroup = (props: SwaggerDisplayGroupProps) => {
  const { className, group } = props;
  return (
    <div className={className}>
      <Title>{group.tag.name}</Title>
      <Desc>{group.tag.description}</Desc>
      {group.items.map((item, i) => (
        <SwaggerDisplayGroupItem key={i} item={item} />
      ))}
    </div>
  );
};

export const SwaggerDisplayGroup = styled(_SwaggerDisplayGroup)`
  display: block;
`;
