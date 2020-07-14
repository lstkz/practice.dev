import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/Theme';
import { Tag } from 'src/components/Tag';
import { DomainIcon } from 'src/components/DomainIcon';
import { ChallengeDomain } from 'shared';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { Button } from '../Button';
import { MOBILE } from 'src/Theme';

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
  ${Tag} {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const Buttons = styled.div`
  width: 100%;
  ${Button} + ${Button} {
    margin-top: 10px;
  }
`;

const MobileRow1 = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 20px;
  }
`;
const MobileRow2 = styled.div``;
const MobileRow3 = styled.div`
  display: flex;
  margin-top: 10px;
`;

const _ChallengeHeader = (props: ChallengeHeaderProps) => {
  const { className, domain, title, tags, buttons } = props;
  const isMobile = useIsMobile();
  return (
    <div className={className}>
      {isMobile ? (
        <>
          <MobileRow1>
            <DomainIcon domain={domain} />
            <Title data-test="challenge-title">{title}</Title>
          </MobileRow1>
          <MobileRow2>{tags && <Tags>{tags}</Tags>}</MobileRow2>
          <MobileRow3>
            <Buttons>{buttons}</Buttons>
          </MobileRow3>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export const ChallengeHeader = styled(_ChallengeHeader)`
  width: 100%;
  display: flex;
  padding: 20px 30px 17px 25px;
  ${MOBILE} {
    flex-direction: column;
  }
`;
