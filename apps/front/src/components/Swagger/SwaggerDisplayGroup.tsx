import * as React from 'react';
import styled from 'styled-components';
import { DisplayGroup } from './utils';
import { SwaggerDisplayGroupItem } from './SwaggerDisplayGroupItem';
import { Title } from '../Title';

interface SwaggerDisplayGroupProps {
  className?: string;
  group: DisplayGroup;
}

const Desc = styled.div`
  margin-bottom: 20px;
`;

const _SwaggerDisplayGroup = (props: SwaggerDisplayGroupProps) => {
  const { className, group } = props;
  return (
    <div className={className}>
      <Title mb="sm">{group.tag.name}</Title>
      <Desc>{group.tag.description}</Desc>
      {group.items.map((item, i) => (
        <SwaggerDisplayGroupItem key={i} item={item} />
      ))}
    </div>
  );
};

export const SwaggerDisplayGroup = styled(_SwaggerDisplayGroup)`
  display: block;
  margin-bottom: 20px;
`;
