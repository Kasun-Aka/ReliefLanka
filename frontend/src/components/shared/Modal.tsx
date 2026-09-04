import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg';
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  width = 'md'
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
          className="fixed inset-0 bg-brand-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={`relative z-10 w-full ${
          width === 'lg' ? 'max-w-3xl' : 'max-w-xl'} rounded-lg border border-line bg-surface shadow-raised`
          }
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.985 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
            <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-ink">{title}</h2>
                {description &&
              <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
              }
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded p-1 text-ink-faint transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
            {footer &&
          <div className="flex items-center justify-end gap-2 border-t border-line bg-subtle px-5 py-3">
                {footer}
              </div>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}