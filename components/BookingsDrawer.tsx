'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingsContext';
import { Booking } from '@/lib/types';
import CustomDialog from './CustomDialog';

export default function BookingsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-bookings-drawer', handleOpen);
    return () => window.removeEventListener('open-bookings-drawer', handleOpen);
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

  const handleCancel = (id: string) => {
    setCancelConfirmId(id);
  };

  const activeBookings = bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Driver Assigned' || b.status === 'En Route'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'Completed' || b.status === 'Cancelled'
  );

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
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl z-[99999] transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Your Bookings Drawer"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3 text-emerald-950">
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">receipt_long</span>
            <h2 className="font-headline font-extrabold text-xl tracking-tight">Your Bookings</h2>
          </div>
          <button
            onClick={closeDrawer}
            className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Close Bookings Drawer"
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface-container-lowest">
          {!user ? (
            <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 shadow-inner">
                <span className="material-symbols-outlined text-4xl" aria-hidden="true">account_circle</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-xl text-slate-800">Exclusive Bookings</h3>
                <p className="text-slate-500 text-sm max-w-[280px] leading-relaxed mx-auto">
                  Please log in or sign up to view, manage, and book your sustainable Himalayan travels.
                </p>
              </div>

              <div className="w-full bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-4 text-xs font-semibold text-emerald-900 text-left space-y-2 leading-relaxed">
                <p className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">eco</span> Personalized green carbon footprints
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">history</span> Full mountain travel invoice histories
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">notifications</span> Real-time driver SMS and WhatsApp tracking
                </p>
              </div>

              <Link
                href="/login"
                onClick={closeDrawer}
                className="w-full block text-center btn-primary-gradient text-on-primary py-3.5 rounded-xl font-headline font-bold active:scale-98 transition-all shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                Log In / Sign Up
              </Link>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">calendar_today</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-slate-800">No Bookings Yet</h3>
              <p className="text-slate-500 text-sm max-w-[240px]">
                Hi {user.name.split(' ')[0]}, you haven't booked any green trips yet. Plan your ride in the booking wizard to start!
              </p>
            </div>
          ) : (
            <>
              {activeBookings.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Active Bookings</h3>
                  <div className="space-y-4">
                    {activeBookings.map((b) => (
                      <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                    ))}
                  </div>
                </div>
              )}

              {pastBookings.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Past History</h3>
                  <div className="space-y-4">
                    {pastBookings.map((b) => (
                      <BookingCard key={b.id} booking={b} isPast />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CustomDialog
        isOpen={cancelConfirmId !== null}
        title="Cancel Trip"
        message="Are you sure you want to cancel this booking? This will immediately notify your assigned driver."
        type="confirm"
        onConfirm={() => {
          if (cancelConfirmId) {
            cancelBooking(cancelConfirmId);
            setCancelConfirmId(null);
          }
        }}
        onCancel={() => setCancelConfirmId(null)}
      />
    </>
  );
}

function BookingCard({ booking, isPast = false, onCancel }: { booking: Booking; isPast?: boolean; onCancel?: (id: string) => void }) {
  return (
    <div className={`bg-white rounded-2xl border-2 ${isPast ? 'border-slate-100' : 'border-emerald-100'} p-5 shadow-sm space-y-4 relative overflow-hidden transition-all hover:shadow-md`}>
      {!isPast && <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-extrabold tracking-wider text-slate-400 block uppercase">Booking ID</span>
          <span className="font-headline font-bold text-slate-900">{booking.id}</span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            booking.status === 'Cancelled' ? 'bg-red-50 text-red-600' : isPast ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 border-l-2 border-slate-100 pl-3">
        <div className="text-sm">
          <span className="text-xs font-bold text-slate-400 block">Pick-up</span>
          <span className="font-semibold text-slate-800">{booking.pickup}</span>
        </div>
        <div className="text-sm">
          <span className="text-xs font-bold text-slate-400 block">Drop-off</span>
          <span className="font-semibold text-slate-800">{booking.drop}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 pt-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date & Time</span>
          <span className="text-slate-800 font-bold">{booking.date} • {booking.time}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle</span>
          <span className="text-slate-800 font-bold">{booking.vehicle}</span>
        </div>
      </div>

      {!isPast && onCancel && (
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="font-headline font-extrabold text-primary">{booking.fare}</span>
          {/* M2 Fix: inline cancellation button */}
          <button
            onClick={() => onCancel(booking.id)}
            className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded px-1.5 py-0.5"
          >
            Cancel Trip
          </button>
        </div>
      )}
    </div>
  );
}
