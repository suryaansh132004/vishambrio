'use client';

import React, { useState, useEffect } from 'react';


export default function Home() {
  const [heroBg, setHeroBg] = useState('/assets/heroimage.png');

  useEffect(() => {
    const handleUpdateHeroBg = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.src === 'string') {
        setHeroBg(customEvent.detail.src);
      }
    };
    window.addEventListener('update-hero-bg', handleUpdateHeroBg);
    return () => {
      window.removeEventListener('update-hero-bg', handleUpdateHeroBg);
    };
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-between overflow-hidden" id="home">
        <div className="absolute inset-0 z-0">
          <img
            id="hero-bg-img"
            className="w-full h-full object-cover brightness-75 scale-105 transition-all duration-700 ease-in-out"
            src={heroBg}
            alt="Electric vehicle on a Himachal road"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 flex flex-col justify-between w-full flex-1 pt-12 pb-16">
          {/* Top/Middle Section: Heading */}
          <div className="flex-1 flex items-start pt-19">
            <div className="max-w-3xl">
              <h1 className="display-lg text-white drop-shadow-2xl">
                <span className="text-secondary-fixed-dim">Revolutionizing</span> <br />
                How <span className="text-primary-fixed">Himachal</span> <br />
                Moves
              </h1>
            </div>
          </div>

          {/* Bottom Section: Buttons */}
          <div className="grid lg:grid-cols-2 gap-8 items-end w-full pt-12">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('open-bookings-drawer'));
                  }
                }}
                className="btn-glass-white px-8 py-4 rounded-xl font-headline font-bold text-base flex items-center gap-3 active:scale-95 shadow-lg focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
              >
                <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                Your Bookings
              </button>
              <a href="/popular-routes" className="btn-glass-white px-8 py-4 rounded-xl font-headline font-bold text-base hover:shadow-2xl transition-all flex items-center justify-center gap-2 shadow-lg focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">explore</span>
                View Routes
              </a>
            </div>

            <div className="flex lg:justify-end">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('open-booking-wizard'));
                  }
                }}
                className="btn-glass-green px-12 py-6 rounded-2xl font-headline font-extrabold text-xl flex items-center gap-3 active:scale-95 shadow-xl shadow-emerald-950/30 focus-visible:ring-4 focus-visible:ring-emerald-950/30 focus-visible:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">bolt</span>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto" id="features">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-4">How it works</h2>
          <p className="text-lg text-tertiary">
            Three steps. No app download required — just book through our site and you&apos;re set.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="step-card hover-green p-8 rounded-2xl">
            <div className="text-5xl font-headline font-extrabold text-primary/20 mb-4">01</div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-3">Pick your route</h3>
            <p className="text-tertiary">
              Tell us where you&apos;re going. We cover routes across Kangra district — Dharamshala, McLeod Ganj, Palampur, Bir, and more.
            </p>
          </div>
          {/* Step 2 */}
          <div className="step-card hover-blue p-8 rounded-2xl">
            <div className="text-5xl font-headline font-extrabold text-secondary/20 mb-4">02</div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-3">Choose your vehicle</h3>
            <p className="text-tertiary">
              We have different EVs for different needs. Traveling solo? Family trip with luggage? Pick what fits.
            </p>
          </div>
          {/* Step 3 */}
          <div className="step-card hover-amber p-8 rounded-2xl">
            <div className="text-5xl font-headline font-extrabold text-amber-600/20 mb-4">03</div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-3">Ride electric</h3>
            <p className="text-tertiary">
              Your driver shows up in an EV. No exhaust, no noise. You get where you need to go without adding to the pollution up here.
            </p>
          </div>
        </div>
        <div className="mt-20 text-center px-4">
          <p className="text-2xl md:text-3xl text-tertiary font-medium leading-relaxed max-w-4xl mx-auto">
            We run EVs built for Himalayan terrain — steep climbs, tight turns, and doing it all with utmost safety
          </p>
        </div>
      </section>

      {/* Why Electric */}
      <section className="bg-surface-container-low py-24" id="safety">
        <div className="max-w-screen-2xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden">
              <img className="w-full h-full object-cover" src="/assets/landingpage.webp" alt="EV dashboard navigation" />
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-4">Why we use electric vehicles</h2>
              <p className="text-lg text-tertiary">
                Himachal&apos;s air quality is one of the best in India. We&apos;d like to keep it that way. Our fleet runs on electric — no tailpipe emissions, less noise on mountain roads, and batteries that handle altitude just fine.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 bg-white/70 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">person_pin_circle</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface mb-1">Trained drivers</h4>
                  <p className="text-sm text-tertiary">Every driver knows how to handle an EV on hill roads. They&apos;re locals who know the terrain.</p>
                </div>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-white/70 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">emergency_share</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface mb-1">SOS &amp; support</h4>
                  <p className="text-sm text-tertiary">One-tap emergency alerts and a support line that&apos;s actually staffed 24/7.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 px-8 max-w-5xl mx-auto" id="roadmap">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight mb-4">Where we&apos;re headed</h2>
          <p className="text-lg text-tertiary max-w-2xl mx-auto">
            We&apos;re starting small and growing district by district.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-tertiary-fixed-dim rounded-full"></div>

          <div className="space-y-20">
            {/* Phase 1 — Active */}
            <div className="relative flex items-start justify-between group">
              <div className="w-[45%] text-right pr-10 hidden md:block">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide mb-2">Now — 2030</span>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">Phase 1</h3>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-surface shadow-md group-hover:scale-125 transition-transform duration-300 z-10"></div>
              <div className="md:w-[45%] pl-10">
                <div className="md:hidden mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide mb-1">Now — 2030</span>
                  <h3 className="text-xl font-headline font-extrabold text-on-surface">Phase 1</h3>
                </div>
                <h4 className="text-xl font-bold mb-2 text-primary">Kangra District Launch</h4>
                <p className="text-tertiary mb-3">
                  This is where we start. Dharamshala, McLeod Ganj, Palampur, Bir Billing — the routes tourists and locals use the most. We&apos;re setting up charging hubs and getting the first fleet on the road.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Dharamshala</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">McLeod Ganj</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Palampur</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Bir Billing</span>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative flex items-start justify-between group">
              <div className="w-[45%] text-right pr-10 hidden md:block">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide mb-2">2030 — 2033</span>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">Phase 2</h3>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-secondary border-4 border-surface shadow-md group-hover:scale-125 transition-transform duration-300 z-10"></div>
              <div className="md:w-[45%] pl-10">
                <div className="md:hidden mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">2030 — 2033</span>
                  <h3 className="text-xl font-headline font-extrabold text-on-surface">Phase 2</h3>
                </div>
                <h4 className="text-xl font-bold mb-2 text-secondary">Expand Across Himachal</h4>
                <p className="text-tertiary mb-3">
                  Coming soon. Have some patience these things take time.
                </p>

              </div>
            </div>

          
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-8 bg-surface-container-low">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-2xl md:text-3xl text-tertiary font-medium leading-relaxed max-w-4xl mx-auto mb-10">
            For <span className="text-primary font-bold">Himachal</span> by <span className="text-secondary font-bold">Himachali</span>
          </p>
          <h3 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">See where we go</h3>
          <p className="text-tertiary max-w-lg mx-auto">Check out our routes, tour packages, and the places you can visit across Kangra and beyond.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-sm font-semibold text-slate-500 pt-2">
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
