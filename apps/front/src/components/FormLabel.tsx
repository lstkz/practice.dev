import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/Theme';

interface FormLabelProps {
  id: string;
  className?: string;
  label: React.ReactNode;
  rightLabel?: React.ReactNode;
}

const Label = styled.label`
  font-weight: 500;
  line-height: 19px;
  color: ${Theme.textDark};
`;

const _FormLabel = (props: FormLabelProps) => {
  const { className, label, id, rightLabel } = props;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label> <div>{rightLabel}</div>
    </div>
  );
};

export const FormLabel = styled(_FormLabel)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 11px;
`;
