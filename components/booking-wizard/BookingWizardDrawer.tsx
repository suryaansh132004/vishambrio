'use client';

import React, { useEffect, useState, useRef } from 'react';
import BookingWizard from './BookingWizard';

export default function BookingWizardDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-booking-wizard', handleOpen);

    // Auto-open drawer if pickup/drop are present in query parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pickup = params.get('pickup');
      const drop = params.get('drop');
      if (pickup || drop) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-booking-wizard', { detail: { pickup, drop } }));
          // Clean up URL search query parameters
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }, 150);
      }
    }

    return () => window.removeEventListener('open-booking-wizard', handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
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

    const previousActiveElement = document.activeElement as HTMLElement;

    const timer = setTimeout(() => {
      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[99999] transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Booking Wizard Drawer"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant bg-surface">
          <div className="flex items-center gap-3 text-emerald-950">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">local_taxi</span>
            <h2 className="font-headline font-extrabold text-xl tracking-tight">Book a Green E-Taxi</h2>
          </div>
          <button
            onClick={closeDrawer}
            className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
            aria-label="Close Booking Wizard"
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-surface">
          <BookingWizard isDrawer={true} />
        </div>
      </div>
    </>
  );
}
