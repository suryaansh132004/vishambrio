'use client';

import React from 'react';
import { BookingFormData } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step5Fare({ formData, nextStep, prevStep }: Props) {
  // Use a local state for the checkbox just to ensure it's checked before proceeding,
  // or we can just require it to continue.
  const [unionShieldAccepted, setUnionShieldAccepted] = React.useState(true);

  const handleNext = () => {
    if (!unionShieldAccepted) {
      alert('Please acknowledge the Transit Boarding Compliance checkbox before finalizing!');
      return;
    }
    nextStep();
  };

  return (
    <div className="booking-step active animate-entrance">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-4">Fare Review</h3>
      <p className="text-slate-500 text-sm mb-6">Guaranteed transparent pricing. No hidden mountain surcharges.</p>

      <div className="space-y-4">
        {/* Fee Breakdown Box */}
        <div className="bg-slate-50 p-6 rounded-2xl space-y-3 font-semibold text-sm">
          <div className="flex justify-between items-center text-slate-500">
            <span>Base Route Fare</span>
            <span className="text-emerald-950">₹{formData.baseFare.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Himachal Green Tolls</span>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Included</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>NH FASTag Tolls</span>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Included</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>GST (5% Ecommerce)</span>
            <span className="text-emerald-950">₹{formData.gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-px bg-slate-200 my-2"></div>
          <div className="flex justify-between items-center text-base font-extrabold">
            <span className="text-emerald-950">Total Payable</span>
            <span className="text-primary text-xl font-headline">₹{formData.totalFare.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Legal Transit Prebook Union Shield */}
        <div className="flex items-start gap-3 py-2">
          <input
            id="union-shield-chk"
            type="checkbox"
            checked={unionShieldAccepted}
            onChange={(e) => setUnionShieldAccepted(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="union-shield-chk" className="text-xs font-semibold leading-relaxed text-slate-500">
            I understand this is a pre-booked digital ride. My digital boarding invoice acts as my transit pass to comply with local station union transit regulations.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button onClick={prevStep} className="col-span-1 border-2 border-outline-variant font-bold rounded-xl py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            Back
          </button>
          <button onClick={handleNext} className="col-span-2 btn-primary-gradient text-on-primary font-headline font-bold rounded-xl py-3 shadow-lg active:scale-98 transition-all">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
