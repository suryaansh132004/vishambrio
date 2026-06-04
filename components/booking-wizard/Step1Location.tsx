'use client';

import React from 'react';
import { BookingFormData, PICKUP_OPTIONS, DROP_OPTIONS } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
}

export default function Step1Location({ formData, updateFormData, nextStep }: Props) {
  const isFormValid = formData.pickup && formData.drop && formData.date && formData.time;

  return (
    <div className="booking-step active animate-entrance">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-6">Plan Your Green Ride</h3>
      <div className="space-y-5">
        {/* Journey Type */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              className="sr-only wizard-radio"
              type="radio"
              id="one-way"
              name="journey_type"
              value="oneway"
              checked={formData.journeyType === 'oneway'}
              onChange={() => updateFormData({ journeyType: 'oneway' })}
            />
            <label
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-outline-variant text-sm font-semibold cursor-pointer select-none text-slate-600 transition-all text-center hover:bg-slate-50"
              htmlFor="one-way"
            >
              <span className="material-symbols-outlined text-sm">trending_flat</span> One-Way
            </label>
          </div>
          <div className="relative flex-1">
            <input
              className="sr-only wizard-radio"
              type="radio"
              id="round-trip"
              name="journey_type"
              value="roundtrip"
              checked={formData.journeyType === 'roundtrip'}
              onChange={() => updateFormData({ journeyType: 'roundtrip' })}
            />
            <label
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-outline-variant text-sm font-semibold cursor-pointer select-none text-slate-600 transition-all text-center hover:bg-slate-50"
              htmlFor="round-trip"
            >
              <span className="material-symbols-outlined text-sm">sync</span> Round-Trip
            </label>
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pick-up Location</label>
          <select
            value={formData.pickup}
            onChange={(e) => {
              const label = e.target.options[e.target.selectedIndex].text;
              updateFormData({ pickup: e.target.value, pickupLabel: label });
            }}
            className="wizard-input"
            required
          >
            <option value="" disabled>Select pick-up station...</option>
            {PICKUP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Drop-off Location</label>
          <select
            value={formData.drop}
            onChange={(e) => {
              const label = e.target.options[e.target.selectedIndex].text;
              updateFormData({ drop: e.target.value, dropLabel: label });
            }}
            className="wizard-input"
            required
          >
            <option value="" disabled>Select destination...</option>
            {DROP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateFormData({ date: e.target.value })}
              className="wizard-input"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => updateFormData({ time: e.target.value })}
              className="wizard-input"
              required
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={nextStep}
          disabled={!isFormValid}
          className="w-full btn-primary-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg active:scale-98 transition-all shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Green Fares
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
