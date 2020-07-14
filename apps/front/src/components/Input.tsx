import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../Theme';
import { ErrorTooltip } from './ErrorTooltip';
import { FormLabel } from './FormLabel';
import { FormDescription } from './FormDescription';

const INPUT_FOCUS_CLASS = 'input-focus';

export interface InputProps {
  id: string;
  className?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<any>;
  icon?: React.ReactNode;
  rightLabel?: React.ReactNode;
  type?: string;
  state?: 'valid' | 'error';
  feedback?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  maxLength?: number;
  multiline?: boolean;
  description?: React.ReactNode;
  testId?: string;
  style?: object;
}

const Prepend = styled.div`
  margin-right: -1px;
  display: flex;
`;

const InputGroupText = styled.span`
  transition: all 0.2s ease;
  color: #aabacd;
  border: 1px solid #e0e6ed;
  background-color: #fff;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  display: flex;
  margin-bottom: 0;
  padding: 0.75rem 1.25rem;
  text-align: center;
  white-space: nowrap;
  border-radius: 0.375rem;
  align-items: center;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: stretch;

  &&& {
    input {
      position: relative;
      width: 1%;
      margin-bottom: 0;
      flex: 1 1 auto;
      box-shadow: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: 0;
      border-left: 0;
    }

    ${InputGroupText} {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
`;

const _Input = (props: InputProps) => {
  const {
    className,
    value,
    label,
    rightLabel,
    onChange,
    placeholder,
    icon,
    type,
    feedback,
    state,
    onBlur,
    id,
    maxLength,
    multiline,
    description,
    testId,
    ...rest
  } = props;

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const getInput = (ref: any) => {
    const inputProps = {
      ref: ref,
      id: id,
      value: value,
      onChange: onChange,
      placeholder: placeholder,
      type: type,
      onFocus: () => {
        wrapperRef.current?.classList.add(INPUT_FOCUS_CLASS);
      },
      onBlur: (e: any) => {
        wrapperRef.current?.classList.remove(INPUT_FOCUS_CLASS);
        if (onBlur) {
          onBlur(e);
        }
      },
      maxLength: maxLength,
      'aria-describedby': `${id}_error`,
      'data-test': testId,
      ...rest,
    };
    if (multiline) {
      return <textarea {...inputProps} />;
    } else {
      return <input {...inputProps} />;
    }
  };

  return (
    <ErrorTooltip
      id={`${id}_error`}
      testId={testId ? `${testId}_error` : undefined}
      error={props.feedback}
      isVisible={props.state === 'error'}
    >
      {({ ref }) => (
        <div className={className} ref={wrapperRef}>
          {(label || rightLabel) && (
            <FormLabel id={id} label={label} rightLabel={rightLabel} />
          )}
          {icon ? (
            <InputGroup ref={ref}>
              <Prepend>
                <InputGroupText>{icon}</InputGroupText>
              </Prepend>
              {getInput(null)}
            </InputGroup>
          ) : (
            getInput(ref)
          )}
          {description && <FormDescription>{description}</FormDescription>}
        </div>
      )}
    </ErrorTooltip>
  );
};

const errorSvgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10,0A10,10,0,1,0,20,10,9.987,9.987,0,0,0,10,0Zm0,16.667a1.333,1.333,0,1,1,1.333-1.333A1.337,1.337,0,0,1,10,16.667ZM11.333,10a1.333,1.333,0,1,1-2.667,0V4.667a1.333,1.333,0,0,1,2.667,0Z" fill="#ff2c4d"/></svg>`;

export const Input = styled(_Input)`
  display: block;
  margin-bottom: 20px;

  textarea,
  input {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    display: block;
    width: 100%;
    max-width: 100%;
    height: 40px;
    padding: 10px;
    transition: border-color 0.2s ease;
    color: ${Theme.text};
    border: 1px solid ${Theme.grayLight};
    border-radius: 5px;
    background-color: #fff;
    background-clip: padding-box;
    outline: none;

    &::placeholder {
      opacity: 1;
      color: ${Theme.gray};
    }
  }

  textarea {
    height: auto;
    min-height: 80px;
  }

  &.${INPUT_FOCUS_CLASS} {
    textarea,
    input {
      border-color: ${Theme.blue};
      background-color: #fff;
      box-shadow: inset 0 1px 1px rgba(31, 45, 61, 0.075),
        0 0 20px rgba(12, 102, 255, 0.1);
    }
    ${InputGroupText} {
      border-color: rgba(12, 102, 255, 0.5);
    }

    ${InputGroup} {
      box-shadow: inset 0 1px 1px rgba(31, 45, 61, 0.075),
        0 0 20px rgba(12, 102, 255, 0.1);
    }
  }

  &,
  &.${INPUT_FOCUS_CLASS} {
    ${props =>
      props.state === 'error' &&
      css`
        ${InputGroupText},
        textarea,
        input {
          border-color: ${Theme.red};
        }
        textarea,
        input {
          padding-right: 32px;
        background-image: url("data:image/svg+xml,${encodeURIComponent(
          errorSvgIcon
        )}");
          background-repeat: no-repeat;
          background-position: center right 12px;
          background-size: 20px 20px;
        }
      `}

    ${props =>
      props.state === 'valid' &&
      css`
        ${InputGroupText},
        textarea,
        input {
          border-color: ${Theme.green2};
        }
        textarea,
        input {
          padding-right: 32px;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%232DCA8C' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: center right 12px;
          background-size: 24px 24px;
        }
      `}
  }
`;
