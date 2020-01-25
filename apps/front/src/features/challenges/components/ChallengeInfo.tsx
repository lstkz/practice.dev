import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Button } from 'src/components/Button';
import { Link } from 'typeless-router';
import { Challenge } from 'shared';

const Tag = styled.div``;

const Wrapper = styled.div`
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #eff2f7;
  border-radius: 6px;
  display: flex;
  margin-bottom: 15px;
  padding: 30px 40px;
  position: relative;
  box-shadow: 0 0 1.25rem rgba(31, 45, 61, 0.08);
  overflow: hidden;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  a {
    color: black;
  }
`;

const Col1 = styled.div`
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;

const Col2 = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  padding-left: 10px;
  padding-right: 30px;
`;

const Col3 = styled.div`
  width: 120px;
  flex-shrink: 0;
`;

const IconCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  i {
  }
`;

const Stats = styled.div`
  display: flex;
  svg,
  i {
    margin-right: 5px;
  }
`;

const SolveButton = styled(Button)`
  margin: 15px 0;
`;

const Tags = styled.div`
  margin-top: auto;
  padding-top: 10px;
  position: relative;
  ${Tag} + ${Tag} {
    margin-left: 5px;
  }
  &::before {
    position: absolute;
    top: 0;
    left: 50%;
    display: block;
    width: 80%;
    height: 1px;
    margin-left: -40%;
    content: '';
    background: radial-gradient(ellipse at center, #dee4ef 0, rgba(255, 255, 255, 0) 75%);
  }
`;

const SolvedLabel = styled(Tag)`
  position: absolute;
  top: 20px;
  left: -20px;
  color: #fff;
  background-color: #28a745;
  font-weight: normal;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 0px;
  width: 100px;
  transform: rotate(-45deg);
`;

const Desc = styled.div`
  margin-bottom: 10px;
`;

interface ChallengeInfoProps {
  challenge: Challenge;
}

export function ChallengeInfo(props: ChallengeInfoProps) {
  const { challenge } = props;
  return (
    <Wrapper>
      {challenge.isSolved && <SolvedLabel>Solved</SolvedLabel>}
      {/* <Col1>
        <CodeIcon size="30px" />
      </Col1> */}
      <Col2>
        <Title>
          <Link href={`/challenges/${challenge.id}`}>{challenge.title}</Link>
        </Title>
        <Desc>{challenge.description}</Desc>
        <Tags>
          {challenge.tags.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </Tags>
      </Col2>
      <Col3>
        <Stats>
          <IconCounter data-tip="Total Submissions">
            <i className="fas fa-file"></i> {challenge.stats.submissions}
          </IconCounter>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <IconCounter data-tip="User Solved">
            <i className="fas fa-user"></i> {challenge.stats.solved}
          </IconCounter>
          <ReactTooltip place="top" type="dark" effect="solid" />
        </Stats>
        <SolveButton type="primary" block href={`/challenges/${challenge.id}`}>
          Solve
        </SolveButton>
      </Col3>
    </Wrapper>
  );
}
