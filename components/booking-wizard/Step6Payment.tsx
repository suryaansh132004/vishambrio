'use client';

import React, { useState } from 'react';
import { BookingFormData, Booking } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingsContext';
import { useRouter } from 'next/navigation';
import CustomDialog from '../CustomDialog';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setConfirmedBookingId: (id: string) => void;
}

export default function Step6Payment({ formData, updateFormData, nextStep, prevStep, setConfirmedBookingId }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; title: string; message: string } | null>(null);
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const router = useRouter();

  const handlePaymentSelect = (method: 'upi' | 'card' | 'partial') => {
    updateFormData({ paymentMethod: method });
  };

  const getPaymentDesc = () => {
    switch (formData.paymentMethod) {
      case 'upi': return 'UPI Intent flow will launch Google Pay, PhonePe, or Paytm instantly on your mobile device. Fast & 100% secure.';
      case 'card': return 'Accepts Visa, Mastercard, RuPay, and Netbanking via a secure 256-bit SSL gateway transaction.';
      case 'partial': return 'Pay a ₹500 token booking deposit now via UPI. Secure the reservation, and pay the remaining balance to your driver upon trip completion.';
    }
  };

  const amountPayable = formData.paymentMethod === 'partial' ? 500 : formData.totalFare;

  const triggerPayment = () => {
    // H4 Security Patch: Re-verify login state right before payment
    if (!user) {
      setAlertDialog({
        isOpen: true,
        title: 'Authentication Required',
        message: 'Your session has expired or you are not logged in. Please log in to complete your secure payment transaction.'
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // H5 Security Patch: Timestamp-based booking ID to avoid collision
      const ts = Date.now().toString(36).toUpperCase();
      const rand = Math.floor(100 + Math.random() * 900);
      const randomId = `EV-HP-${ts}-${rand}`;

      const bookingData: Booking = {
        id: randomId,
        name: formData.riderName || user.name,
        phone: formData.riderPhone,
        email: formData.riderEmail || user.email,
        date: formData.date,
        time: formData.time,
        pickup: formData.pickupLabel,
        drop: formData.dropLabel,
        vehicle: formData.fleet === 'nexon' ? 'Tata Nexon EV' : 'Tata XPRES-T EV',
        fare: `₹${formData.totalFare.toLocaleString('en-IN')}`,
        status: 'Confirmed',
        timestamp: Date.now(),
        otp: Math.floor(1000 + Math.random() * 9000),
      };

      addBooking(bookingData);
      setConfirmedBookingId(randomId);
      
      // Clean up any temp booking
      if (typeof window !== 'undefined') {
         localStorage.removeItem('vishambrio_temp_booking');
      }

      nextStep();
    }, 2500);
  };

  return (
    <div className="booking-step active animate-entrance relative">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-4">Secure Payment</h3>
      <p className="text-slate-500 text-sm mb-6">Select your preferred secure payment method.</p>

      <div className="space-y-4">
        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Instant Mobile UPI</label>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select secure payment method">
            {/* H1 Security Patch: Event is handled implicitly by React, no global window.event issues */}
            <div 
              onClick={() => handlePaymentSelect('upi')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePaymentSelect('upi');
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked={formData.paymentMethod === 'upi'}
              className={`rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${formData.paymentMethod === 'upi' ? 'border-primary bg-emerald-50/40' : 'border-outline-variant hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-lg mb-1 text-slate-500" aria-hidden="true">smartphone</span>
              <span className="text-[10px] font-bold text-slate-600">UPI App</span>
            </div>
            <div 
              onClick={() => handlePaymentSelect('card')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePaymentSelect('card');
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked={formData.paymentMethod === 'card'}
              className={`rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${formData.paymentMethod === 'card' ? 'border-primary bg-emerald-50/40' : 'border-outline-variant hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-lg mb-1 text-slate-500" aria-hidden="true">credit_card</span>
              <span className="text-[10px] font-bold text-slate-600">Card</span>
            </div>
            <div 
              onClick={() => handlePaymentSelect('partial')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePaymentSelect('partial');
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked={formData.paymentMethod === 'partial'}
              className={`rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${formData.paymentMethod === 'partial' ? 'border-primary bg-emerald-50/40' : 'border-outline-variant hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-lg mb-1 text-slate-500" aria-hidden="true">payments</span>
              <span className="text-[10px] font-bold text-slate-600">Token</span>
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div className="p-4 bg-slate-50 rounded-xl text-xs leading-relaxed text-slate-500 font-semibold">
          {getPaymentDesc()}
        </div>

        {/* Amount to pay */}
        <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-sm font-bold">
          <span className="text-slate-500">Amount Payable Now:</span>
          <span className="text-primary text-lg font-headline">₹{amountPayable.toLocaleString('en-IN')}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button onClick={prevStep} disabled={isProcessing} className="col-span-1 border-2 border-outline-variant font-bold rounded-xl py-3 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
            Back
          </button>
          <button onClick={triggerPayment} disabled={isProcessing} className="col-span-2 btn-primary-gradient text-on-primary font-headline font-bold rounded-xl py-3 shadow-lg active:scale-98 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            Complete Secure Payment
          </button>
        </div>
      </div>

      {/* Payment Loader Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/95 rounded-[32px] flex flex-col items-center justify-center space-y-4 z-50 animate-fade-in -m-8 md:-m-10 p-8">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-headline font-bold text-emerald-950 text-lg">Contacting secure gateway...</p>
          <p className="text-slate-400 text-xs font-semibold">Do not close or reload this window</p>
        </div>
      )}

      <CustomDialog
        isOpen={alertDialog !== null}
        title={alertDialog?.title || ''}
        message={alertDialog?.message || ''}
        type="alert"
        onConfirm={() => {
          setAlertDialog(null);
          // Redirect on confirm
          if (typeof window !== 'undefined') {
             localStorage.setItem('vishambrio_temp_booking', JSON.stringify(formData));
          }
          router.push('/login?redirect=/&step=6');
        }}
      />
    </div>
  );
}
