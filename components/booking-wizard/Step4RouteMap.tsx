'use client';

import React, { useEffect, useState, useRef } from 'react';
import { BookingFormData } from '@/lib/types';

interface Props {
  formData: BookingFormData;
  updateFormData: (updates: Partial<BookingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step4RouteMap({ formData, nextStep, prevStep }: Props) {
  const [chargerName, setChargerName] = useState("Vishambrio Eco Charger Station");
  const [scenicName, setScenicName] = useState("Mountain View Lookout Stop");
  const [co2Saved, setCo2Saved] = useState(4.2);
  const [svgCurve, setSvgCurve] = useState("M 30,75 Q 120,40 200,90 T 370,75");
  const [nodes, setNodes] = useState<{ x: number, y: number, color: string, isPulse: boolean }[]>([]);

  const tracePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let cName = "Vishambrio Eco Charger Station";
    let sName = "Mountain View Lookout Stop";
    let co2 = 4.2;
    let curve = "M 30,75 Q 120,40 200,90 T 370,75";

    const pickupVal = formData.pickup;
    const dropVal = formData.drop;

    if (pickupVal === 'gaggal') {
        cName = "Gaggal Airport EV Power Station ⚡";
        if (dropVal === 'mcleodganj') {
            sName = "Bhagsu Pine Canopy Lookout 🌲";
            co2 = 5.8;
            curve = "M 30,100 C 100,50 160,130 220,70 C 280,30 320,110 370,40";
        } else if (dropVal === 'dharamshala') {
            sName = "Dharamshala Valley Vistas 🏔️";
            co2 = 4.5;
            curve = "M 30,100 Q 120,50 200,90 T 370,75";
        } else {
            sName = "Kangra Valley Panoramic View 🏔️";
            co2 = 5.2;
            curve = "M 30,80 C 100,90 160,120 220,95 C 280,75 320,115 370,110";
        }
    } else if (pickupVal === 'pathankot') {
        cName = "Kandwal Green Charger Hub ⚡";
        if (dropVal === 'mcleodganj') {
            sName = "Dhauladhar Snow Peaks Lookout 🏔️";
            co2 = 21.5;
            curve = "M 30,120 C 110,60 170,140 230,80 C 290,30 330,110 370,40";
        } else if (dropVal === 'dharamshala') {
            sName = "Kangra Ridge Panoramic Stop 🏔️";
            co2 = 19.8;
            curve = "M 30,120 Q 120,70 210,105 T 370,75";
        } else {
            sName = "Ancient Fort Vistas Stop 🏔️";
            co2 = 18.5;
            curve = "M 30,110 C 110,110 170,130 230,105 C 290,80 330,120 370,110";
        }
    } else {
        cName = "Kandwal Gate EV Charging Hub ⚡";
        if (dropVal === 'mcleodganj') {
            sName = "Naddi Hill Viewpoint 🏔️";
            co2 = 16.5;
            curve = "M 30,110 C 110,55 170,135 230,75 C 290,30 330,110 370,40";
        } else if (dropVal === 'dharamshala') {
            sName = "Dhauladhar Base Scenic Stop 🏔️";
            co2 = 14.8;
            curve = "M 30,110 Q 120,60 210,95 T 370,75";
        } else {
            sName = "Fort Valley Lookout Stop 🏔️";
            co2 = 13.5;
            curve = "M 30,100 C 110,100 170,120 230,100 C 290,80 330,115 370,110";
        }
    }

    setChargerName(cName);
    setScenicName(sName);
    setCo2Saved(co2);
    setSvgCurve(curve);
  }, [formData.pickup, formData.drop]);

  useEffect(() => {
    // Generate nodes based on SVG path
    if (tracePathRef.current) {
      const tracePath = tracePathRef.current;
      const length = tracePath.getTotalLength();
      if (length > 0) {
        const numNodes = 4;
        const nodeColors = ['#34d399', '#fbbf24', '#38bdf8', '#10b981'];
        const newNodes = [];

        for (let i = 0; i < numNodes; i++) {
            const pct = i / (numNodes - 1);
            const point = tracePath.getPointAtLength(length * pct);
            newNodes.push({
                x: point.x,
                y: point.y,
                color: nodeColors[i],
                isPulse: i === 1 || i === 2
            });
        }
        setNodes(newNodes);
      }
    }
  }, [svgCurve]);

  return (
    <div className="booking-step active animate-entrance">
      <h3 className="text-2xl font-headline font-extrabold text-emerald-950 mb-3">Confirm Your Route</h3>
      <p className="text-slate-500 text-xs mb-4">Review your eco-friendly route path and details below.</p>

      <div className="space-y-4">
        {/* Summary table */}
        <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs font-semibold text-slate-600">
          <div className="flex justify-between">
            <span>Lead Rider</span>
            <span className="text-slate-800">{formData.riderName || 'Guest Rider'}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected EV</span>
            <span className="text-slate-800">{formData.fleet === 'nexon' ? 'Tata Nexon EV' : 'Tata XPRES-T EV'}</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time</span>
            <span className="text-slate-800">{formData.date} at {formData.time}</span>
          </div>
          <div className="flex justify-between">
            <span>Luggage & Bags</span>
            <span className="text-slate-800">{formData.suitcases} Suitcase(s), {formData.handbags} Handbag(s)</span>
          </div>
        </div>

        {/* Route Map SVG */}
        <div className="p-4 rounded-2xl text-white space-y-3 relative overflow-hidden border" style={{ backgroundColor: '#071e27', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center justify-between text-emerald-400">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[12px] animate-pulse">route</span>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold italic">EV Route Trace</span>
          </div>

          <div className="relative w-full h-[125px] bg-[#05151c]/60 rounded-xl border border-slate-800/40 overflow-hidden flex items-center justify-center select-none">
            <svg viewBox="0 0 400 150" className="w-full h-full" style={{ background: 'transparent' }}>
              <defs>
                <filter id="svg-glow-wizard" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5" fill="none" d={svgCurve} />
              <path ref={tracePathRef} stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" d={svgCurve} />
              
              <g>
                {nodes.map((node, i) => (
                  <g key={i}>
                    {node.isPulse && <circle cx={node.x} cy={node.y} r="5" fill={node.color} opacity="0.6" className="wiz-node-pulse" />}
                    <circle cx={node.x} cy={node.y} r="4.5" fill={node.color} stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                ))}
              </g>

              {/* In React with standard CSS motion path, offsetPath works best if set via inline style */}
              <circle r="6" fill="#34d399" filter="url(#svg-glow-wizard)" className="animate-wiz-cab" style={{ offsetPath: `path("${svgCurve}")` }} />
              <circle r="3" fill="#047857" className="animate-wiz-cab" style={{ offsetPath: `path("${svgCurve}")` }} />
            </svg>
          </div>

          <div className="space-y-3 pl-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-emerald-500/50">
            <div className="relative flex items-center gap-3">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34d399', boxShadow: '0 0 0 4px #071e27' }}></div>
              <div className="text-xs">
                <div className="font-extrabold uppercase text-[9px] tracking-wider text-[#6ee7b7]">Start</div>
                <div className="font-bold text-[#f1f5f9]">{formData.pickupLabel}</div>
              </div>
            </div>
            <div className="relative flex items-center gap-3">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fbbf24', boxShadow: '0 0 0 4px #071e27' }}>
                <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping"></div>
              </div>
              <div className="text-xs">
                <div className="font-extrabold uppercase text-[9px] tracking-wider flex items-center gap-0.5 text-[#fcd34d]">Green Power Hub ⚡</div>
                <div className="text-[#e2e8f0]">{chargerName}</div>
              </div>
            </div>
            <div className="relative flex items-center gap-3">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#38bdf8', boxShadow: '0 0 0 4px #071e27' }}></div>
              <div className="text-xs">
                <div className="font-extrabold uppercase text-[9px] tracking-wider flex items-center gap-0.5 text-[#7dd3fc]">Scenic Stop 🏔️</div>
                <div className="text-[#e2e8f0]">{scenicName}</div>
              </div>
            </div>
            <div className="relative flex items-center gap-3">
              <div className="absolute -left-[21px] w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10b981', boxShadow: '0 0 0 4px #071e27' }}></div>
              <div className="text-xs">
                <div className="font-extrabold uppercase text-[9px] tracking-wider text-[#6ee7b7]">Drop-off</div>
                <div className="font-bold text-[#f1f5f9]">{formData.dropLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carbon Savings Badge */}
        <div className="p-3 bg-emerald-50/60 rounded-xl flex gap-3 text-xs text-emerald-900 border border-emerald-100">
          <span className="material-symbols-outlined text-lg text-emerald-700 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <p className="leading-relaxed font-semibold">
            <span className="font-extrabold">Sustainable Transit:</span> You are saving <span className="text-emerald-700 font-black">{co2Saved} kg</span> over standard diesel alternatives!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button onClick={prevStep} className="col-span-1 border-2 border-outline-variant font-bold rounded-xl py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            Back
          </button>
          <button onClick={nextStep} className="col-span-2 btn-primary-gradient text-on-primary font-headline font-bold rounded-xl py-3 shadow-lg active:scale-98 transition-all">
            Confirm Details
          </button>
        </div>
      </div>
    </div>
  );
}
