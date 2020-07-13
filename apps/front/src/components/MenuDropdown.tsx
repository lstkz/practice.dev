import React from 'react';
import styled from 'styled-components';
import * as PopperJS from 'popper.js';
import { Manager, Reference, Popper } from 'react-popper';
import { Transition } from 'react-spring/renderprops';

const DropdownWrapper = styled.div`
  box-shadow: 0px 1px 3px #00000017;
  border-radius: 4px;
  background-color: #fff;
  text-align: left;
  z-index: 100;
`;

interface MenuDropdownProps {
  children: React.ReactElement;
  dropdown: React.ReactNode;
  placement?: PopperJS.Placement;
  testId?: string;
}

function isClickable(node: HTMLElement | null): boolean {
  if (!node) {
    return false;
  }
  if (node.tagName === 'A' || node.tagName === 'BUTTON') {
    return true;
  }
  return isClickable(node.parentElement);
}

export function MenuDropdown(props: MenuDropdownProps) {
  const { children, dropdown, placement, testId } = props;
  const [isOpen, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onClick = () => {
      if (isOpen) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [isOpen]);
  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          React.cloneElement(children, {
            'data-dropdown-toggle': true,
            'data-test': testId,
            ref: ref,
            onClick: () => {
              setOpen(!isOpen);
            },
          })
        }
      </Reference>
      <Transition
        items={isOpen}
        config={(_, state) =>
          state === 'leave' ? { duration: 0 } : { duration: 200 }
        }
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {open =>
          open &&
          (animatedStyle => (
            <Popper
              modifiers={{
                preventOverflow: {
                  enabled: true,
                  boundariesElement: document.body,
                },
              }}
              placement={placement || 'bottom-start'}
            >
              {({ ref, style, placement: _placement }) => (
                <DropdownWrapper
                  ref={ref}
                  style={{ ...style, ...(open ? animatedStyle : {}) }}
                  data-placement={_placement}
                  onClick={e => {
                    if (isClickable(e.target as any)) {
                      return;
                    }
                    e.nativeEvent.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  {dropdown}
                </DropdownWrapper>
              )}
            </Popper>
          ))
        }
      </Transition>
    </Manager>
  );
}
