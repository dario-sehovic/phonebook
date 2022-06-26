import React, { useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

function Modal({
  open,
  children,
}: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal">
      {children}
    </div>
  );
}

export default Modal;
