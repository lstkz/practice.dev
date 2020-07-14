import * as React from 'react';
import * as PopperJS from 'popper.js';
import styled, { css, keyframes } from 'styled-components';
import { Manager, Reference, Popper } from 'react-popper';
import { Theme } from 'src/Theme';
import { Portal } from './Portal';
import { useIsMobile } from 'src/hooks/useIsMobile';

const shakeAnimation = keyframes`
  0% { transform: translate(30px); }
  20% { transform: translate(-30px); }
  40% { transform: translate(15px); }
  60% { transform: translate(-15px); }
  80% { transform: translate(8px); }
  100% { transform: translate(0px); }
`;

const ErrorPopup = styled.div`
  z-index: 100;
`;

const Error = styled.div<{ placement?: PopperJS.Placement }>`
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
  ${props =>
    props.placement === 'right' &&
    css`
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
    `}
`;

const InlineError = styled.div`
  background: ${Theme.red};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 4px;
  border-radius: 4px;
  padding: 0 12px;
  height: 40px;
  display: flex;
  align-items: center;
  color: white;
  margin-bottom: 15px;
  margin-top: -15px;
`;

interface ErrorTooltip {
  id: string;
  isVisible: boolean;
  error?: string | string;
  children: (props: { ref: React.Ref<any> }) => React.ReactNode;
  testId?: string;
}

export function ErrorTooltip(props: ErrorTooltip) {
  const { isVisible, error, children, id, testId } = props;
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <>
        {children({ ref: () => {} })}
        {isVisible && (
          <InlineError data-test={testId} role="alert" id={id}>
            {error}
          </InlineError>
        )}
      </>
    );
  }

  return (
    <Manager>
      <Reference>{children}</Reference>
      <Portal>
        <Popper
          placement="right"
          modifiers={{
            preventOverflow: {
              boundariesElement: document.body,
            },
          }}
        >
          {({ ref, style, placement }) => {
            if (!isVisible) {
              return null;
            } else {
              return (
                <ErrorPopup style={style}>
                  <Error
                    data-test={testId}
                    role="alert"
                    id={id}
                    ref={ref as any}
                    placement={placement}
                  >
                    {error}
                  </Error>
                </ErrorPopup>
              );
            }
          }}
        </Popper>
      </Portal>
    </Manager>
  );
}
