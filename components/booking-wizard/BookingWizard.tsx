'use client';

import React, { useState, useEffect } from 'react';
import { BookingFormData, INITIAL_FORM_DATA, PRICING_MATRIX, PICKUP_OPTIONS, DROP_OPTIONS } from '@/lib/types';
import Step1Location from './Step1Location';
import Step2Fleet from './Step2Fleet';
import Step3Contact from './Step3Contact';
import Step4RouteMap from './Step4RouteMap';
import Step5Fare from './Step5Fare';
import Step6Payment from './Step6Payment';
import Step7Confirm from './Step7Confirm';
import { useAuth } from '@/context/AuthContext';

export default function BookingWizard({ isDrawer = false }: { isDrawer?: boolean }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const { user } = useAuth();
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Reset wizard when user logs out or a different user logs in
  useEffect(() => {
    setFormData({ ...INITIAL_FORM_DATA });
    setConfirmedBookingId(null);
    setStep(1);
  }, [user?.id]);

  // Listen for prefill events when the booking wizard drawer opens
  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { pickup, drop } = customEvent.detail;
        setFormData((prev) => {
          const nextPickup = pickup || prev.pickup;
          const nextDrop = drop || prev.drop;
          const pickupLabel = PICKUP_OPTIONS.find(o => o.value === nextPickup)?.label || '';
          const dropLabel = DROP_OPTIONS.find(o => o.value === nextDrop)?.label || '';
          return {
            ...prev,
            pickup: nextPickup,
            pickupLabel,
            drop: nextDrop,
            dropLabel,
          };
        });
        setStep(1); // Reset to location step
      }
    };
    window.addEventListener('open-booking-wizard', handlePrefill);
    return () => window.removeEventListener('open-booking-wizard', handlePrefill);
  }, []);

  // Recalculate fares whenever location or fleet changes
  useEffect(() => {
    let base = 2150;
    if (formData.pickup && formData.drop) {
      base = PRICING_MATRIX[formData.pickup]?.[formData.drop] || 2150;
    }
    if (formData.fleet === 'xprest') {
      base = Math.round(base * 0.82);
    }
    const gst = Math.round(base * 0.05);
    const totalFare = base + gst;
    
    setFormData(prev => ({
      ...prev,
      baseFare: base,
      gst,
      totalFare
    }));
  }, [formData.pickup, formData.drop, formData.fleet]);

  // Emit custom event to update hero background image when vehicle or step changes
  useEffect(() => {
    let src = '/assets/heroimage.png';
    if (step > 1 && step < 7) {
      if (formData.fleet === 'nexon') {
        src = '/assets/nexonimg.png';
      } else if (formData.fleet === 'xprest') {
        src = '/assets/xprest.png';
      }
    }
    const event = new CustomEvent('update-hero-bg', { detail: { src } });
    window.dispatchEvent(event);
  }, [step, formData.fleet]);

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));


  const resetWizard = () => {
    setFormData({ ...INITIAL_FORM_DATA });
    setConfirmedBookingId(null);
    setStep(1);
  };

  return (
    <div id="booking-card" className={isDrawer ? "w-full flex flex-col p-6" : "booking-wizard-card rounded-[32px] p-8 md:p-10 shadow-2xl relative w-full max-w-lg mx-auto animate-entrance z-20"}>
      {/* Header / Progress Bar */}
      {step < 7 && (
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <span className="text-primary font-headline">Step {step}: {getStepTitle(step)}</span>
            <span>{step} of 6</span>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className={`progress-bar-segment ${s <= step ? 'active' : ''}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="relative">
        {step === 1 && <Step1Location formData={formData} updateFormData={updateFormData} nextStep={nextStep} />}
        {step === 2 && <Step2Fleet formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Step3Contact formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Step4RouteMap formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Step5Fare formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <Step6Payment formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} setConfirmedBookingId={setConfirmedBookingId} />}
        {step === 7 && <Step7Confirm formData={formData} resetWizard={resetWizard} confirmedBookingId={confirmedBookingId} />}
      </div>
    </div>
  );
}

function getStepTitle(step: number) {
  switch (step) {
    case 1: return 'Check Green Fares';
    case 2: return 'Select Electric Ride';
    case 3: return 'Passenger Details';
    case 4: return 'Confirm Your Route';
    case 5: return 'Fare Review';
    case 6: return 'Secure Payment';
    default: return '';
  }
}
