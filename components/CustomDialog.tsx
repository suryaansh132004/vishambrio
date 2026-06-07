'use client';

import React, { useEffect, useRef } from 'react';

interface CustomDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'alert' | 'confirm';
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function CustomDialog({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel,
}: CustomDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (type === 'confirm' && onCancel) {
          onCancel();
        } else {
          onConfirm();
        }
      }
      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Focus the primary action button on mount after layout
    const timer = setTimeout(() => {
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [tabindex="0"]'
      );
      if (focusableElements && focusableElements.length > 0) {
        // Focus the last button (e.g. Confirm or Okay) by default
        focusableElements[focusableElements.length - 1].focus();
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, type, onConfirm, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-sm bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 space-y-6 animate-entrance"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-950">
            <span className="material-symbols-outlined text-emerald-600 text-2xl" aria-hidden="true">
              {type === 'confirm' ? 'help_outline' : 'info'}
            </span>
            <h3 id="dialog-title" className="font-headline font-extrabold text-xl tracking-tight">
              {title}
            </h3>
          </div>
          <p id="dialog-desc" className="text-sm font-semibold text-slate-500 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3">
          {type === 'confirm' && onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 border-2 border-outline-variant hover:bg-slate-50 text-slate-600 rounded-xl font-headline font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 btn-primary-gradient text-on-primary rounded-xl font-headline font-bold text-sm transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            {type === 'confirm' ? 'Confirm' : 'Okay'}
          </button>
        </div>
      </div>
    </div>
  );
}
