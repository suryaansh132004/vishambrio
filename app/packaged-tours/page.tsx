'use client';

import React from 'react';
import Link from 'next/link';

export default function PackagedToursPage() {
  const tours = [
    {
      name: '9 Devi Darshan',
      duration: '7 Days, 6 Nights',
      origin: 'Gaggal',
      route: 'Baglamukhi – Brajeshwari Devi – Chamunda Devi – Naina Devi – Jwalamukhi – Chintpurni – Hidimba Devi – Bhimakali – Tara Devi',
      price: '₹ 1,00,000/-',
    },
    {
      name: '7 Devi Darshan',
      duration: '5 Days, 4 Nights',
      origin: 'Gaggal',
      route: 'Baglamukhi – Brajeshwari Devi – Chamunda Devi – Naina Devi – Jwalamukhi – Chintpurni',
      price: '₹ 80,000/-',
    },
    {
      name: '5 Devi Darshan',
      duration: '3 Days, 2 Nights',
      origin: 'Gaggal',
      route: 'Chamunda Devi – Naina Devi – Jwalamukhi – Chintpurni – Tara Devi',
      price: '₹ 60,000/-',
    },
    {
      name: '3 Devi Darshan',
      duration: '2 Days, 1 Night',
      origin: 'Gaggal',
      route: 'Chamunda Devi – Jwalamukhi – Chintpurni',
      price: '₹ 40,000/-',
    },
    {
      name: 'Baba Balak Nath',
      duration: '1 Day',
      origin: 'Gaggal',
      route: 'Baba Balaknath',
      price: '₹ 20,000/-',
    },
    {
      name: 'Baijnath',
      duration: '1 Day',
      origin: 'Gaggal',
      route: 'Baijnath Paprola',
      price: '₹ 20,000/-',
    }
  ];

  return (
    <main>
      {/* Hero */}
      <section className="flex items-center justify-center px-8 py-24 text-center" style={{ background: 'linear-gradient(135deg, #1b6d24 0%, #0d631b 50%, #00436a 100%)', minHeight: '40vh' }}>
        <div className="space-y-5 animate-entrance opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="material-symbols-outlined text-green-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
            <span className="text-xs font-bold uppercase tracking-widest text-green-200">Exclusive Packages</span>
          </div>
          <h1 className="display-lg text-white">Tour <span style={{ color: '#a3f69c' }}>Packages</span></h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Carefully crafted journeys to the most sacred and beautiful destinations in Himachal.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-6 max-w-screen-2xl mx-auto">
        {/* Table view for Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: '0 12px' }}>
            <thead>
              <tr className="text-left text-sm font-bold text-tertiary border-b border-outline-variant">
                <th className="pb-4 px-6">Package Name</th>
                <th className="pb-4 px-6">Duration</th>
                <th className="pb-4 px-6">Origin</th>
                <th className="pb-4 px-6">Route</th>
                <th className="pb-4 px-6">Approx Price</th>
                <th className="pb-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, idx) => (
                <tr key={idx} className="bg-white hover:scale-[1.01] transition-all duration-300 shadow-sm hover:shadow-md" style={{ borderRadius: '20px' }}>
                  <td className="font-headline font-bold text-xl text-on-surface p-6 rounded-l-[20px]">{tour.name}</td>
                  <td className="text-tertiary p-6">{tour.duration}</td>
                  <td className="text-tertiary p-6">{tour.origin}</td>
                  <td className="text-sm text-tertiary max-w-md p-6 leading-relaxed">{tour.route}</td>
                  <td className="font-bold text-primary text-lg p-6">{tour.price}</td>
                  <td className="p-6 rounded-r-[20px]">
                    <Link href="/contact" className="bg-primary-container text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-emerald-800 transition-colors">
                      Inquiry
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card view for Mobile */}
        <div className="grid lg:hidden grid-cols-1 gap-6">
          {tours.map((tour, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 space-y-4 border border-slate-100">
              <h3 className="text-2xl font-headline font-extrabold text-on-surface">{tour.name}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-tertiary font-medium">{tour.duration}</span>
                <span className="font-bold text-primary text-base">{tour.price}</span>
              </div>
              <p className="text-sm text-tertiary leading-relaxed"><span className="font-bold text-slate-500">Route:</span> {tour.route}</p>
              <Link href="/contact" className="block text-center bg-primary text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md mt-4">
                Enquire Now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
