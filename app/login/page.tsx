'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CountryCodeWheel, { COUNTRIES, CountryCode } from '@/components/CountryCodeWheel';

function LoginForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone fields for signup
  const [signupPhone, setSignupPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [isWheelOpen, setIsWheelOpen] = useState(false);

  const [signupSuccess, setSignupSuccess] = useState(false);

  const { login, signup } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoadingAuth(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (res?.error) {
          setErrorMsg('Invalid credentials. Please try again.');
          setIsLoadingAuth(false);
          return;
        }
        const redirect = searchParams.get('redirect');
        const step = searchParams.get('step');
        // [C4] Only allow internal paths starting with /
        const isSafeRedirect = redirect && /^\/[^/]/.test(redirect);
        if (isSafeRedirect) {
          router.push(redirect + (step ? `?step=${step}` : ''));
        } else {
          router.push('/?openBookings=true');
        }
      } else {
        // Build the combined phone string only if a number was entered
        const fullPhone = signupPhone.trim()
          ? `${selectedCountry.dialCode} ${signupPhone.trim()}`
          : undefined;

        const res = await signup(email, password, name, fullPhone);
        if (res?.error) {
          // Supabase returns a specific error when the email is already registered
          const msg = res.error.message?.toLowerCase() ?? '';
          if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
            setErrorMsg('An account with this email already exists. Please log in instead.');
          } else {
            setErrorMsg(res.error.message || 'Signup failed. Please check your details and try again.');
          }
          setIsLoadingAuth(false);
          return;
        }

        // Show email verification notice instead of redirecting
        setSignupSuccess(true);
        setIsLoadingAuth(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
      setIsLoadingAuth(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #041f10 0%, #0d381c 50%, #064e3b 100%)' }}>
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-15 mix-blend-overlay"
        style={{ backgroundImage: 'url("/assets/heroimage.png")', filter: 'grayscale(40%) contrast(120%)' }}
      ></div>

      <div className="relative z-10 w-full flex flex-col items-center px-4 py-8">
        {/* Logo Header */}
        <Link href="/" className="flex flex-col items-center space-y-2 mb-8 animate-entrance opacity-0" style={{ animationFillMode: 'forwards' }}>
          <img src="/assets/logo.png" alt="Vishambrio Logo" className="h-16 w-auto object-contain mb-2" />
          <span className="text-3xl font-extrabold text-emerald-400 tracking-tighter font-headline">Vishambrio Cabs</span>
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-emerald-300/80">Sustainable Himachal</span>
        </Link>

        {/* Auth Box */}
        <div
          className="animate-entrance opacity-0 delay-100 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
            animationFillMode: 'forwards'
          }}
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-white/5" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'login'}
              className={`flex-1 p-4 font-headline font-extrabold text-sm text-center cursor-pointer transition-all border-b-2 focus-visible:outline-none focus-visible:bg-white/5 ${tab === 'login' ? 'text-[#34d399] border-[#34d399] bg-white/5' : 'text-white/75 border-transparent'}`}
              onClick={() => { setTab('login'); setSignupSuccess(false); setErrorMsg(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab('login'); } }}
            >
              Log In
            </button>
            <button
              role="tab"
              aria-selected={tab === 'signup'}
              className={`flex-1 p-4 font-headline font-extrabold text-sm text-center cursor-pointer transition-all border-b-2 focus-visible:outline-none focus-visible:bg-white/5 ${tab === 'signup' ? 'text-[#34d399] border-[#34d399] bg-white/5' : 'text-white/75 border-transparent'}`}
              onClick={() => { setTab('signup'); setSignupSuccess(false); setErrorMsg(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab('signup'); } }}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8 text-white">
            {/* Email verification success screen */}
            {signupSuccess ? (
              <div className="space-y-5 animate-entrance text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-emerald-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-extrabold tracking-tight">Check your inbox</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We sent a verification link to{' '}
                    <span className="text-emerald-300 font-bold">{email}</span>.
                    <br />Click it to activate your account, then log in.
                  </p>
                </div>
                <button
                  onClick={() => { setTab('login'); setSignupSuccess(false); }}
                  className="w-full btn-primary-gradient text-on-primary py-3 rounded-xl font-headline font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399]"
                >
                  Go to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-headline font-extrabold tracking-tight">
                    {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-xs font-semibold text-slate-300">
                    {tab === 'login'
                      ? 'Sign in to retrieve your personal green rides and invoices.'
                      : 'Start your zero-emission Himalayan journey with us today.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-bold text-red-200 animate-entrance">
                    <p>{errorMsg}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {tab === 'signup' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-emerald-300">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-[#34d399] focus:bg-white/10 focus:ring-4 focus:ring-[#34d399]/10 focus-visible:outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arjun@gmail.com"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-[#34d399] focus:bg-white/10 focus:ring-4 focus:ring-[#34d399]/10 focus-visible:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-300">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-[#34d399] focus:bg-white/10 focus:ring-4 focus:ring-[#34d399]/10 focus-visible:outline-none"
                    />
                  </div>

                  {/* Optional phone — signup only */}
                  {tab === 'signup' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Mobile Number{' '}
                        <span className="font-normal text-white/40 normal-case tracking-normal">(optional)</span>
                      </label>
                      <div className="relative flex items-center bg-white/5 border-2 border-white/10 rounded-xl focus-within:border-[#34d399] focus-within:bg-white/10 transition-all">
                        <button
                          type="button"
                          onClick={() => setIsWheelOpen(!isWheelOpen)}
                          className="flex items-center gap-1 px-3 py-3 border-r border-white/10 font-semibold text-sm text-white/80 hover:bg-white/10 rounded-l-xl transition-colors cursor-pointer select-none"
                        >
                          <span className="text-[10px] font-extrabold bg-white/10 text-white/80 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-wider leading-none select-none w-7 text-center">
                            {selectedCountry.flag}
                          </span>
                          <span className="text-white/80">{selectedCountry.dialCode}</span>
                          <span className="material-symbols-outlined text-[16px] text-white/40">keyboard_arrow_down</span>
                        </button>

                        <CountryCodeWheel
                          selectedCountry={selectedCountry}
                          onSelect={setSelectedCountry}
                          isOpen={isWheelOpen}
                          onClose={() => setIsWheelOpen(false)}
                        />

                        <input
                          className="flex-1 bg-transparent px-4 py-3 font-semibold text-sm outline-none text-white placeholder:text-white/30"
                          placeholder="xxxxx xxxxx"
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoadingAuth}
                  className="w-full btn-primary-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg hover:shadow-lg active:scale-98 transition-all shadow-md mt-6 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] disabled:opacity-50"
                >
                  {isLoadingAuth ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    tab === 'login' ? 'Log In' : 'Sign Up'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-8 text-sm font-semibold text-emerald-300/80 hover:text-emerald-300 transition-colors flex items-center gap-1.5 animate-entrance opacity-0 delay-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded p-1"
          style={{ animationFillMode: 'forwards' }}
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
