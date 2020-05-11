import * as React from 'react';
import styled from 'styled-components';
import mdParse from 'src/common/md';

interface MarkdownProps {
  className?: string;
  children: string;
}

const _Markdown = (props: MarkdownProps) => {
  const { className, children } = props;
  const md = React.useMemo(() => mdParse(children), [children]);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: md }}></div>
  );
};

export const Markdown = styled(_Markdown)`
  display: block;
`;
