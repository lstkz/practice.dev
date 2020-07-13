import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme, Button, MOBILE } from 'ui';
import { Tag } from './Tag';
import { SolvedTag } from './SolvedTag';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { IconCounter } from './IconCounter';

interface MediaCardProps {
  testId: string;
  className?: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  tags?: React.ReactNode;
  stats?: React.ReactNode;
  button: React.ReactNode;
  disabled?: boolean;
  highlighted?: boolean;
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
  margin-top: 15px;
  ${Tag} {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const Desc = styled.div`
  margin-top: 10px;
`;

const MobileRow1 = styled.div`
  display: flex;
  svg {
    margin-right: 20px;
  }
`;
const MobileRow2 = styled.div``;
const MobileRow3 = styled.div`
  display: flex;
  margin-top: 10px;
  ${IconCounter} {
    justify-content: flex-start;
  }
  ${Button} {
    margin-left: auto;
    margin-right: 0;
  }
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
  const isMobile = useIsMobile();

  return (
    <div className={className} data-test={testId}>
      {isMobile ? (
        <>
          <MobileRow1>
            {icon} <Top>{title}</Top>
          </MobileRow1>
          <MobileRow2>
            <Desc data-test="desc">{description}</Desc>
            {tags && <Tags>{tags}</Tags>}
          </MobileRow2>
          <MobileRow3>
            {stats}
            {button}
          </MobileRow3>
        </>
      ) : (
        <>
          <Col1>{icon}</Col1>
          <Col2>
            <Top>{title}</Top>
            <Desc data-test="desc">{description}</Desc>
            {tags && <Tags>{tags}</Tags>}
          </Col2>
          <Col3>
            {stats}
            {button}
          </Col3>
        </>
      )}
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

  ${props =>
    props.disabled &&
    css`
      opacity: 0.6;
    `}
  ${props =>
    props.highlighted &&
    css`
      border: 1px solid ${Theme.blueTag};
      background: ${Theme.lightBlue};
    `}

  ${MOBILE} {
    flex-direction: column;
  }
`;
