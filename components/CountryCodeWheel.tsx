'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const COUNTRIES: CountryCode[] = [
  { code: 'IN', name: 'India', flag: 'IN', dialCode: '+91' },
  { code: 'US', name: 'United States', flag: 'US', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: 'GB', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: 'CA', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: 'AU', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: 'DE', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: 'FR', dialCode: '+33' },
  { code: 'SG', name: 'Singapore', flag: 'SG', dialCode: '+65' },
  { code: 'AE', name: 'United Arab Emirates', flag: 'AE', dialCode: '+971' },
  { code: 'NP', name: 'Nepal', flag: 'NP', dialCode: '+977' },
  { code: 'BT', name: 'Bhutan', flag: 'BT', dialCode: '+975' },
  { code: 'BD', name: 'Bangladesh', flag: 'BD', dialCode: '+880' },
  { code: 'LK', name: 'Sri Lanka', flag: 'LK', dialCode: '+94' },
  { code: 'MY', name: 'Malaysia', flag: 'MY', dialCode: '+60' },
  { code: 'TH', name: 'Thailand', flag: 'TH', dialCode: '+66' },
  { code: 'NZ', name: 'New Zealand', flag: 'NZ', dialCode: '+64' },
  { code: 'ZA', name: 'South Africa', flag: 'ZA', dialCode: '+27' },
  { code: 'JP', name: 'Japan', flag: 'JP', dialCode: '+81' },
  { code: 'CN', name: 'China', flag: 'CN', dialCode: '+86' },
  { code: 'RU', name: 'Russia', flag: 'RU', dialCode: '+7' },
  { code: 'IT', name: 'Italy', flag: 'IT', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: 'ES', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: 'NL', dialCode: '+31' },
  { code: 'CH', name: 'Switzerland', flag: 'CH', dialCode: '+41' },
  { code: 'SA', name: 'Saudi Arabia', flag: 'SA', dialCode: '+966' },
  { code: 'KR', name: 'South Korea', flag: 'KR', dialCode: '+82' },
];

interface Props {
  selectedCountry: CountryCode;
  onSelect: (country: CountryCode) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CountryCodeWheel({ selectedCountry, onSelect, isOpen, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const ITEM_HEIGHT = 40; // px height of each item

  // Update activeIndex based on scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    if (index >= 0 && index < filteredCountries.length && index !== activeIndex) {
      setActiveIndex(index);
      onSelect(filteredCountries[index]);
    }
  };

  // Scroll to active item when index changes
  const scrollToActive = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth',
      });
    }
  };

  // Initialize scroll position to the current selected country
  useEffect(() => {
    if (isOpen) {
      const index = filteredCountries.findIndex((c) => c.code === selectedCountry.code);
      if (index !== -1) {
        setActiveIndex(index);
        // Timeout to ensure container is rendered and scrollable
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = index * ITEM_HEIGHT;
          }
        }, 50);
      }
    }
  }, [isOpen]);

  // Handle keypresses (Escape to close, Enter to select)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredCountries, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Click outside backdrop */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      
      <div className="absolute left-0 mt-2 z-50 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-4 animate-entrance">
        {/* Style tag to hide scrollbars */}
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* Search Bar */}
        <div className="relative mb-3">
          <span className="material-symbols-outlined absolute left-3 top-2 text-sm text-slate-400">search</span>
          <input
            type="text"
            className="w-full bg-[#f2f4f3] rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold outline-none border border-transparent focus:border-emerald-600 focus:bg-white transition-all text-slate-800"
            placeholder="Search country or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
          />
        </div>

        {filteredCountries.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-semibold">
            No countries found
          </div>
        ) : (
          <div className="relative">
            {/* Highlight Indicator Overlay */}
            <div 
              className="absolute left-0 right-0 border-y border-emerald-500/20 bg-emerald-500/5 pointer-events-none rounded-lg"
              style={{
                top: `${ITEM_HEIGHT * 2}px`,
                height: `${ITEM_HEIGHT}px`,
              }}
            />

            {/* Scroll Wheel Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-y-scroll snap-y snap-mandatory no-scrollbar relative select-none"
              style={{
                height: `${ITEM_HEIGHT * 5}px`,
              }}
              onScroll={handleScroll}
            >
              {/* Top Padding Spacer */}
              <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />

              {/* Country Items */}
              {filteredCountries.map((country, idx) => {
                const distance = Math.abs(idx - activeIndex);
                const isSelected = idx === activeIndex;

                // 3D transform and opacity calculations
                let opacity = 1;
                let scale = 1;
                let rotateX = 0;

                if (distance === 0) {
                  opacity = 1;
                  scale = 1.05;
                } else if (distance === 1) {
                  opacity = 0.6;
                  scale = 0.95;
                  rotateX = (idx < activeIndex ? 20 : -20);
                } else if (distance === 2) {
                  opacity = 0.3;
                  scale = 0.85;
                  rotateX = (idx < activeIndex ? 40 : -40);
                } else {
                  opacity = 0.1;
                  scale = 0.75;
                  rotateX = (idx < activeIndex ? 60 : -60);
                }

                return (
                  <div
                    key={country.code}
                    className="snap-center flex items-center justify-between px-4 cursor-pointer transition-all duration-150 origin-center"
                    style={{
                      height: `${ITEM_HEIGHT}px`,
                      opacity,
                      transform: `perspective(200px) rotateX(${rotateX}deg) scale(${scale})`,
                    }}
                    onClick={() => {
                      setActiveIndex(idx);
                      scrollToActive(idx);
                      onSelect(country);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider select-none w-7 text-center">{country.flag}</span>
                      <span className={`text-xs ${isSelected ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                        {country.name}
                      </span>
                    </div>
                    <span className={`text-xs font-headline ${isSelected ? 'font-extrabold text-emerald-700' : 'text-slate-400'}`}>
                      {country.dialCode}
                    </span>
                  </div>
                );
              })}

              {/* Bottom Padding Spacer */}
              <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
            </div>
          </div>
        )}

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2 text-xs font-bold transition-all shadow-md active:scale-98"
        >
          Done
        </button>
      </div>
    </>
  );
}
