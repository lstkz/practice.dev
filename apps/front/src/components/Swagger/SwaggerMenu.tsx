import * as React from 'react';
import * as R from 'remeda';
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

const OFFSET = 10;

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
        value: 'schema-' + name,
        type: 'schema',
      })),
    });
    return ret;
  }, [spec]);
  const [activeItem, setActiveItem] = React.useState(
    menuGroups[0].items[0].value
  );

  React.useEffect(() => {
    let timerId: any = null;
    const items = R.flatMap(menuGroups, x => x.items).reverse();
    const onScroll = () => {
      if (timerId) {
        return;
      }
      timerId = setTimeout(() => {
        timerId = null;
        if (
          window.innerHeight + window.scrollY >=
          document.body.scrollHeight - OFFSET
        ) {
          setActiveItem(items[0].value);
          return;
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const node = document.getElementById(item.value)!;
          if (node.getBoundingClientRect().top <= OFFSET) {
            setActiveItem(item.value);
            return;
          }
        }
        setActiveItem(R.last(items).value);
      }, 100);
    };
    document.addEventListener('scroll', onScroll);
    document.addEventListener('resize', onScroll);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('scroll', onScroll);
      document.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={className}>
      {menuGroups.map((group, i) => (
        <Group key={i}>
          <Title>{group.title}</Title>
          {group.items.map(item => (
            <Item
              onClick={() => {
                const target = document.getElementById(
                  item.value
                ) as HTMLDivElement;
                target.scrollIntoView(true);
                window.scrollBy(0, -OFFSET);
              }}
              key={item.value}
              active={item.value === activeItem}
            >
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
