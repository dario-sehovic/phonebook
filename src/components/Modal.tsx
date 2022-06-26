import React from 'react';

export interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

function Modal({
  open,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal">
      {children}
    </div>
  );
}

export default Modal;
