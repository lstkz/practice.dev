import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'src/common/Theme';
import { VoidLink } from './VoidLink';

interface TabsProps {
  className?: string;
  children:
    | React.ReactElement<TabProps>
    | Array<React.ReactElement<TabProps> | false | null | undefined>;
  selectedTab: any;
  onIndexChange: (index: any) => any;
}

interface TabProps {
  title: string;
  name?: string;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}

function _Tabs(props: TabsProps) {
  const { className, children, onIndexChange, selectedTab } = props;
  const tabs = (Array.isArray(children)
    ? children.filter(x => x)
    : [children]) as Array<React.ReactElement<TabProps>>;
  const selected = React.useMemo(
    () =>
      tabs.find(
        (item, i) => item.props.name === selectedTab || i === selectedTab
      ),
    [tabs, selectedTab]
  );
  return (
    <div className={className}>
      <ul>
        {tabs.map((item, i) => {
          const { name, title } = item.props;
          return (
            <TabTitle
              key={name || i}
              active={i === selectedTab || name === selectedTab}
              onClick={() => onIndexChange(name || i)}
            >
              <VoidLink>{title}</VoidLink>
            </TabTitle>
          );
        })}
      </ul>
      {selected}
    </div>
  );
}

export const Tabs = styled(_Tabs)`
  > ul {
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    display: flex;
    padding-left: 80px;
    border-bottom: 1px solid ${Theme.grayLight};
  }
`;

export const Tab = styled((props: TabProps) => (
  <div className={props.className}>{props.children}</div>
))`
  background: white;
`;

const TabTitle = styled.li<{ active: boolean }>`
  border: none;
  padding: 10px 15px;
  margin-bottom: -1px;
  text-align: center;
  border-top: 2px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid ${Theme.grayLight};
  list-style: none;
  line-height: 19px;

  ${VoidLink} {
    text-align: center;
    text-decoration: none;
    color: ${Theme.text};
  }

  ${props =>
    props.active &&
    css`
      border-left-color: ${Theme.grayLight};
      border-right-color: ${Theme.grayLight};
      border-bottom-color: white;
      background: white;
      border-top-color: ${Theme.blue};
      ${VoidLink} {
        font-weight: 500;
        color: ${Theme.textDark};
      }
    `}

  &:hover {
    cursor: pointer;
    ${VoidLink} {
      color: ${Theme.textDark};
    }
  }
`;
