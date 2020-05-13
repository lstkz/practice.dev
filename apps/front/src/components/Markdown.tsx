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
  code {
    font-size: 14px;
    padding: 5px 7px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.05);
    font-weight: 600;
    font-family: courier;
  }
`;
