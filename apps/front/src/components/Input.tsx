import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../common/Theme';

const INPUT_FOCUS_CLASS = 'input-focus';

interface InputProps {
  className?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<any>;
  icon?: React.ReactNode;
  type?: string;
  state?: 'valid' | 'error';
  feedback?: string;
}

const Label = styled.label`
  font-size: 0.675rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #3c4858;
`;

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

const Feedback = styled.div`
  font-size: 80%;
  width: 100%;
  margin-top: 4px;
`;

const _Input = (props: InputProps) => {
  const {
    className,
    value,
    label,
    onChange,
    placeholder,
    icon,
    type,
    feedback,
    state,
  } = props;

  const wrapperRef = React.useRef<HTMLInputElement | null>(null);

  const input = (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      onFocus={() => {
        wrapperRef.current!.classList.add(INPUT_FOCUS_CLASS);
      }}
      onBlur={() => {
        wrapperRef.current!.classList.remove(INPUT_FOCUS_CLASS);
      }}
    />
  );

  return (
    <div className={className} ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      {icon ? (
        <InputGroup>
          <Prepend>
            <InputGroupText>{icon}</InputGroupText>
          </Prepend>
          {input}
        </InputGroup>
      ) : (
        input
      )}
      {feedback && <Feedback>{feedback}</Feedback>}
    </div>
  );
};

export const Input = styled(_Input)`
  display: block;
  margin-bottom: 16px;

  input {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    display: block;
    width: 100%;
    height: calc(1.5em + 1.5rem + 2px);
    padding: 0.75rem 1.25rem;
    transition: all 0.2s ease;
    color: #8492a6;
    border: 1px solid #e0e6ed;
    border-radius: 0.375rem;
    background-color: #fff;
    background-clip: padding-box;
    box-shadow: inset 0 1px 1px rgba(31, 45, 61, 0.075);

    &::placeholder {
      opacity: 1;
      color: #aabacd;
    }
  }

  &.${INPUT_FOCUS_CLASS} {
    input {
      color: #8492a6;
      border-color: rgba(12, 102, 255, 0.5);
      outline: 0;
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
        ${Feedback} {
          color: ${Theme.bgDanger};
        }

        ${InputGroupText}, input {
          border-color: ${Theme.bgDanger};
        }
        input {
          padding-right: 32px;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23FF5C75' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23FF5C75' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E");
          background-repeat: no-repeat;
          background-position: center right 12px;
          background-size: 24px 24px;
        }
      `}

    ${props =>
      props.state === 'valid' &&
      css`
        ${Feedback} {
          color: ${Theme.bgSuccess};
        }
        ${InputGroupText}, input {
          border-color: ${Theme.bgSuccess};
        }
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
