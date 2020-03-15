import * as React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'src/components/Checkbox';
import { useUser } from 'src/hooks/useUser';
import { getChallengesState, ChallengesActions } from '../interface';
import { useActions } from 'typeless';
import { Select } from 'src/components/Select';
import { FilterSection } from 'src/components/FilterSection';
import { SelectOption } from 'src/types';
import {
  difficulties,
  domains,
  statuses,
  sortOptions,
  getFilter,
} from '../module';
import { getRouterState } from 'typeless-router';

interface ChallengeFilterProps {
  className?: string;
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

const _ChallengeFilter = (props: ChallengeFilterProps) => {
  const { className } = props;
  const user = useUser();
  const { location } = getRouterState.useState();
  const { tags } = getChallengesState.useState();
  const { updateFilter } = useActions(ChallengesActions);
  const filter = React.useMemo(() => {
    return getFilter(location!);
  }, [location]);

  return (
    <div className={className}>
      {user && (
        <FilterSection label="Challenges">
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
        </FilterSection>
      )}
      <FilterSection label="Difficulty">
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
      </FilterSection>
      <FilterSection label="Domain">
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
      </FilterSection>
      <FilterSection label="Tags">
        <Select
          id="tags"
          name="tags"
          isMulti
          value={filter.tags}
          isLoading={tags === null}
          options={(tags || []).map(item => ({
            label: `${item.name} (${item.count})`,
            value: item.name,
          }))}
          onChange={options => {
            updateFilter(
              'tags',
              ((options as SelectOption[]) || []).map(x => ({
                label: x.value,
                value: x.value,
              }))
            );
          }}
        />
      </FilterSection>
      <FilterSection label="Sort by">
        <Select
          id="sortBy"
          name="sortBy"
          value={filter.sortOrder}
          options={sortOptions}
          onChange={option => updateFilter('sortOrder', option)}
        />
      </FilterSection>
    </div>
  );
};

export const ChallengeFilter = styled(_ChallengeFilter)`
  display: block;
  width: 100%;
`;
