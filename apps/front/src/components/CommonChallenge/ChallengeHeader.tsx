import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { Tag } from 'src/components/Tag';
import { DomainIcon } from 'src/components/DomainIcon';
import { ChallengeDomain } from 'shared';
import { Button } from 'ui';

interface ChallengeHeaderProps {
  className?: string;
  domain: ChallengeDomain;
  title: string;
  tags?: React.ReactNode;
  buttons: React.ReactNode;
}

const Col1 = styled.div`
  width: 30px;
  flex-shrink: 0;
  padding-top: 5px;
`;
const Col2 = styled.div`
  flex-grow: 1;
  margin-left: 25px;
`;
const Col3 = styled.div`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  padding-top: 20px;
`;

const Title = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  margin: 0;
  color: ${Theme.textDark};
  margin-right: 10px;
`;

const Tags = styled.div`
  margin-top: 14px;
  ${Tag} + ${Tag} {
    margin-left: 10px;
  } 
`;

const Buttons = styled.div`
  width: 100%;
  ${Button} + ${Button} {
    margin-top: 10px;
  }
`;

const _ChallengeHeader = (props: ChallengeHeaderProps) => {
  const { className, domain, title, tags, buttons } = props;
  return (
    <div className={className}>
      <Col1>
        <DomainIcon domain={domain} />
      </Col1>
      <Col2>
        <Title data-test="challenge-title">{title}</Title>
        {tags && <Tags>{tags}</Tags>}
      </Col2>
      <Col3>
        <Buttons>{buttons}</Buttons>
      </Col3>
    </div>
  );
};

export const ChallengeHeader = styled(_ChallengeHeader)`
  width: 100%;
  display: flex;
  padding: 20px 30px 17px 25px;
`;
