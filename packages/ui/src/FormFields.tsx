import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from './Theme';

interface ValidationRule {
  rule: string;
  error: string;
  condition: React.ReactChild;
}

export interface FormEntry {
  field: string;
  type: 'text' | 'select';
  desc: React.ReactChild;
  options?: React.ReactChild;
  defaultValue?: React.ReactChild;
  rules: ValidationRule[];
}

interface FormFieldsProps {
  className?: string;
  entries: FormEntry[];
}

const Tr = styled.tr<{ bottomSep?: boolean }>`
  ${props =>
    props.bottomSep &&
    css`
      && {
        th,
        td {
          /* border-bottom-color: ${Theme.border}; */
          border-bottom-width: 4px;
        }
      }
    `}
`;

const Th = styled.th<{ center?: boolean }>`
  ${props =>
    props.center &&
    css`
      text-align: center;
    `}
`;

const TitleCell = styled.td`
  text-align: center;
  font-style: italic;
  &&& {
    padding: 20px;
  }
`;

const _FormFields = (props: FormFieldsProps) => {
  const { className, entries } = props;
  return (
    <table className={className}>
      <tbody>
        <tr>
          <TitleCell colSpan={3}>Form description</TitleCell>
        </tr>
        {entries.map((entry, i) => (
          <React.Fragment key={i}>
            <tr>
              <th>Field</th>
              <td colSpan={2}>{entry.field}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td colSpan={2}>{entry.type}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td colSpan={2}>{entry.desc}</td>
            </tr>
            {entry.options && (
              <tr>
                <th>Options</th>
                <td colSpan={2}>{entry.options}</td>
              </tr>
            )}
            {entry.defaultValue && (
              <tr>
                <th>Default value</th>
                <td colSpan={2}>{entry.defaultValue}</td>
              </tr>
            )}
            <tr>
              <Th center colSpan={3}>
                Validation Rules
              </Th>
            </tr>
            <tr>
              <th>Rule</th>
              <th>Error Message</th>
              <th>Condition</th>
            </tr>
            {entry.rules.map((rule, j) => (
              <Tr
                key={j}
                bottomSep={
                  j + 1 === entry.rules.length && i + 1 !== entries.length
                }
              >
                <td>{rule.rule}</td>
                <td>{rule.error}</td>
                <td>{rule.condition}</td>
              </Tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export const FormFields = styled(_FormFields)``;
