import React from 'react';

interface ConfirmModalProps {
  desc: string;
  onClose(): void;
  onConfirm(): void;
}

export function ConfirmModal(props: ConfirmModalProps) {
  const { desc, onClose, onConfirm } = props;
  return (
    <>
      <div className="alpha"></div>
      <div className="modal">
        <div className="modal__content" data-test="modal">
          <h2 className="modal__title">Confirm</h2>
          <div className="modal__desc">
            <span data-test="desc">{desc}</span>
          </div>
          <div className="modal__buttons">
            <button
              data-test="yes-btn"
              className="btn btn-primary"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              data-test="no-btn"
              className="btn btn-primary"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
