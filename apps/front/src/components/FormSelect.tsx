import React, { useContext } from 'react';
import { FormContext } from 'typeless-form';
import {
  SelectProps,
  Select,
  CreatableSelectProps,
  CreatableSelect,
} from './Select';

import AsyncPaginate, {
  Props as AsyncPaginateProps,
} from 'react-select-async-paginate';

import styled from 'styled-components';
import { ErrorTooltip } from './ErrorTooltip';
import { FormLabel } from './FormLabel';
import { FormDescription } from './FormDescription';

interface BaseFormSelectProps {
  id?: string;
  name: string;
  label?: string;
  readOnlyText?: boolean;
  description?: string;
  testId?: string;
}

interface FormSelectProps<OptionType>
  extends SelectProps<OptionType>,
    BaseFormSelectProps {
  name: string;
}

interface CreatableFormSelectProps<OptionType>
  extends CreatableSelectProps<OptionType>,
    BaseFormSelectProps {
  name: string;
}

interface AsyncCreatableFormSelectProps<OptionType>
  extends AsyncPaginateProps<OptionType>,
    BaseFormSelectProps {
  name: string;
}

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SelectWrapper = styled.div`
  width: 100%;
  & > div:last-child {
    width: 100%;
  }
`;

function BaseSelect(
  props: BaseFormSelectProps & { Component: React.SFC<SelectProps<any>> }
) {
  const {
    name,
    readOnlyText,
    Component,
    id,
    label,
    description,
    testId,
    ...rest
  } = props;
  const targetId = id || 'select';
  const data = useContext(FormContext);
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const hasError = data.touched[name] && !!data.errors[name];
  const value = data.values[name];
  if (readOnlyText) {
    if (Array.isArray(value)) {
      return (
        <div>
          {value.map((item, i) => (
            <div key={i}>{item.label}</div>
          ))}
        </div>
      );
    }
    return value ? value.label : null;
  }
  console.log(rest);

  return (
    <ErrorTooltip
      testId={testId ? `${targetId}_error` : undefined}
      id={`${targetId}_error`}
      error={data.errors[name]}
      isVisible={hasError}
    >
      {({ ref }) => (
        <Wrapper data-error={hasError ? true : undefined}>
          {label && <FormLabel id={targetId} label={label} />}
          <SelectWrapper data-test={testId} ref={ref}>
            <Component
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              // menuPortalTarget={document.body}
              value={value == null ? null : value}
              onBlur={() => data.actions.blur(name)}
              onChange={option => {
                data.actions.change(name, option);
              }}
              id={targetId}
              {...rest}
            />
          </SelectWrapper>
          {description && <FormDescription>{description}</FormDescription>}
        </Wrapper>
      )}
    </ErrorTooltip>
  );
}

export function FormSelect<OptionType>(props: FormSelectProps<OptionType>) {
  return <BaseSelect {...props} Component={Select} />;
}

export function CreatableFormSelect<OptionType>(
  props: CreatableFormSelectProps<OptionType>
) {
  return <BaseSelect {...props} Component={CreatableSelect} />;
}

function CreatableAsyncPaginate(props: any) {
  return <AsyncPaginate SelectComponent={CreatableSelect} {...props} />;
}

export function AsyncCreatableFormSelect<OptionType>(
  props: AsyncCreatableFormSelectProps<OptionType>
) {
  return <BaseSelect {...props} Component={CreatableAsyncPaginate} />;
}
