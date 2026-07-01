'use client';

import React, { useState, useEffect } from 'react';
import { BookingFormData } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { ProfileStore } from '@/lib/profile';
import CustomDialog from '../CustomDialog';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step3Contact({ formData, updateFormData, nextStep, prevStep }: Props) {
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; title: string; message: string } | null>(null);
  const [isTravellingSelf, setIsTravellingSelf] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { user } = useAuth();

  // When the "Travelling by self" toggle turns on, autofill from user profile
  useEffect(() => {
    if (!isTravellingSelf || !user) return;
    let cancelled = false;
    const autofill = async () => {
      setIsLoadingProfile(true);
      updateFormData({ riderName: user.name, riderEmail: user.email });
      const profile = await ProfileStore.getUserProfile(user.id);
      if (!cancelled && profile?.phone) {
        updateFormData({ riderPhone: profile.phone });
      }
      if (!cancelled) setIsLoadingProfile(false);
    };
    autofill();
    return () => { cancelled = true; };
  }, [isTravellingSelf, user]);

  const handleSelfToggle = (checked: boolean) => {
    setIsTravellingSelf(checked);
    if (!checked) {
      updateFormData({ riderName: '', riderEmail: '', riderPhone: '' });
    }
  };

  return (
    <div className="booking-step active animate-entrance">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-4">Passenger Details</h3>
      <p className="text-slate-500 text-sm mb-6">Verify luggage count to ensure EV trunk availability.</p>

      <div className="space-y-4">
        {/* Travelling by self toggle — shown only when logged in */}
        {user && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer select-none ${
              isTravellingSelf
                ? 'bg-emerald-50 border-emerald-400'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-200'
            }`}
            onClick={() => handleSelfToggle(!isTravellingSelf)}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              isTravellingSelf ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'
            }`}>
              {isTravellingSelf && (
                <span className="material-symbols-outlined text-white" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check</span>
              )}
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold text-slate-700">Travelling by self</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isLoadingProfile ? 'Loading your details…' : 'Prefill your name, email & saved mobile number'}
              </p>
            </div>
            {isTravellingSelf && (
              <span className="material-symbols-outlined text-emerald-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person_check</span>
            )}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Lead Rider Name</label>
          <input
            type="text"
            value={formData.riderName}
            onChange={(e) => updateFormData({ riderName: e.target.value })}
            placeholder="John Doe"
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
              pattern="[0-9]{10,14}"
              onChange={(e) => updateFormData({ riderPhone: e.target.value })}
              placeholder="xxxxx xxxxx"
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
              placeholder="user@example.com"
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
            Send tickets &amp; driver alerts via WhatsApp
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
              <button onClick={() => updateFormData({ suitcases: Math.max(0, formData.suitcases - 1) })} className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" aria-label="Decrease suitcases">-</button>
              <span className="font-headline font-extrabold text-lg text-emerald-950">{formData.suitcases}</span>
              <button onClick={() => updateFormData({ suitcases: Math.max(0, formData.suitcases + 1) })} className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" aria-label="Increase suitcases">+</button>
            </div>
          </div>
          <div className="flex-1 space-y-1 border-l pl-6 border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Handbags</label>
            <div className="flex items-center gap-3">
              <button onClick={() => updateFormData({ handbags: Math.max(0, formData.handbags - 1) })} className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" aria-label="Decrease handbags">-</button>
              <span className="font-headline font-extrabold text-lg text-emerald-950">{formData.handbags}</span>
              <button onClick={() => updateFormData({ handbags: Math.max(0, formData.handbags + 1) })} className="w-8 h-8 rounded-full bg-white border border-outline-variant flex items-center justify-center font-bold text-slate-600 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" aria-label="Increase handbags">+</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button onClick={prevStep} className="col-span-1 border-2 border-outline-variant font-bold rounded-xl py-3 text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Back</button>
          <button
            onClick={() => {
              if (!formData.riderName) { setAlertDialog({ isOpen: true, title: 'Missing Information', message: 'Please enter the Lead Rider Name.' }); return; }
              if (!formData.riderPhone) { setAlertDialog({ isOpen: true, title: 'Missing Information', message: 'Please enter a Mobile Number.' }); return; }
              if (!formData.riderEmail) { setAlertDialog({ isOpen: true, title: 'Missing Information', message: 'Please enter an Email Address.' }); return; }
              nextStep();
            }}
            className="col-span-2 btn-primary-gradient text-on-primary font-headline font-bold rounded-xl py-3 shadow-lg active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            Confirm Route Map
          </button>
        </div>
      </div>

      <CustomDialog
        isOpen={alertDialog !== null}
        title={alertDialog?.title || ''}
        message={alertDialog?.message || ''}
        type="alert"
        onConfirm={() => setAlertDialog(null)}
      />
    </div>
  );
}
