import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { VoidLink } from './VoidLink';
import { CloseIcon } from 'src/icons/CloseIcon';
import { FocusContainer } from './FocusContainer';
import { modalGlobalContext } from './ModalGlobalContext';
import { MOBILE, Theme } from 'src/Theme';

interface ModalProps {
  transparent?: boolean;
  isOpen: boolean;
  close: (source: 'close-button' | 'background' | 'esc') => void;
  children: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
  maxHeight?: string;
  noBackgroundClose?: boolean;
  testId?: string;
}

const GlobalStyle = createGlobalStyle`
.modal-enter {
  opacity: 0.01; 
}

.modal-enter.modal-enter-active {
  opacity: 1;
  transition: opacity 150ms ease-in-out;
}

.modal-exit {
  opacity: 1;
}

.modal-exit.modal-exit-active {
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

  ${MOBILE} {
    width: 95vw;
  }
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
  const {
    isOpen,
    close,
    children,
    transparent,
    size,
    maxHeight,
    noBackgroundClose,
    testId,
  } = props;

  const modalRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return () => {
        //
      };
    }

    const alreadyOpen = document.body.classList.contains('modal-open');
    if (!alreadyOpen) {
      document.body.classList.add('modal-open');
    }
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        close('esc');
      }
    };
    modalGlobalContext.addListener(onKeyPress);
    return () => {
      if (!alreadyOpen) {
        document.body.classList.remove('modal-open');
      }
      modalGlobalContext.removeListener(onKeyPress);
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
      <CSSTransition
        in={isOpen}
        classNames="modal"
        timeout={150}
        unmountOnExit
        mountOnEnter
      >
        <Wrapper
          data-modal-wrapper
          onClick={e => {
            const target = e.target as HTMLDivElement;
            if (
              target.hasAttribute('data-modal-wrapper') &&
              !noBackgroundClose
            ) {
              close('background');
            }
          }}
        >
          <FocusContainer data-focus-root>
            <div ref={modalRef}></div>
            <ModalContent
              data-test={testId}
              ref={modalRef as any}
              style={{
                background: transparent ? 'transparent' : 'white',
                maxWidth: size === 'md' ? 800 : size === 'sm' ? 460 : undefined,
              }}
              tabIndex={-1}
              role="modal"
            >
              <Close
                data-test="close-btn"
                onClick={() => close('close-button')}
                aria-label="close"
              >
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
      </CSSTransition>
    </>
  );
}
