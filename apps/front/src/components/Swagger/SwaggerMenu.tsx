import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'ui';
import { VoidLink } from '../VoidLink';

interface SwaggerMenuProps {
  className?: string;
}

const Group = styled.div`
  margin-bottom: 25px;
`;

const Title = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

interface ItemProps {
  active?: boolean;
}
const Item = styled(VoidLink)`
  display: block;
  padding: 3px 0 3px 15px;
  border-left: 3px solid ${Theme.bgLightGray2};
  color: ${Theme.textLight};

  ${(props: ItemProps) =>
    props.active &&
    css`
      color: ${Theme.text};
      font-weight: 500;
      border-left-color: ${Theme.green};
    `}
  margin-bottom: 1px;
`;

const _SwaggerMenu = (props: SwaggerMenuProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Group>
        <Title>PET</Title>
        <Item active>Get All Pets</Item>
        <Item>Get Pet</Item>
        <Item>Update Pet</Item>
        <Item>Delete Pet</Item>
      </Group>
      <Group>
        <Title>SCHEMA</Title>
        <Item>Pet</Item>
        <Item>New Pet</Item>
        <Item>Error</Item>
      </Group>
    </div>
  );
};

export const SwaggerMenu = styled(_SwaggerMenu)`
  display: block;
  position: sticky;
  top: 10px;
`;
