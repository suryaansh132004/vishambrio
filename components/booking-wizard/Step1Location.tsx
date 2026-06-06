'use client';

import React from 'react';
import { BookingFormData, PICKUP_OPTIONS, DROP_OPTIONS, RETURN_PICKUP_OPTIONS } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
}

export default function Step1Location({ formData, updateFormData, nextStep }: Props) {
  const isFormValid =
    formData.pickup &&
    formData.drop &&
    formData.date &&
    formData.time &&
    (formData.journeyType === 'oneway' ||
      (formData.returnTime &&
        formData.returnPickup &&
        (formData.returnType === 'sameday' || formData.returnDate)));

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
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold cursor-pointer select-none transition-all text-center ${
                formData.journeyType === 'oneway'
                  ? 'border-emerald-950 bg-emerald-950 text-white shadow-md'
                  : 'border-slate-200 bg-white/40 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
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
              onChange={() => {
                const returnOpts = RETURN_PICKUP_OPTIONS[formData.drop] || [];
                updateFormData({
                  journeyType: 'roundtrip',
                  returnDate: formData.date,
                  returnPickup: formData.returnPickup || returnOpts[0]?.value || '',
                  returnPickupLabel: formData.returnPickupLabel || returnOpts[0]?.label || '',
                });
              }}
            />
            <label
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-semibold cursor-pointer select-none transition-all text-center ${
                formData.journeyType === 'roundtrip'
                  ? 'border-emerald-950 bg-emerald-950 text-white shadow-md'
                  : 'border-slate-200 bg-white/40 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
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
              const val = e.target.value;
              const label = e.target.options[e.target.selectedIndex].text;
              const returnOpts = RETURN_PICKUP_OPTIONS[val] || [];
              const defaultReturnPickup = returnOpts[0]?.value || '';
              const defaultReturnPickupLabel = returnOpts[0]?.label || '';
              updateFormData({
                drop: val,
                dropLabel: label,
                returnPickup: defaultReturnPickup,
                returnPickupLabel: defaultReturnPickupLabel,
              });
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
              onChange={(e) => {
                const newDate = e.target.value;
                updateFormData({
                  date: newDate,
                  returnDate: formData.returnType === 'sameday' ? newDate : formData.returnDate,
                });
              }}
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

        {/* Round Trip Return Details */}
        {formData.journeyType === 'roundtrip' && (
          <div className="space-y-4 pt-4 border-t border-dashed border-slate-200 animate-entrance">
            {/* Return Pickup Location */}
            {formData.drop && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pick-up Location (Return)</label>
                <select
                  value={formData.returnPickup}
                  onChange={(e) => {
                    const label = e.target.options[e.target.selectedIndex].text;
                    updateFormData({ returnPickup: e.target.value, returnPickupLabel: label });
                  }}
                  className="wizard-input"
                  required
                >
                  <option value="" disabled>Select return pick-up...</option>
                  {(RETURN_PICKUP_OPTIONS[formData.drop] || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Return Option</label>
              <select
                value={formData.returnType}
                onChange={(e) => {
                  const type = e.target.value as 'sameday' | 'multiday';
                  updateFormData({
                    returnType: type,
                    returnDate: type === 'sameday' ? formData.date : '',
                  });
                }}
                className="wizard-input"
              >
                <option value="sameday">Same-Day Return</option>
                <option value="multiday">Different-Day Return</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Return Date</label>
                <input
                  type="date"
                  value={formData.returnType === 'sameday' ? formData.date : formData.returnDate}
                  onChange={(e) => updateFormData({ returnDate: e.target.value })}
                  disabled={formData.returnType === 'sameday'}
                  className="wizard-input disabled:opacity-60 disabled:bg-slate-100/50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Return Time</label>
                <input
                  type="time"
                  value={formData.returnTime}
                  onChange={(e) => updateFormData({ returnTime: e.target.value })}
                  className="wizard-input"
                  required
                />
              </div>
            </div>
          </div>
        )}

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
