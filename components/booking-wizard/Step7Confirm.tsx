'use client';

import React from 'react';
import { BookingFormData } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  confirmedBookingId: string | null;
  resetWizard: () => void;
}

export default function Step7Confirm({ formData, confirmedBookingId, resetWizard }: Props) {
  const vehicleName = formData.fleet === 'nexon' ? 'Nexon EV' : 'XPRES-T EV';
  
  const whatsappMsg = `"Hello ${formData.riderName}, your eco-friendly ${vehicleName} ride from ${formData.pickupLabel} is confirmed for ${formData.date} at ${formData.time}. Transit ID: ${confirmedBookingId}. Driver details will be sent 2 hours prior. Present this digital boarding pass upon arrival to comply with station pre-booking transit laws."`;

  return (
    <div className="booking-step active animate-entrance">
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-headline font-extrabold text-emerald-950">Booking Confirmed!</h3>
          <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Your green ride is secured 🌱</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl inline-block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Booking Transit ID</span>
          <span className="font-headline font-extrabold text-lg text-emerald-950">{confirmedBookingId || 'PROCESSING...'}</span>
        </div>

        {/* WhatsApp Notification Mockup */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-left text-xs text-emerald-950 font-semibold space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-100/50 pb-2">
            <span className="text-emerald-700 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-sm">chat</span> WhatsApp Alert Sent
            </span>
            <span className="text-[10px] text-slate-400">Just Now</span>
          </div>
          <p className="leading-relaxed text-emerald-900 italic">
            {whatsappMsg}
          </p>
        </div>

        <button 
          onClick={resetWizard}
          className="w-full btn-primary-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg active:scale-98 transition-all shadow-lg"
        >
          Book Another Ride
        </button>
      </div>
    </div>
  );
}
