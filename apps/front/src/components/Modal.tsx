import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { VoidLink } from './VoidLink';
import { CloseIcon } from 'src/icons/CloseIcon';
import { Theme } from 'ui';
import { FocusContainer } from './FocusContainer';

interface ModalProps {
  transparent?: boolean;
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
  maxHeight?: string;
}

const GlobalStyle = createGlobalStyle`
.modal-enter {
  opacity: 0.01;
}

.modal-enter.modal-enter-active {
  opacity: 1;
  transition: opacity 150ms ease-in-out;
}

.modal-leave {
  opacity: 1;
}

.modal-leave.modal-leave-active {
  opacity: 0.01;
  transition: opacity 150ms ease-in-out;
}

.modal-open {
  overflow: hidden
}

`;

const ModalContent = styled.div`
  width: 80vw;
  background: white;
  border-radius: 4px;
  position: relative;
  outline: none;
`;

const ModalBody = styled.div`
  max-height: 80vh;
  overflow: auto;
  transition: max-height 0.2s ease-in-out;
  pre[class*='language-'] {
    margin: 0;
    max-height: 80vh;
    overflow: auto;
  }
`;

const Close = styled(VoidLink)`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 7px;
  top: 7px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

export function Modal(props: ModalProps) {
  const { isOpen, close, children, transparent, size, maxHeight } = props;

  const modalRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return () => {
        //
      };
    }

    document.body.classList.add('modal-open');
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keyup', onKeyPress);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpen]);

  React.useLayoutEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <GlobalStyle />
      <ReactCSSTransitionGroup
        transitionName="modal"
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}
      >
        {isOpen && (
          <Wrapper
            data-modal-wrapper
            onClick={e => {
              const target = e.target as HTMLDivElement;
              if (target.hasAttribute('data-modal-wrapper')) {
                close();
              }
            }}
          >
            <FocusContainer data-focus-root>
              <ModalContent
                ref={modalRef}
                style={{
                  background: transparent ? 'transparent' : 'white',
                  maxWidth:
                    size === 'md' ? 800 : size === 'sm' ? 460 : undefined,
                }}
                tabIndex={-1}
                role="modal"
              >
                <Close onClick={close} aria-label="close">
                  <CloseIcon scale={1.3} color={Theme.text} />
                </Close>

                <ModalBody
                  style={{
                    maxHeight,
                  }}
                >
                  {children}
                </ModalBody>
              </ModalContent>
            </FocusContainer>
          </Wrapper>
        )}
      </ReactCSSTransitionGroup>
    </>
  );
}
