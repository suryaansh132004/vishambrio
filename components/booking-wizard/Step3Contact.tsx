'use client';

import React from 'react';
import { BookingFormData } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step3Contact({ formData, updateFormData, nextStep, prevStep }: Props) {
  const isFormValid = formData.riderName && formData.riderPhone && formData.riderEmail;

  return (
    <div className="booking-step active animate-entrance">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-4">Passenger Details</h3>
      <p className="text-slate-500 text-sm mb-6">Verify luggage count to ensure EV trunk availability.</p>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Lead Rider Name</label>
          <input
            type="text"
            value={formData.riderName}
            onChange={(e) => updateFormData({ riderName: e.target.value })}
            placeholder="Arjun Sharma"
            className="wizard-input"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
            <input
              type="tel"
              value={formData.riderPhone}
              // H3 security patch applied: Adding minimal html5 pattern validation for phone input 
              pattern="[0-9]{10,14}" 
              onChange={(e) => updateFormData({ riderPhone: e.target.value })}
              placeholder="9876543210"
              className="wizard-input"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <input
              type="email"
              value={formData.riderEmail}
              onChange={(e) => updateFormData({ riderEmail: e.target.value })}
              placeholder="arjun@gmail.com"
              className="wizard-input"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <input
            id="whatsapp-updates"
            type="checkbox"
            checked={formData.whatsappUpdates}
            onChange={(e) => updateFormData({ whatsappUpdates: e.target.checked })}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="whatsapp-updates" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            Send tickets & driver alerts via WhatsApp ✉️
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Train / Flight Number (Optional)</label>
          <input
            type="text"
            value={formData.transitNumber}
            onChange={(e) => updateFormData({ transitNumber: e.target.value })}
            placeholder="e.g. 12425 Jammu Rajdhani"
            className="wizard-input"
          />
        </div>

        {/* Luggage Counters */}
        <div className="relative py-4 px-5 bg-slate-50 rounded-2xl flex justify-between items-center gap-6">
          <div className={`luggage-tooltip ${formData.suitcases > 2 ? 'show' : ''}`}>
            EV trunk space is optimized for 2 large suitcases. Excess luggage may need to be placed in the cabin.
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Large Suitcases</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateFormData({ suitcases: Math.max(0, formData.suitcases - 1) })}
                className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm"
              >
                -
              </button>
              <span className="font-headline font-extrabold text-lg text-emerald-950">{formData.suitcases}</span>
              <button
                onClick={() => updateFormData({ suitcases: Math.max(0, formData.suitcases + 1) })}
                className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-1 border-l pl-6 border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Handbags</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateFormData({ handbags: Math.max(0, formData.handbags - 1) })}
                className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm"
              >
                -
              </button>
              <span className="font-headline font-extrabold text-lg text-emerald-950">{formData.handbags}</span>
              <button
                onClick={() => updateFormData({ handbags: Math.max(0, formData.handbags + 1) })}
                className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button onClick={prevStep} className="col-span-1 border-2 border-outline-variant font-bold rounded-xl py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={!isFormValid}
            className="col-span-2 btn-primary-gradient text-on-primary font-headline font-bold rounded-xl py-3 shadow-lg active:scale-98 transition-all disabled:opacity-50"
          >
            Confirm Route Map
          </button>
        </div>
      </div>
    </div>
  );
}
