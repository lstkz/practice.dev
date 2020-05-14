import * as React from 'react';
import * as R from 'remeda';
import { getDisplayGroups } from './utils';
import { SwaggerContext } from './SwaggerContext';
import { SideMenu, SideMenuGroup } from '../SideMenu';

const OFFSET = 10;

export function SwaggerMenu() {
  const spec = React.useContext(SwaggerContext);
  const menuGroups = React.useMemo(() => {
    const displayGroups = getDisplayGroups(spec);
    const ret: SideMenuGroup[] = [];
    displayGroups.forEach(group => {
      ret.push({
        title: group.tag.name,
        items: group.items.map(item => ({
          text: item.def.operationId,
          value: item.def.operationId,
        })),
      });
    });
    ret.push({
      title: 'Schema',
      items: Object.keys(spec.components.schemas).map(name => ({
        text: name,
        value: 'schema-' + name,
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
        // TODO sometimes last item can't be focusable
        // if (
        //   window.innerHeight + window.scrollY >=
        //   document.body.scrollHeight - OFFSET
        // ) {
        //   setActiveItem(items[0].value);
        //   return;
        // }
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
    <SideMenu
      active={activeItem}
      groups={menuGroups}
      onClick={value => {
        const target = document.getElementById(value) as HTMLDivElement;
        target.scrollIntoView(true);
        window.scrollBy(0, -OFFSET);
      }}
    />
  );
}
