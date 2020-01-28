import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { Checkbox } from 'src/components/Checkbox';
import { useUser } from 'src/hooks/useUser';
import {
  getChallengesState,
  ChallengesActions,
  SolveStatus,
} from '../interface';
import { useActions } from 'typeless';
import { ChallengeDifficulty, ChallengeDomain } from 'shared';

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

function capitalize(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

const _ChallengeFilter = (props: ChallengeFilterProps) => {
  const { className } = props;
  const user = useUser();
  const { filter } = getChallengesState.useState();
  const { updateFilter } = useActions(ChallengesActions);
  const statuses: SolveStatus[] = ['solved', 'unsolved'];
  const difficulties: ChallengeDifficulty[] = ['easy', 'medium', 'hard'];
  const domains: ChallengeDomain[] = ['frontend', 'backend', 'fullstack'];

  return (
    <div className={className}>
      {user && (
        <Section>
          <Label>Challenges</Label>
          {statuses.map(item => {
            return (
              <Checkbox
                key={item}
                onChange={() => {
                  let copy = { ...filter.statuses };
                  if (copy[item]) {
                    delete copy[item];
                  } else {
                    copy[item] = item;
                  }
                  updateFilter('statuses', copy);
                }}
                checked={!!filter.statuses[item]}
              >
                {capitalize(item)}
              </Checkbox>
            );
          })}
        </Section>
      )}
      <Section>
        <Label>Difficulty</Label>
        {difficulties.map(item => {
          return (
            <Checkbox
              key={item}
              onChange={() => {
                let copy = { ...filter.difficulties };
                if (copy[item]) {
                  delete copy[item];
                } else {
                  copy[item] = item;
                }
                updateFilter('difficulties', copy);
              }}
              checked={!!filter.difficulties[item]}
            >
              {capitalize(item)}
            </Checkbox>
          );
        })}
      </Section>
      <Section>
        <Label>Domain</Label>
        {domains.map(item => {
          return (
            <Checkbox
              key={item}
              onChange={() => {
                let copy = { ...filter.domains };
                if (copy[item]) {
                  delete copy[item];
                } else {
                  copy[item] = item;
                }
                updateFilter('domains', copy);
              }}
              checked={!!filter.domains[item]}
            >
              {capitalize(item)}
            </Checkbox>
          );
        })}
      </Section>
    </div>
  );
};

export const ChallengeFilter = styled(_ChallengeFilter)`
  display: block;
`;
