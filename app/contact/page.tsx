'use client';

import React, { useState, useEffect } from 'react';
import CountryCodeWheel, { COUNTRIES, CountryCode } from '@/components/CountryCodeWheel';
import { useAuth } from '@/context/AuthContext';
import { ProfileStore } from '@/lib/profile';

function parseStoredPhone(stored: string): { country: CountryCode; number: string } {
  const defaultCountry = COUNTRIES[0];
  if (!stored) return { country: defaultCountry, number: '' };
  const matched = COUNTRIES.find((c) => stored.startsWith(c.dialCode));
  if (matched) {
    return { country: matched, number: stored.slice(matched.dialCode.length).trim() };
  }
  return { country: defaultCountry, number: stored };
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isWheelOpen, setIsWheelOpen] = useState(false);

  // Prefilled fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const { user } = useAuth();

  // Prefill known user details when logged in
  useEffect(() => {
    if (!user) return;
    const nameParts = user.name.trim().split(' ');
    // Batch state updates outside of render cycle using setTimeout
    setTimeout(() => {
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }, 0);

    ProfileStore.getUserProfile(user.id).then((profile) => {
      if (profile?.phone) {
        const parsed = parseStoredPhone(profile.phone);
        setSelectedCountry(parsed.country);
        setPhoneNumber(parsed.number);
      }
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main>
      {/* Hero */}
      <section className="flex items-center justify-center px-8 py-24 text-center" style={{ background: 'linear-gradient(135deg, #0a3d12 0%, #1b6d24 50%, #2e7d32 100%)', minHeight: '40vh' }}>
        <div className="space-y-5 animate-entrance opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="material-symbols-outlined text-green-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            <span className="text-xs font-bold uppercase tracking-widest text-green-200">Get In Touch</span>
          </div>
          <h1 className="display-lg text-white">Contact <span style={{ color: '#a3f69c' }}>Vishambrio</span></h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re planning a trip across the mountains or have a question, we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-1">Email Us</p>
              <a href="mailto:gen@vishambrio.com" className="text-lg font-headline font-bold text-emerald-800 hover:text-emerald-600 transition-colors">gen@vishambrio.com</a>
              <p className="text-sm text-tertiary mt-1">We respond within 24 hours</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-1">Based In</p>
              <p className="text-lg font-headline font-bold text-on-surface">Kangra, Himachal Pradesh</p>
              <p className="text-sm text-tertiary mt-1">Gaggal Airport, HP 176024</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-1">Hours</p>
              <p className="text-lg font-headline font-bold text-on-surface">24 / 7 Available</p>
              <p className="text-sm text-tertiary mt-1">Fleet operations round the clock</p>
            </div>
          </div>
        </div>

        {/* Contact Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-emerald-900/5">
            <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-2">Send us a Message</h2>
            <p className="text-tertiary mb-8">Fill in the form below and our team will get back to you shortly.</p>

            {user && (
              <div className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
                <span className="material-symbols-outlined text-sm text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>person_check</span>
                Some fields have been pre-filled from your account. You can edit them freely.
              </div>
            )}

            {isSubmitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6 text-center animate-entrance">
                <span className="material-symbols-outlined text-primary text-4xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-headline font-bold text-emerald-800">Message sent! We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant" htmlFor="fname">First Name</label>
                    <input className="w-full bg-[#f2f4f3] border-2 border-transparent rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-all focus:border-[#0d631b] focus:bg-white" id="fname" placeholder="first name" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant" htmlFor="lname">Last Name</label>
                    <input className="w-full bg-[#f2f4f3] border-2 border-transparent rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-all focus:border-[#0d631b] focus:bg-white" id="lname" placeholder="last name" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
                  <input className="w-full bg-[#f2f4f3] border-2 border-transparent rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-all focus:border-[#0d631b] focus:bg-white" id="email" placeholder="you@example.com" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="phone">Phone (optional)</label>
                  <div className="relative flex items-center bg-[#f2f4f3] border-2 border-transparent rounded-xl focus-within:border-[#0d631b] focus-within:bg-white transition-all">
                    <button type="button" onClick={() => setIsWheelOpen(!isWheelOpen)} className="flex items-center gap-1 px-3 py-3 border-r border-slate-300/60 font-semibold text-sm text-slate-700 hover:bg-slate-200/50 rounded-l-xl transition-colors cursor-pointer select-none animate-entrance">
                      <span className="text-[10px] font-extrabold bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300/40 uppercase tracking-wider leading-none select-none w-7 text-center">{selectedCountry.flag}</span>
                      <span className="text-slate-800">{selectedCountry.dialCode}</span>
                      <span className="material-symbols-outlined text-[16px] text-slate-400 font-bold">keyboard_arrow_down</span>
                    </button>
                    <CountryCodeWheel selectedCountry={selectedCountry} onSelect={setSelectedCountry} isOpen={isWheelOpen} onClose={() => setIsWheelOpen(false)} />
                    <input className="flex-1 bg-transparent px-4 py-3 font-semibold text-sm outline-none text-slate-800" placeholder="xxxxx xxxxx" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <input type="hidden" id="phone" name="phone" value={phoneNumber ? `${selectedCountry.dialCode} ${phoneNumber}` : ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="subject">Subject</label>
                  <select className="w-full bg-[#f2f4f3] border-2 border-transparent rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-all focus:border-[#0d631b] focus:bg-white" id="subject" required defaultValue="">
                    <option value="" disabled>Select a topic…</option>
                    <option value="booking">Tour / Cab Booking</option>
                    <option value="packaged">Packaged Tour Inquiry</option>
                    <option value="routes">Route Information</option>
                    <option value="corporate">Corporate Travel</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="message">Message</label>
                  <textarea className="w-full bg-[#f2f4f3] border-2 border-transparent rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-all focus:border-[#0d631b] focus:bg-white resize-none" id="message" rows={5} placeholder="Tell us how we can help…" required></textarea>
                </div>
                <button className="w-full text-white rounded-xl py-4 font-headline font-bold text-base transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #0d631b 0%, #2e7d32 100%)' }} type="submit">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map Placeholder + Quick Info */}
          <div className="space-y-6">
            <div className="p-10 text-center rounded-[24px] min-h-[320px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' }}>
              <div className="space-y-4">
                <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <div>
                  <p className="text-xl font-headline font-bold text-emerald-900">Kangra District, Himachal Pradesh</p>
                  <p className="text-emerald-700 mt-1">Operation Hub: Gaggal (Dharamshala Airport)</p>
                </div>
                <a href="https://maps.google.com/?q=Kangra,Himachal+Pradesh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-emerald-800 font-headline font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View on Google Maps
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-[24px] p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-lg mb-1">Prefer email?</p>
                  <p className="text-white/70 text-sm mb-4">Drop us a direct mail and we&apos;ll respond within one business day.</p>
                  <a href="mailto:gen@vishambrio.com" className="inline-flex items-center gap-2 bg-white text-emerald-800 font-headline font-bold px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors text-sm">
                    <span className="material-symbols-outlined text-base">mail</span>
                    gen@vishambrio.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
