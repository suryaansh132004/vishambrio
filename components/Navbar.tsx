'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingsContext'; // Just in case it's needed for drawer state, though we can manage drawer state locally or globally. Wait, the drawer state needs to be accessible from the Navbar.

// A simple global state for drawers using custom events or just simple state in layout.
// To keep things simple and reactive without a complex global store, we can use a small event emitter or just React context.
// Let's use simple CustomEvents for the drawers, just like the old app, or we can use state in the layout.
// Since the layout renders the drawers, we'll dispatch custom events.
export const openBookingsDrawer = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-bookings-drawer'));
};
export const openProfileDrawer = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-profile-drawer'));
};
export const openBookingWizard = (detail?: { pickup?: string; drop?: string }) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('open-booking-wizard', { detail });
    window.dispatchEvent(event);
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Popular Routes', href: '/popular-routes' },
    { name: 'Packaged Tours', href: '/packaged-tours' },
    { name: 'Attractions', href: '/tourist-attractions' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 ambient-shadow">
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-3 text-xl font-extrabold text-emerald-900 tracking-tighter font-headline">
          <img src="/assets/logo.png" alt="Vishambrio Logo" className="h-8 w-auto object-contain" />
          <span>Vishambrio Cabs</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-headline font-semibold tracking-tight">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-all duration-300 ${
                  isActive
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative group hidden sm:block desktop-auth-container">
              <button
                onClick={openProfileDrawer}
                className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-headline font-extrabold flex items-center justify-center shadow-sm hover:bg-emerald-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                aria-label="Open green profile drawer"
              >
                {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)}
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 hidden group-hover:block group-focus-within:block z-50 animate-modal-entrance">
                <div className="px-4 py-2 border-b border-slate-100 text-xs font-semibold text-slate-400 leading-tight">
                  Logged in as <span className="font-bold text-slate-700 block mt-0.5 truncate">{user.name}</span>
                </div>
                <button
                  onClick={openProfileDrawer}
                  className="w-full text-left block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-700 font-semibold transition-colors border-b border-slate-100/50 focus-visible:bg-slate-50 focus-visible:text-emerald-700 focus-visible:outline-none"
                >
                  My Profile
                </button>
                <button
                  onClick={openBookingsDrawer}
                  className="w-full text-left block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-700 font-semibold transition-colors focus-visible:bg-slate-50 focus-visible:text-emerald-700 focus-visible:outline-none"
                >
                  My Bookings
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 font-bold border-t border-slate-100 transition-colors mt-1 focus-visible:bg-red-50 focus-visible:text-red-800 focus-visible:outline-none"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:block text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 px-4 py-2 rounded-xl font-headline font-bold text-sm transition-colors desktop-login-btn border border-transparent hover:border-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
            >
              Log In
            </Link>
          )}

          <button
            onClick={() => openBookingWizard()}
            className="hidden sm:block btn-primary-gradient text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold active:scale-95 duration-200 shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none cursor-pointer"
          >
            Book Now
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-surface-container-low rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined text-3xl" aria-hidden="true">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col absolute top-full left-0 w-full bg-surface/95 backdrop-blur-2xl p-6 gap-6 border-t border-outline-variant shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-600 hover:text-emerald-600 transition-all font-headline font-semibold text-lg"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openBookingsDrawer();
                }}
                className="text-slate-600 hover:text-emerald-600 transition-all flex items-center gap-2 font-semibold border-t border-slate-100 pt-4 w-full text-left focus-visible:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded"
              >
                <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span> My Bookings
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openProfileDrawer();
                }}
                className="text-slate-600 hover:text-emerald-600 transition-all flex items-center gap-2 font-semibold border-t border-slate-100 pt-4 w-full text-left focus-visible:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded"
              >
                <span className="material-symbols-outlined" aria-hidden="true">account_circle</span> My Profile
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="text-red-600 hover:text-red-800 transition-all flex items-center gap-2 font-bold border-t border-slate-100 pt-4 w-full text-left focus-visible:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
              >
                <span className="material-symbols-outlined" aria-hidden="true">logout</span> Log Out ({user.name.split(' ')[0]})
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-emerald-700 hover:text-emerald-900 transition-all flex items-center gap-2 font-semibold border-t border-slate-100 pt-4 w-full text-left focus-visible:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded"
            >
              <span className="material-symbols-outlined" aria-hidden="true">login</span> Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
