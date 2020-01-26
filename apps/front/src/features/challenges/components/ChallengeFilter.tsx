import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { Checkbox } from 'src/components/Checkbox';
import { useUser } from 'src/hooks/useUser';

interface ChallengeFilterProps {
  className?: string;
}

const Label = styled.div`
  color: ${Theme.textDark};
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const Section = styled.div`
  margin-bottom: 30px;
  ${Checkbox} + ${Checkbox} {
    margin-top: 10px;
  }
`;

const _ChallengeFilter = (props: ChallengeFilterProps) => {
  const { className } = props;
  const user = useUser();
  return (
    <div className={className}>
      {user && (
        <Section>
          <Label>Challenges</Label>
          <Checkbox>Solved</Checkbox>
          <Checkbox>Unsolved</Checkbox>
        </Section>
      )}
      <Section>
        <Label>Difficulty</Label>
        <Checkbox>Easy</Checkbox>
        <Checkbox>Medium</Checkbox>
        <Checkbox>Hard</Checkbox>
      </Section>
      <Section>
        <Label>Domain</Label>
        <Checkbox>Frontend</Checkbox>
        <Checkbox>Backend</Checkbox>
        <Checkbox>Fullstack</Checkbox>
      </Section>
    </div>
  );
};

export const ChallengeFilter = styled(_ChallengeFilter)`
  display: block;
`;
