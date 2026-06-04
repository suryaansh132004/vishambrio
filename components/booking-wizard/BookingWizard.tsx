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

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const { user } = useAuth();
  
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Auto-fill user details if logged in and not already filled
  useEffect(() => {
    if (user && !formData.riderEmail && !formData.riderName) {
      updateFormData({ riderEmail: user.email, riderName: user.name });
    }
  }, [user]);

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

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));


  const resetWizard = () => {
    setFormData({ ...INITIAL_FORM_DATA, riderName: user?.name || '', riderEmail: user?.email || '' });
    setConfirmedBookingId(null);
    setStep(1);
  };

  return (
    <div id="booking-card" className="booking-wizard-card rounded-[32px] p-8 md:p-10 shadow-2xl relative w-full max-w-lg mx-auto animate-entrance z-20">
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
