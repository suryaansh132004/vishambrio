'use client';

import React, { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalName = name;
    if (tab === 'login') {
      finalName = email.split('@')[0];
      finalName = finalName.charAt(0).toUpperCase() + finalName.slice(1);
      if (finalName.toLowerCase() === 'arjun') finalName = 'Arjun Sharma';
    }

    login(email, finalName || 'Guest User');

    const redirect = searchParams.get('redirect');
    const step = searchParams.get('step');

    // [C4] Validate redirect param to prevent open redirect
    // Since URLs have been cleaned (e.g. /contact instead of contact.html),
    // we only allow internal paths starting with /
    const isSafeRedirect = redirect && redirect.startsWith('/');
    
    if (isSafeRedirect) {
      router.push(redirect + (step ? `?step=${step}` : ''));
    } else {
      router.push('/?openBookings=true');
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

        {/* Auth Box Container */}
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
          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5" role="tablist">
            <button 
              role="tab"
              aria-selected={tab === 'login'}
              className={`flex-1 p-4 font-headline font-extrabold text-sm text-center cursor-pointer transition-all border-b-2 focus-visible:outline-none focus-visible:bg-white/5 ${tab === 'login' ? 'text-[#34d399] border-[#34d399] bg-white/5' : 'text-white/75 border-transparent'}`}
              onClick={() => setTab('login')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setTab('login');
                }
              }}
            >
              Log In
            </button>
            <button 
              role="tab"
              aria-selected={tab === 'signup'}
              className={`flex-1 p-4 font-headline font-extrabold text-sm text-center cursor-pointer transition-all border-b-2 focus-visible:outline-none focus-visible:bg-white/5 ${tab === 'signup' ? 'text-[#34d399] border-[#34d399] bg-white/5' : 'text-white/75 border-transparent'}`}
              onClick={() => setTab('signup')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setTab('signup');
                }
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Forms Area */}
          <div className="p-8 text-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-headline font-extrabold tracking-tight">
                  {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs font-semibold text-slate-300">
                  {tab === 'login' ? 'Sign in to retrieve your personal green rides and invoices.' : 'Start your zero-emission Himalayan journey with us today.'}
                </p>
              </div>

              <div className="space-y-4">
                {tab === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-300">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arjun Sharma"
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
              </div>

              <button className="w-full btn-primary-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg hover:shadow-lg active:scale-98 transition-all shadow-md mt-6 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399]">
                {tab === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Back Link */}
        <Link href="/" className="mt-8 text-sm font-semibold text-emerald-300/80 hover:text-emerald-300 transition-colors flex items-center gap-1.5 animate-entrance opacity-0 delay-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded p-1" style={{ animationFillMode: 'forwards' }}>
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
