import * as React from 'react';
import styled, { css } from 'styled-components';
import { VoidLink, VoidLinkProps } from './VoidLink';
import { Theme } from 'src/Theme';
import { Link } from './Link';

export interface SideMenuItem {
  href?: string;
  text: React.ReactNode;
  value: string;
}

export interface SideMenuGroup {
  title: React.ReactNode;
  items: SideMenuItem[];
}

export interface SideMenuProps {
  className?: string;
  active: string;
  groups: SideMenuGroup[];
  onClick?: (value: string) => void;
  testId?: string;
}

const Group = styled.div`
  margin-bottom: 25px;
`;

const Title = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

interface ItemProps extends VoidLinkProps {
  testId?: string;
  href?: string;
  active?: boolean;
}
const Item = styled(({ active, href, testId, ...props }) => {
  if (href) {
    return <Link testId={testId} href={href} {...props} />;
  }
  return <VoidLink data-test={testId} {...props} />;
})`
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

const _SideMenu = (props: SideMenuProps) => {
  const { className, groups, active, onClick, testId } = props;
  return (
    <div data-test={testId} className={className}>
      {groups.map((group, i) => (
        <Group key={i}>
          <Title>{group.title}</Title>
          {group.items.map(item => (
            <Item
              testId={`side-menu-${item.value}`}
              href={item.href}
              onClick={() => {
                if (onClick) {
                  onClick(item.value);
                }
              }}
              key={item.value}
              active={item.value === active}
            >
              {item.text}
            </Item>
          ))}
        </Group>
      ))}
    </div>
  );
};

export const SideMenu = styled(_SideMenu)`
  display: block;
  position: sticky;
  top: 10px;
`;
