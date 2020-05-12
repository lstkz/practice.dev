import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'ui';
import { VoidLink, VoidLinkProps } from '../VoidLink';
import { getDisplayGroups } from './utils';
import { SwaggerContext } from './SwaggerContext';

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

interface ItemProps extends VoidLinkProps {
  active?: boolean;
}

const Item = styled(({ active, ...props }) => <VoidLink {...props} />)`
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

interface MenuGroupItem {
  text: string;
  value: string;
  type: 'endpoint' | 'schema';
}

interface MenuGroup {
  title: string;
  items: MenuGroupItem[];
}

const _SwaggerMenu = (props: SwaggerMenuProps) => {
  const { className } = props;
  const spec = React.useContext(SwaggerContext);
  const menuGroups = React.useMemo(() => {
    const displayGroups = getDisplayGroups(spec);
    const ret: MenuGroup[] = [];
    displayGroups.forEach(group => {
      ret.push({
        title: group.tag.name,
        items: group.items.map(item => ({
          text: item.def.operationId,
          value: item.def.operationId,
          type: 'endpoint',
        })),
      });
    });
    ret.push({
      title: 'Schema',
      items: Object.keys(spec.components.schemas).map(name => ({
        text: name,
        value: name,
        type: 'schema',
      })),
    });
    return ret;
  }, [spec]);
  const activeValue = menuGroups[0]?.items[0]?.value;
  return (
    <div className={className}>
      {menuGroups.map((group, i) => (
        <Group key={i}>
          <Title>{group.title}</Title>
          {group.items.map(item => (
            <Item key={item.value} active={item.value === activeValue}>
              {item.text}
            </Item>
          ))}
        </Group>
      ))}
    </div>
  );
};

export const SwaggerMenu = styled(_SwaggerMenu)`
  display: block;
  position: sticky;
  top: 10px;
`;
