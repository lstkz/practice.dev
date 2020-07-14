import React from 'react';
import ReactSelect from 'react-select';
import { Theme as SelectTheme } from 'react-select/src/types';
import ReactSelectCreatable, {
  Props as CreatableProps,
} from 'react-select/creatable';
import { Props } from 'react-select/src/Select';
import { Theme } from 'src/Theme';
import { createGlobalStyle } from 'styled-components';
import AsyncPaginate, {
  Props as AsyncPaginateProps,
} from 'react-select-async-paginate';

export interface SelectProps<OptionType> extends Props<OptionType> {}
export interface CreatableSelectProps<OptionType>
  extends CreatableProps<OptionType> {}

const SelectStyles = createGlobalStyle`
  .react-select__control {
    &&& {
      border: 1px solid ${Theme.grayLight};
      border-radius: 5px;
      background-color: #fff;
      transition: border-color 0.2s ease;
      color: ${Theme.text};
      min-height: 40px;
    }
  }
  .react-select__control--is-focused {
    &&& {
      border-color: ${Theme.blue};
      background-color: #fff;
      box-shadow: inset 0 1px 1px rgba(31, 45, 61, 0.075),
        0 0 20px rgba(12, 102, 255, 0.1);
    }
  }
  .react-select__placeholder {
    &&& {
      opacity: 1;
      color: ${Theme.gray};
    }
  }
`;

const themeProp = (theme: SelectTheme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: Theme.blue,
    neutral20: Theme.grayLight,
  },
});

export function Select<T>(props: SelectProps<T>) {
  return (
    <>
      <SelectStyles />
      <ReactSelect<T>
        {...props}
        // menuPortalTarget={document.body}
        placeholder={props.placeholder || 'Select...'}
        theme={themeProp}
        classNamePrefix="react-select"
      />
    </>
  );
}

export function CreatableSelect<T>(props: CreatableSelectProps<T>) {
  return (
    <>
      <SelectStyles />
      <ReactSelectCreatable<T>
        {...props}
        placeholder={props.placeholder || 'Select...'}
        theme={themeProp}
        classNamePrefix="react-select"
      />
    </>
  );
}

export function AsyncSelect<T>(props: AsyncPaginateProps<T>) {
  return (
    <>
      <SelectStyles />
      <AsyncPaginate<T>
        SelectComponent={Select as any}
        {...props}
        placeholder={props.placeholder || 'Select...'}
        theme={themeProp}
        classNamePrefix="react-select"
      />
    </>
  );
}
