import * as React from 'react';
import TetherComponent from 'react-tether';
import styled, { css, keyframes } from 'styled-components';
import { Theme } from '../common/Theme';

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
}

const Label = styled.label`
  font-weight: 500;
  line-height: 19px;
  color: ${Theme.textDark};
`;

const LabelsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 11px;
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

const shakeAnimation = keyframes`
  0% { transform: translate(30px); }
  20% { transform: translate(-30px); }
  40% { transform: translate(15px); }
  60% { transform: translate(-15px); }
  80% { transform: translate(8px); }
  100% { transform: translate(0px); }
`;

const Error = styled.div`
  padding: 0 12px;
  height: 40px;
  display: flex;
  align-items: center;
  background: ${Theme.red};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 4px;
  color: white;
  position: relative;
  animation: ${shakeAnimation} 0.4s 1 linear;
  .tether-target-attached-right & {
    margin-left: 15px;
    &:after {
      right: 100%;
      top: 50%;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: transparent;
      border-right-color: ${Theme.red};
      border-width: 5px;
      margin-top: -5px;
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
    ...rest
  } = props;

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const getInput = (ref: any) => (
    <input
      ref={ref}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      onFocus={() => {
        wrapperRef.current!.classList.add(INPUT_FOCUS_CLASS);
      }}
      onBlur={e => {
        wrapperRef.current!.classList.remove(INPUT_FOCUS_CLASS);
        if (onBlur) {
          onBlur(e);
        }
      }}
      aria-describedby={`${id}_error`}
      {...rest}
    />
  );
  return (
    <TetherComponent
      attachment="bottom left"
      targetAttachment="bottom right"
      constraints={[
        {
          to: 'scrollParent',
          attachment: 'together',
        },
      ]}
      renderTarget={ref => (
        <div className={className} ref={wrapperRef}>
          {(label || rightLabel) && (
            <LabelsWrapper>
              <Label htmlFor={id}>{label}</Label> <div>{rightLabel}</div>
            </LabelsWrapper>
          )}
          {icon ? (
            <InputGroup ref={ref as any}>
              <Prepend>
                <InputGroupText>{icon}</InputGroupText>
              </Prepend>
              {getInput(null)}
            </InputGroup>
          ) : (
            getInput(ref)
          )}
        </div>
      )}
      renderElement={ref =>
        props.state === 'error' && (
          <Error role="alert" id={`${id}_error`} ref={ref as any}>
            {props.feedback}
          </Error>
        )
      }
    />
  );
};

const errorSvgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10,0A10,10,0,1,0,20,10,9.987,9.987,0,0,0,10,0Zm0,16.667a1.333,1.333,0,1,1,1.333-1.333A1.337,1.337,0,0,1,10,16.667ZM11.333,10a1.333,1.333,0,1,1-2.667,0V4.667a1.333,1.333,0,0,1,2.667,0Z" fill="#ff2c4d"/></svg>`;

export const Input = styled(_Input)`
  display: block;
  margin-bottom: 20px;

  input {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    display: block;
    width: 100%;
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

  &.${INPUT_FOCUS_CLASS} {
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
        ${InputGroupText}, input {
          border-color: ${Theme.red};
        }
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
        ${InputGroupText}, input {
          border-color: ${Theme.green2};
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
