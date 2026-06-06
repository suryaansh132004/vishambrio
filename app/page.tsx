'use client';

import React from 'react';
import BookingWizard from '@/components/booking-wizard/BookingWizard';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center overflow-hidden" id="home">
        <div className="absolute inset-0 z-0">
          <img
            id="hero-bg-img"
            className="w-full h-full object-cover brightness-75 scale-105 transition-all duration-700 ease-in-out"
            src="/assets/heroimage.png"
            alt="Sleek white EV in Himachal"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
        </div>
        
        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-sm animate-entrance opacity-0" style={{ animationFillMode: 'forwards' }}>
              <span className="material-symbols-outlined text-on-primary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-primary-fixed">Sustainable Future</span>
            </div>
            <h1 className="display-lg text-white drop-shadow-2xl animate-entrance opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
              <span className="text-secondary-fixed-dim">Revolutionizing</span> How <span className="text-primary-fixed">Himachal</span> Moves
            </h1>
            <div className="flex flex-wrap gap-4 animate-entrance opacity-0 delay-300" style={{ animationFillMode: 'forwards' }}>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('open-bookings-drawer'));
                  }
                }}
                className="btn-glass-green px-10 py-5 rounded-xl font-headline font-extrabold text-lg flex items-center gap-3 active:scale-95 shadow-lg shadow-emerald-950/20"
              >
                <span className="material-symbols-outlined">receipt_long</span>
                Your Bookings
              </button>
              <a href="/popular-routes" className="btn-glass-white px-10 py-5 rounded-xl font-headline font-extrabold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-xl">explore</span>
                View Routes
              </a>
            </div>
          </div>

          {/* Interactive E-Taxi Booking Wizard Column */}
          <BookingWizard />
        </div>
      </header>

      {/* Unique Selling Points */}
      <section className="py-32 px-8 max-w-screen-2xl mx-auto" id="features">
        <div className="mb-20 space-y-4">
          <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase">Why Vishambrio?</h2>
          <p className="text-5xl font-headline font-extrabold tracking-tight text-on-surface">Designed for the Terrain</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="alpine-card hover-brown p-10 rounded-[32px] flex flex-col group">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-inner">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface">Localized for India</h3>
              <p className="text-tertiary leading-relaxed text-lg">Specially calibrated drivetrains tailored for local traffic nuances and the unique Himalayan climate challenges.</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="alpine-card hover-blue p-10 rounded-[32px] flex flex-col group">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shadow-inner">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface">Advanced Tech</h3>
              <p className="text-tertiary leading-relaxed text-lg">Next-gen long-range batteries featuring fast-charging capabilities that work efficiently even at high altitudes.</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="alpine-card hover-green p-10 rounded-[32px] flex flex-col group">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-inner">
                <span className="material-symbols-outlined text-3xl">forest</span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface">Eco-Friendly</h3>
              <p className="text-tertiary leading-relaxed text-lg">Zero tailpipe emissions to preserve the pristine mountain air and delicate ecosystem of the valley.</p>
            </div>
          </div>
        </div>

        {/* Eco-friendly statement moved from Hero */}
        <div className="mt-28 text-center px-4">
          <p className="text-2xl md:text-3xl text-tertiary font-medium leading-relaxed max-w-4xl mx-auto">
            Eco-friendly, affordable, and reliable electric cabs for urban and rural commuters navigating the peaks.
          </p>
        </div>
      </section>

      {/* Safety & Convenience */}
      <section className="bg-surface-container-low py-32" id="safety">
        <div className="max-w-screen-2xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-square rounded-[48px] overflow-hidden ambient-shadow">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxnm2lkwHRKgOKolfxACC_FOolaIwd9RgQMUGoPbBQZxuN2nncyubAbqtbFheO3JqgrucqUjyJRswXaKmpU3FENRn7rG-VSYloHCQ_QZ8KeSJPxhwmgf95jp2gsRhbNfyq8g7Y7CNh9vN2MZrrdeo_EhYNWxnelOygAht_HIQxTIiAVb_EvwOwyCVikv0fHgJ09Qmbu66RTomFQK7_nIdwPcvlPEGpIVjvUprjT_4VUA-mqI2x7WYbEXIv_aljLE2aYZWBzevjid8" alt="EV dashboard navigation" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-surface p-8 rounded-3xl ambient-shadow max-w-xs transition-transform hover:scale-105 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <p className="font-headline font-bold">100% Verified Fleet</p>
              </div>
              <p className="text-sm text-tertiary">Real-time health monitoring for every EV in our ecosystem.</p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface">Safety First, Convenience Always</h2>
              <p className="text-xl text-tertiary leading-relaxed">We've integrated high-end security protocols with a seamless booking interface to ensure your journey is as smooth as the electric drive.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white/70 shadow-sm flex gap-4 items-start transition-all hover:border-primary/30 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin_circle</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-emerald-950 mb-1">Trained Drivers</h4>
                  <p className="text-sm text-tertiary">Professionals trained specifically for electric vehicle handling.</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-slate-200 bg-white/70 shadow-sm flex gap-4 items-start transition-all hover:border-primary/30 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_share</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-emerald-950 mb-1">Emergency Response</h4>
                  <p className="text-sm text-tertiary">Instant SOS alerts and 24/7 rapid response teams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-32 px-8 max-w-4xl mx-auto" id="roadmap">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl font-headline font-extrabold tracking-tight">Our Growth Roadmap</h2>
          <p className="text-lg text-tertiary">Steering the future of transportation in Himachal Pradesh.</p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-outline-variant/30"></div>
          <div className="space-y-24">
            <div className="relative flex items-center justify-between group">
              <div className="w-[45%] text-right pr-12 hidden md:block">
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">Phase 1</h3>
                <p className="text-primary font-bold">2026 - 2030</p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-surface ambient-shadow group-hover:scale-150 transition-transform duration-300"></div>
              <div className="md:w-[45%] pl-12">
                <div className="md:hidden mb-2">
                  <h3 className="text-xl font-headline font-extrabold text-on-surface">Phase 1 (2026-2030)</h3>
                </div>
                <h4 className="text-xl font-bold mb-3">District Kangra Launch</h4>
                <p className="text-tertiary leading-relaxed">Establishing our core fleet and hub operations in Kangra.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-8 bg-surface-container-low">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-3xl font-headline font-bold text-on-surface">Ready to streamline your company's travel?</h3>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-sm font-semibold text-slate-500">
            <a href="/popular-routes" className="hover:text-primary transition-colors">Popular Routes</a>
            <span className="hidden sm:inline text-outline-variant">|</span>
            <a href="/packaged-tours" className="hover:text-primary transition-colors">Packaged Tours</a>
            <span className="hidden sm:inline text-outline-variant">|</span>
            <a href="/tourist-attractions" className="hover:text-primary transition-colors">Tourist Attractions</a>
            <span className="hidden sm:inline text-outline-variant">|</span>
            <a href="/contact" className="hover:text-primary transition-colors">Contact Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
