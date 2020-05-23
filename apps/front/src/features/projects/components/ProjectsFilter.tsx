import * as React from 'react';
import styled from 'styled-components';
import { getRouterState } from 'typeless-router';
import { ProjectsActions } from '../interface';
import { useUser } from 'src/hooks/useUser';
import { useActions } from 'typeless';
import { getFilter, statuses, domains, sortOptions } from '../module';
import { FilterSection } from 'src/components/FilterSection';
import { Checkbox } from 'src/components/Checkbox';
import { capitalize, toggleMapValue } from 'src/common/helper';
import { Select } from 'src/components/Select';

interface ProjectsFilterProps {
  className?: string;
}

const _ProjectsFilter = (props: ProjectsFilterProps) => {
  const { className } = props;
  const user = useUser();
  const { location } = getRouterState.useState();
  const { updateFilter } = useActions(ProjectsActions);
  const filter = React.useMemo(() => {
    return getFilter(location!);
  }, [location]);

  return (
    <div className={className}>
      {user && (
        <FilterSection label="Projects" testId="filter-projects">
          {statuses.map(item => {
            return (
              <Checkbox
                testId={`option-${item}`}
                key={item}
                onChange={() => {
                  updateFilter(
                    'statuses',
                    toggleMapValue(filter.statuses, item)
                  );
                }}
                checked={!!filter.statuses[item]}
              >
                {item === 'partial' ? 'Partially Solved' : capitalize(item)}
              </Checkbox>
            );
          })}
        </FilterSection>
      )}
      <FilterSection label="Domain" testId="filter-domain">
        {domains.map(item => {
          return (
            <Checkbox
              testId={`option-${item}`}
              key={item}
              onChange={() => {
                updateFilter('domains', toggleMapValue(filter.domains, item));
              }}
              checked={!!filter.domains[item]}
            >
              {capitalize(item)}
            </Checkbox>
          );
        })}
      </FilterSection>
      <FilterSection label="Sort by" testId="filter-sort">
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

export const ProjectsFilter = styled(_ProjectsFilter)`
  display: block;
  width: 100%;
`;
