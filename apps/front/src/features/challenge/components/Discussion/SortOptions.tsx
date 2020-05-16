import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'src/components/Select';
import { getDiscussionState, DiscussionActions } from './DiscussionTab';
import { useActions } from 'typeless';
import { Theme } from 'ui';

interface SortOptionsProps {
  className?: string;
}

const Label = styled.div`
  font-weight: 500;
  margin-right: 10px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  margin-left: auto;
  .react-select__control {
    min-width: 120px;
  }
`;

const _SortOptions = (props: SortOptionsProps) => {
  const { className } = props;
  const { sortBy } = getDiscussionState();
  const { updateSort } = useActions(DiscussionActions);
  return (
    <div className={className}>
      <Right>
        <Label>SORT BY</Label>
        <Select
          id="sortBy"
          name="sortBy"
          value={sortBy}
          options={[
            { label: 'Newest', value: 'newest' },
            { label: 'Oldest', value: 'oldest' },
          ]}
          onChange={item => updateSort(item as any)}
        />
      </Right>
    </div>
  );
};

export const SortOptions = styled(_SortOptions)`
  display: flex;
  margin-top: 30px;
  padding: 20px 0;
  border-top: 1px solid ${Theme.grayLight};
`;
