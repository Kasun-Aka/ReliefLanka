import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
      <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
          variant="danger"
          onClick={onConfirm}
          className="border-signal-600 bg-signal-600 text-white hover:bg-signal-700 hover:text-white">
          
            {confirmLabel}
          </Button>
        </>
      }>
      
      <p className="text-sm leading-relaxed text-ink-muted">{message}</p>
    </Modal>);

}