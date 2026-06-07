'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { routeDetailsData } from '@/lib/routeDetailsData';

interface RouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string | null;
}

export default function RouteMapModal({ isOpen, onClose, routeId }: RouteMapModalProps) {
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [activeScenicIdx, setActiveScenicIdx] = useState(0);
  const [isRendered, setIsRendered] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && routeId) {
      setIsRendered(true);
      setActiveNodeIdx(0);
      setActiveScenicIdx(0);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, routeId]);

  useEffect(() => {
    if (!isOpen || !routeId) return;
    
    const data = routeDetailsData[routeId];
    if (!data || !data.photos || data.photos.length === 0) return;

    const timer = setInterval(() => {
      setActiveScenicIdx((prev) => (prev + 1) % data.photos.length);
    }, 4500);
    
    return () => clearInterval(timer);
  }, [isOpen, routeId, activeScenicIdx]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"], g[tabindex="0"]'
        );
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    const previousActiveElement = document.activeElement as HTMLElement;

    const timer = setTimeout(() => {
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"], g[tabindex="0"]'
      );
      if (focusableElements && focusableElements.length > 0) {
        // Focus close button or first action
        focusableElements[0].focus();
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isRendered || !routeId) return null;

  const data = routeDetailsData[routeId];
  if (!data) return null;

  const activeNode = data.nodes[activeNodeIdx];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveScenicIdx((prev) => (prev + 1) % data.photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveScenicIdx((prev) => (prev - 1 + data.photos.length) % data.photos.length);
  };

  const selectNode = (idx: number) => {
    setActiveNodeIdx(idx);
    const node = data.nodes[idx];
    if (node && node.photoIndex !== undefined) {
      setActiveScenicIdx(node.photoIndex % data.photos.length);
    }
  };

  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-md" onClick={onClose} aria-hidden="true"></div>
      
      <div 
        ref={modalRef}
        className={`relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 h-[85vh] md:h-auto max-h-[85vh] transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Route details and live map"
      >
        
        {/* Left Column: Dynamic Map Canvas */}
        <div className="w-full md:w-[45%] bg-[#081f2c] p-6 flex flex-col justify-between relative text-white min-h-[340px] md:min-h-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#081f2c]/50 to-[#081f2c] pointer-events-none z-10"></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              <span className="material-symbols-outlined text-[14px]">explore</span> Live Route Map
            </span>
            <h4 className="text-xl font-headline font-extrabold mt-2 text-slate-100">{data.title}</h4>
            <p className="text-xs text-slate-400 mt-1">Click the nodes along the route path to view stop details and scenic checkpoints.</p>
          </div>
          
          <div className="relative flex-1 flex items-center justify-center mt-1 mb-6 z-20 select-none" ref={mapContainerRef}>
            <svg viewBox="0 0 400 240" className="w-full h-full max-h-[220px]">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M 0 200 Q 100 160, 200 180 T 400 140" stroke="#102e3f" strokeWidth="2" fill="none" opacity="0.4" />
              <path d="M 0 160 Q 150 200, 300 120 T 400 180" stroke="#102e3f" strokeWidth="2" fill="none" opacity="0.4" />
              
              <path d={data.svgPath} stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,6" fill="none" />
              <path d={data.svgPath} stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" style={{ strokeDasharray: 1000, strokeDashoffset: 0, transition: 'stroke-dashoffset 2s ease-out' }} />
              
              {data.nodes.map((node, idx) => {
                let fill = '#10b981';
                if (node.type === 'stop') fill = '#f59e0b';
                else if (node.type === 'scenic') fill = '#3b82f6';
                else if (node.type === 'end') fill = '#0d631b';

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer group focus:outline-none" 
                    onClick={() => selectNode(idx)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select checkpoint: ${node.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectNode(idx);
                      }
                    }}
                  >
                    {(node.type === 'stop' || node.type === 'scenic') && (
                      <circle cx={node.x} cy={node.y} r="6" fill={fill} opacity="0.6" className="animate-pulse" />
                    )}
                    <circle cx={node.x} cy={node.y} r="5" fill={fill} stroke={activeNodeIdx === idx ? '#ffffff' : fill} strokeWidth={activeNodeIdx === idx ? 2 : 1.5} className="group-hover:stroke-white group-hover:stroke-2 group-focus:stroke-white group-focus:stroke-2" />
                  </g>
                );
              })}
              
              <circle r="7" fill="#34d399" filter="url(#glow)" style={{ offsetPath: `path("${data.svgPath}")`, animation: 'cabGlide 7s infinite linear' }}></circle>
              <circle r="3.5" fill="#047857" style={{ offsetPath: `path("${data.svgPath}")`, animation: 'cabGlide 7s infinite linear' }}></circle>
            </svg>

            {/* Tooltip Popup */}
            {activeNode && (
              <div 
                className="absolute z-[30] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-emerald-500/20 max-w-[240px] text-slate-800 animate-entrance transition-all duration-300"
                style={{
                  left: `${(activeNode.x / 400) * 100}%`,
                  top: `${(activeNode.y / 240) * 100}%`,
                  transform: `translate(${activeNode.x < 120 ? '10px' : activeNode.x > 280 ? '-108%' : '-50%'}, ${activeNode.y < 90 ? '15px' : activeNode.y > 150 ? '-112%' : '-115%'})`
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 mt-0.5 text-lg">
                    {activeNode.type === 'start' ? 'play_arrow' : activeNode.type === 'stop' ? 'battery_charging_full' : activeNode.type === 'scenic' ? 'photo_camera' : activeNode.type === 'end' ? 'flag' : 'location_on'}
                  </span>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-slate-900 leading-tight">{activeNode.name}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{activeNode.desc}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeNode.name)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-950 transition-colors pt-1">
                      <span className="material-symbols-outlined text-[12px]">directions</span> View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center bg-[#071822]/60 backdrop-blur-md rounded-2xl p-3 border border-slate-800 relative z-20">
            <div className="text-center flex-1 border-r border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Distance</div>
              <div className="text-sm font-extrabold text-slate-200">{data.distance}</div>
            </div>
            <div className="text-center flex-1 border-r border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Est. Time</div>
              <div className="text-sm font-extrabold text-slate-200">{data.duration}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Base Fare</div>
              <div className="text-sm font-extrabold text-emerald-400">{data.baseFare}</div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Timeline & Gallery */}
        <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-30 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Close route details"
          >
            <span className="material-symbols-outlined text-xl block" aria-hidden="true">close</span>
          </button>
          
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline & Scenic Stops</span>
              <h3 className="text-2xl font-headline font-extrabold text-slate-900 mt-1">Route Details & Highlights</h3>
            </div>
            
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pl-8">
              {data.nodes.map((node, idx) => {
                let badgeClass = 'bg-slate-100 text-slate-700';
                let icon = 'location_on';
                if (node.type === 'start') { badgeClass = 'bg-emerald-100 text-emerald-800'; icon = 'play_arrow'; }
                else if (node.type === 'stop') { badgeClass = 'bg-amber-100 text-amber-800'; icon = 'battery_charging_full'; }
                else if (node.type === 'scenic') { badgeClass = 'bg-blue-100 text-blue-800'; icon = 'photo_camera'; }
                else if (node.type === 'end') { badgeClass = 'bg-emerald-950 text-white'; icon = 'flag'; }

                return (
                  <div 
                    key={idx} 
                    onClick={() => selectNode(idx)} 
                    tabIndex={0}
                    role="button"
                    aria-pressed={activeNodeIdx === idx}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectNode(idx);
                      }
                    }}
                    className={`timeline-step flex items-start gap-4 p-3 rounded-2xl border cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-600 ${activeNodeIdx === idx ? 'bg-green-50 border-green-200 translate-x-1' : 'border-slate-100 hover:bg-slate-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${badgeClass}`}>
                      <span className="material-symbols-outlined text-sm font-bold" aria-hidden="true">{icon}</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-slate-800">{node.name}</h4>
                      <p className="text-xs text-slate-500">{node.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Exact Drop Points</h4>
              <div className="flex flex-wrap gap-2">
                {data.dropPoints.map((pt, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">pin_drop</span> {pt}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Route Gallery & Scenery</h4>
              <div className="relative rounded-2xl overflow-hidden h-[180px] shadow-md group bg-slate-100">
                <div className="w-full h-full relative transition-all duration-500">
                  {data.photos.map((photo, idx) => (
                    <div key={idx} className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${idx === activeScenicIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{ backgroundImage: `url(${photo})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Scenic Viewpoint</p>
                        <p className="text-sm font-headline font-semibold">Himachal Ridge Vistas</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handlePrevPhoto} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-sm block" aria-hidden="true">chevron_left</span>
                </button>
                <button 
                  onClick={handleNextPhoto} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-sm block" aria-hidden="true">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-slate-100 flex gap-4">
            <button onClick={onClose} className="flex-1 py-3 text-center border-2 border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl font-headline font-bold hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Close Details</button>
            <Link href={`/?pickup=${data.pickupVal}&drop=${data.dropVal}&step=1`} className="flex-1 py-3 text-center bg-primary hover:bg-emerald-700 text-white rounded-xl font-headline font-bold transition-all shadow-lg flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
              <span className="material-symbols-outlined text-base" aria-hidden="true">bolt</span> Book Route Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
