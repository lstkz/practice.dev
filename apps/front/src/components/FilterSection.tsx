import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';
import { Checkbox } from './Checkbox';

interface FilterSectionProps {
  className?: string;
  label: string;
  children: React.ReactNode;
}

const Label = styled.div`
  color: ${Theme.textDark};
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const _FilterSection = (props: FilterSectionProps) => {
  const { className, label, children } = props;
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
};

export const FilterSection = styled(_FilterSection)`
  margin-bottom: 30px;
  ${Checkbox} + ${Checkbox} {
    margin-top: 10px;
  }
`;
