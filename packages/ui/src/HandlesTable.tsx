import React from 'react';
import styled from 'styled-components';

export interface HandlesTableProps {
  className?: string;
  entries: Array<{
    handle: string;
    type: 'container' | 'link' | 'text' | 'button' | 'form field';
    desc: React.ReactChild;
  }>;
}

const TitleCell = styled.td`
  text-align: center;
  font-style: italic;
  &&& {
    padding: 20px;
  }
`;

const TypeTd = styled.td`
  white-space: nowrap;
`;

const _HandlesTable = (props: HandlesTableProps) => {
  const { className, entries } = props;
  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            <TitleCell colSpan={3}>Handle description</TitleCell>
          </tr>
          <tr>
            <th>Handle</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((item, i) => (
            <tr key={i}>
              <td>
                <code>{item.handle}</code>
              </td>
              <TypeTd>{item.type}</TypeTd>
              <td>{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const HandlesTable = styled(_HandlesTable)`
  display: block;
  table {
    width: 100%;
  }
`;
