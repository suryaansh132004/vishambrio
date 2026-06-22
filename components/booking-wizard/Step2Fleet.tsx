'use client';

import React from 'react';
import { BookingFormData, PRICING_MATRIX } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step2Fleet({ formData, updateFormData, nextStep, prevStep }: Props) {
  const baseNexon = formData.pickup && formData.drop 
    ? (PRICING_MATRIX[formData.pickup]?.[formData.drop] || 2150) 
    : 2150;
  
  const baseXprest = Math.round(baseNexon * 0.82);

  return (
    <div className="booking-step active animate-entrance">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-4">Select Electric Ride</h3>
      <p className="text-slate-500 text-sm mb-6">100% emission-free travel. Trunks are optimized for battery placement.</p>

      <div className="space-y-4" role="radiogroup" aria-label="Select Electric Ride">
        {/* Vehicle 1: Nexon EV */}
        <div 
          onClick={() => updateFormData({ fleet: 'nexon' })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              updateFormData({ fleet: 'nexon' });
            }
          }}
          tabIndex={0}
          role="radio"
          aria-checked={formData.fleet === 'nexon'}
          className={`fleet-selection-card p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${formData.fleet === 'nexon' ? 'selected' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg text-emerald-950">Tata Nexon EV</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">SUV</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">person</span>
                  4 Seat
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">luggage</span>
                  2 Large + 2 Hand
                </span>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">eco</span>
                <span>100% Electric - Zero Emissions</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Base Fare</div>
              <div className="text-2xl font-headline font-extrabold text-primary">₹{baseNexon.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Vehicle 2: XPRES-T EV */}
        <div 
          onClick={() => updateFormData({ fleet: 'xprest' })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              updateFormData({ fleet: 'xprest' });
            }
          }}
          tabIndex={0}
          role="radio"
          aria-checked={formData.fleet === 'xprest'}
          className={`fleet-selection-card p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${formData.fleet === 'xprest' ? 'selected' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg text-emerald-950">Tata XPRES-T EV</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Sedan</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">person</span>
                  4 Seat
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">luggage</span>
                  1 Large + 2 Hand
                </span>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">eco</span>
                <span>100% Electric - Zero Emissions</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Base Fare</div>
              <div className="text-2xl font-headline font-extrabold text-primary">₹{baseXprest.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Reassurance Note */}
        <div className="p-4 bg-emerald-50/60 rounded-xl flex gap-3 text-xs text-emerald-900 border border-emerald-100">
          <span className="material-symbols-outlined text-lg text-emerald-700 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">bolt</span>
          <p className="leading-relaxed font-semibold">&quot;Guaranteed 100% battery charge at pickup. Continuous drive to destination without charging stops.&quot;</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button onClick={prevStep} className="col-span-1 border-2 border-outline-variant font-bold rounded-xl py-3 text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
            Back
          </button>
          <button onClick={nextStep} className="col-span-2 btn-primary-gradient text-on-primary font-headline font-bold rounded-xl py-3 shadow-lg active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            Select This Ride
          </button>
        </div>
      </div>
    </div>
  );
}
