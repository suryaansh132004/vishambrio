import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[48px] bg-white pt-20 pb-12 ambient-shadow mt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 pb-20 max-w-screen-2xl mx-auto font-body text-sm">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="text-lg font-bold text-emerald-900 tracking-tighter font-headline">Vishambrio Cabs</div>
          <p className="text-slate-500 italic">"We are not just cabs; we are a sustainable transportation ecosystem"</p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center ambient-shadow hover:text-primary transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              href="#"
              aria-label="Visit our website"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">public</span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center ambient-shadow hover:text-primary transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              href="#"
              aria-label="Email us"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">alternate_email</span>
            </a>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-emerald-900 uppercase tracking-widest text-xs">Explore</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link className="hover:text-emerald-600 transition-all focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded px-1" href="/">Home</Link></li>
            <li><Link className="hover:text-emerald-600 transition-all focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded px-1" href="/#features">Features</Link></li>
            <li><Link className="hover:text-emerald-600 transition-all focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded px-1" href="/#safety">Safety</Link></li>
            <li><Link className="hover:text-emerald-600 transition-all focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded px-1" href="/#roadmap">Roadmap</Link></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-emerald-900 uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link className="hover:text-emerald-600 transition-all focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded px-1" href="#">About Us</Link></li>
            <li><Link className="hover:text-emerald-600 transition-all focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded px-1" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-emerald-900 uppercase tracking-widest text-xs">Newsletter</h4>
          <div className="flex">
            <input
              className="bg-surface border-none rounded-l-xl w-full px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              placeholder="Email address"
              type="email"
              aria-label="Email address for newsletter"
            />
            <button 
              className="bg-primary text-white px-4 rounded-r-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Submit newsletter"
            >
              <span className="material-symbols-outlined" aria-hidden="true">send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-12 py-8 ghost-border border-b-0 border-l-0 border-r-0 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400">© 2024 Vishambrio Cabs. Sustainable Himachal.</p>
        <div className="flex gap-8 text-xs text-slate-400">
          <Link className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1" href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
