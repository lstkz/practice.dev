import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'src/common/Theme';
import { VoidLink } from './VoidLink';

type TabsType = 'default' | 'minimal';

interface TabsProps {
  className?: string;
  children:
    | React.ReactElement<TabProps>
    | Array<React.ReactElement<TabProps> | false | null | undefined>;
  selectedTab: any;
  onIndexChange: (index: any) => any;
  flex?: boolean;
  paddingLeft?: 'default' | 'small' | 'md';
  type?: TabsType;
}

interface TabProps {
  title: string;
  name?: string;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
  testId?: string;
}

function _Tabs(props: TabsProps) {
  const { className, children, onIndexChange, selectedTab, type } = props;
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
          const { name, testId, title } = item.props;
          return (
            <TabTitle
              data-test={testId}
              key={name || i}
              active={i === selectedTab || name === selectedTab}
              onClick={() => onIndexChange(name || i)}
              type={type}
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

export const Tab = styled((props: TabProps) => (
  <div className={props.className}>{props.children}</div>
))`
  background: white;
`;

const TabTitle = styled.li<{ active: boolean; type?: TabsType }>`
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

  ${props =>
    props.type === 'minimal' &&
    css`
      color: ${Theme.textLight};
      border: none;
      border-radius: 5px 5px 0px 0px;
      background: white;
      margin: 0;
      padding: 5px 25px;
      margin-right: 5px;
      background: ${props.active ? 'white' : 'rgba(0, 0, 0, 0.07)'};
    `}
    
  &:hover {
    cursor: pointer;
    ${VoidLink} {
      color: ${Theme.textDark};
    }
  }
`;

export const Tabs = styled(_Tabs)`
  > ul {
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    display: flex;
    padding-left: ${props =>
      props.paddingLeft === 'small'
        ? 30
        : props.paddingLeft === 'md'
        ? 50
        : 80}px;
    border-bottom: 1px solid ${Theme.grayLight};
  }

  ${props =>
    props.flex &&
    css`
      display: flex;
      flex-direction: column;
      ${Tab} {
        flex: 1 0 auto;
      }
    `}

  ${props =>
    props.type === 'minimal' &&
    css`
      > ul {
        padding-left: 0;
        border-bottom: none;
      }
      ${Tab} {
        border-radius: 5px;
        border-top-left-radius: 0;
        padding: 20px;
      }
    `}
`;
