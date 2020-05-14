import { faqGroups } from '../faqList';
import React from 'react';
import { SideMenu } from 'src/components/SideMenu';
import { createUrl } from 'src/common/url';

interface FaqMenuProps {
  slug: string;
}

export function FaqMenu(props: FaqMenuProps) {
  const { slug } = props;
  const menuGroups = React.useMemo(() => {
    return faqGroups.map(group => ({
      title: group.title,
      items: group.items.map(item => ({
        text: item.title,
        value: item.slug,
        href: createUrl({
          name: 'faq',
          slug: item.slug,
        }),
      })),
    }));
  }, [faqGroups]);

  return <SideMenu testId="faq-menu" active={slug} groups={menuGroups} />;
}
