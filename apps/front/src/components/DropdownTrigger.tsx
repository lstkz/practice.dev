import React from 'react';
import * as PopperJS from 'popper.js';
import { Manager, Reference, Popper } from 'react-popper';
import { Transition } from 'react-spring/renderprops';
import ReactDOM from 'react-dom';

interface DropdownTriggerProps {
  children: React.ReactElement;
  dropdown: React.ReactElement;
  placement?: PopperJS.Placement;
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

export function MenuDropdown(props: DropdownTriggerProps) {
  const { children, dropdown, placement } = props;
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
            ref,
            onClick: () => {
              console.log('a');
              setOpen(!isOpen);
            },
          })
        }
      </Reference>
      {ReactDOM.createPortal(
        <Transition
          items={isOpen}
          config={(item, state) =>
            state === 'leave' ? { duration: 0 } : { duration: 200 }
          }
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {open =>
            open &&
            (animatedStyle => (
              <Popper placement={placement || 'bottom-start'}>
                {({ ref, style, placement: _placement, arrowProps }) =>
                  React.cloneElement(dropdown, {
                    ref: ref,
                    style: { ...style, ...(open ? animatedStyle : {}) },
                    'data-placement': _placement,
                    onClick: (e: any) => {
                      if (isClickable(e.target as any)) {
                        return;
                      }
                      e.nativeEvent.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    },
                  })
                }
              </Popper>
            ))
          }
        </Transition>,
        document.querySelector('#portals')!
      )}
    </Manager>
  );
}
