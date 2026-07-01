'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RouteMapModal from '@/components/RouteMapModal';
import { openBookingWizard } from '@/components/Navbar';

type FilterType = 'all' | 'popular' | 'scenic' | 'spiritual' | 'adventure';

export default function PopularRoutesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const routes = [
    {
      id: 'route-1',
      title: 'Gaggal → Dharamshala',
      bgClass: 'from-sky-400 to-blue-700',
      primaryBadge: { type: 'popular', label: 'Popular' },
      tags: ['popular', 'scenic'],
      distance: '~18 km',
      time: '~35 min',
      price: '₹450',
      desc: 'The most frequented route connecting Kangra Airport (Gaggal) to the heart of Dharamshala — perfect for airport transfers and city exploration.',
      pickup: 'gaggal',
      drop: 'dharamshala'
    },
    {
      id: 'route-2',
      title: 'Gaggal → McLeod Ganj',
      bgClass: 'from-emerald-500 to-green-800',
      primaryBadge: { type: 'popular', label: 'Popular' },
      tags: ['popular', 'scenic'],
      distance: '~25 km',
      time: '~55 min',
      price: '₹650',
      desc: 'Winding mountain roads up to the vibrant Tibetan refugee town — home of the Dalai Lama. Our most requested tourist transfer.',
      pickup: 'gaggal',
      drop: 'mcleodganj'
    },
    {
      id: 'route-3',
      title: 'Gaggal → Chamunda Devi',
      bgClass: 'from-amber-400 to-orange-700',
      primaryBadge: { type: 'spiritual', label: 'Spiritual' },
      tags: ['spiritual'],
      distance: '~20 km',
      time: '~45 min',
      price: '₹600',
      desc: 'A sacred pilgrimage route to the revered Chamunda Devi temple — one of the most important Shakti Peethas in Himachal.',
      pickup: 'gaggal',
      drop: 'kangra_temple'
    },
    {
      id: 'route-4',
      title: 'Gaggal → Jwalamukhi',
      bgClass: 'from-violet-500 to-purple-800',

      primaryBadge: { type: 'popular', label: 'Popular' },
      tags: ['spiritual', 'popular'],
      distance: '~55 km',
      time: '~1.5 hrs',
      price: '₹1,200',
      desc: 'The flame temple of Jwalamukhi is one of the 51 Shakti Peethas. A deeply spiritual journey through the Kangra Valley.',
      pickup: 'gaggal',
      drop: 'kangra_temple'
    },
    {
      id: 'route-5',
      title: 'Gaggal → Manali',
      bgClass: 'from-slate-600 to-slate-900',

      primaryBadge: { type: 'adventure', label: 'Adventure' },
      tags: ['adventure', 'scenic'],
      distance: '~230 km',
      time: '~6–7 hrs',
      price: '₹5,500',
      desc: 'A breathtaking drive through Kullu Valley — rivers, pine forests, and snow peaks culminating at the adventure capital of North India.',
      pickup: 'gaggal',
      drop: 'dharamshala'
    },
    {
      id: 'route-6',
      title: 'Gaggal → Baijnath Paprola',
      bgClass: 'from-cyan-500 to-teal-800',

      primaryBadge: { type: 'scenic', label: 'Scenic' },
      tags: ['scenic', 'spiritual'],
      distance: '~60 km',
      time: '~1.5 hrs',
      price: '₹1,400',
      desc: 'A serene drive along the Beas river to the ancient Shiva temple town of Baijnath — known for its exquisite 13th century temple.',
      pickup: 'gaggal',
      drop: 'kangra_temple'
    }
  ];

  const filteredRoutes = routes.filter(route => {
    const matchesFilter = filter === 'all' || route.tags.includes(filter);
    const matchesSearch = route.title.toLowerCase().includes(search.toLowerCase()) || route.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main>
      {/* Hero */}
      <section className="flex items-center justify-center px-8 py-24 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #071e27 0%, #0d3349 50%, #00639a 100%)', minHeight: '44vh' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 space-y-5 animate-entrance opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="material-symbols-outlined text-blue-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">route</span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Explore Himachal</span>
          </div>
          <h1 className="display-lg text-white">Popular <span style={{ color: '#96ccff' }}>Routes</span></h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            From dhauladhar peaks to ancient temples &mdash; discover our most-travelled electric cab routes.
          </p>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="py-10 px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          <button className={`px-5 py-2 rounded-full font-headline font-bold text-sm border-2 transition-all focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${filter === 'all' ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-800 hover:text-emerald-800'}`} onClick={() => setFilter('all')}>All Routes</button>
          <button className={`px-5 py-2 rounded-full font-headline font-bold text-sm border-2 transition-all focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${filter === 'popular' ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-800 hover:text-emerald-800'}`} onClick={() => setFilter('popular')}>Popular</button>
          <button className={`px-5 py-2 rounded-full font-headline font-bold text-sm border-2 transition-all focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${filter === 'scenic' ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-800 hover:text-emerald-800'}`} onClick={() => setFilter('scenic')}>Scenic</button>
          <button className={`px-5 py-2 rounded-full font-headline font-bold text-sm border-2 transition-all focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${filter === 'spiritual' ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-800 hover:text-emerald-800'}`} onClick={() => setFilter('spiritual')}>Spiritual</button>
          <button className={`px-5 py-2 rounded-full font-headline font-bold text-sm border-2 transition-all focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:outline-none ${filter === 'adventure' ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-800 hover:text-emerald-800'}`} onClick={() => setFilter('adventure')}>Adventure</button>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="pb-20 px-6 max-w-screen-xl mx-auto">
        <div className="mb-10 max-w-lg mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search routes by name or keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 pl-12 pr-6 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm text-sm font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none" 
            aria-label="Search routes by name or keyword"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-700" aria-hidden="true">search</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
              <div className={`h-48 bg-gradient-to-br ${route.bgClass} flex items-end p-6 relative overflow-hidden`}>
                <div className="relative z-10">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    route.primaryBadge.type === 'popular' ? 'bg-green-100 text-green-800' :
                    route.primaryBadge.type === 'spiritual' ? 'bg-amber-100 text-amber-800' :
                    route.primaryBadge.type === 'scenic' ? 'bg-blue-100 text-blue-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {route.primaryBadge.label}
                  </span>
                  <h3 className="text-white font-headline font-extrabold text-xl mt-2">{route.title}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1 text-tertiary"><span className="material-symbols-outlined text-base" aria-hidden="true">straighten</span> {route.distance}</span>
                  <span className="flex items-center gap-1 text-tertiary"><span className="material-symbols-outlined text-base" aria-hidden="true">schedule</span> {route.time}</span>
                  <span className="font-bold text-primary">From {route.price}</span>
                </div>
                <p className="text-sm text-tertiary leading-relaxed">{route.desc}</p>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setSelectedRouteId(route.id)} className="flex-1 text-center border-2 border-primary text-primary rounded-xl py-3 font-headline font-bold hover:bg-emerald-50/50 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                    <span className="material-symbols-outlined text-base" aria-hidden="true">map</span> Map & Stops
                  </button>
                  <button
                    onClick={() => openBookingWizard({ pickup: route.pickup, drop: route.drop })}
                    className="flex-1 text-center bg-primary text-white rounded-xl py-3 font-headline font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base" aria-hidden="true">bolt</span> Book Ride
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredRoutes.length === 0 && (
          <div className="text-center py-20 text-tertiary">
            <span className="material-symbols-outlined text-5xl mb-4 block" aria-hidden="true">search_off</span>
            <p className="font-headline font-bold text-xl">No routes found for this filter.</p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 rounded-[40px] p-12 text-center text-white">
          <h2 className="text-4xl font-headline font-extrabold mb-4">Need a Custom Route?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">Don&apos;t see your destination? Contact us and we&apos;ll plan your perfect Himachal road trip.</p>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-emerald-900 px-10 py-4 rounded-2xl font-headline font-extrabold text-lg hover:bg-green-50 transition-all hover:-translate-y-1 shadow-xl duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
            <span className="material-symbols-outlined" aria-hidden="true">mail</span>
            Contact Us
          </Link>
        </div>
      </section>

      <RouteMapModal isOpen={!!selectedRouteId} onClose={() => setSelectedRouteId(null)} routeId={selectedRouteId} />
    </main>
  );
}
