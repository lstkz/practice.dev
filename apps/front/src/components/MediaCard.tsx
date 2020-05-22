import * as React from 'react';
import styled from 'styled-components';
import { Theme, Button } from 'ui';
import { Tag } from './Tag';
import { SolvedTag } from './SolvedTag';

interface MediaCardProps {
  testId: string;
  className?: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  tags: React.ReactNode;
  stats: React.ReactNode;
  button: React.ReactNode;
}

const Top = styled.div`
  display: flex;
  align-items: center;
  ${SolvedTag} {
    margin-right: 10px;
  }
`;

const Col1 = styled.div`
  width: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const Col2 = styled.div`
  flex-grow: 1;
  padding-left: 25px;
  padding-right: 30px;
`;

const Col3 = styled.div`
  width: 280px;
  height: 40px;
  flex-shrink: 0;
  display: flex;

  ${Button} {
    margin-left: auto;
    margin-right: 0;
  }
`;

const Tags = styled.div`
  ${Tag} + ${Tag} {
    margin-left: 10px;
  } 
`;

const Desc = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
`;

const _MediaCard = (props: MediaCardProps) => {
  const {
    className,
    testId,
    icon,
    title,
    description,
    tags,
    stats,
    button,
  } = props;

  return (
    <div className={className} data-test={testId}>
      <Col1>{icon}</Col1>
      <Col2>
        <Top>{title}</Top>
        <Desc data-test="desc">{description}</Desc>
        <Tags>{tags}</Tags>
      </Col2>
      <Col3>
        {stats}
        {button}
      </Col3>
    </div>
  );
};

export const MediaCard = styled(_MediaCard)`
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid ${Theme.grayLight};
  display: flex;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px 20px 25px 25px;
  position: relative;
`;
