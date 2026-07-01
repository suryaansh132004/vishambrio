'use client';

import React, { useState } from 'react';
import { openBookingWizard } from '@/components/Navbar';

export default function TouristAttractionsPage() {
  const [search, setSearch] = useState('');

  const attractions = [
    {
      title: 'Kangra Fort',
      desc: 'One of the oldest and largest forts in India, offering panoramic views of the Dhauladhar range and the Kangra valley.',
      img: '/assets/kangra_fort.png',
      category: 'History',
      tokens: '+110 Tokens',
      co2: '22kg CO2 saved',
      pickup: 'gaggal',
      drop: 'kangra_temple'
    },
    {
      title: 'Masroor Rock Cut Temple',
      desc: "Known as the \u2018Ellora of Himachal\u2019, these 8th-century monolithic rock-cut temples are a marvel of ancient architecture.",
      img: '/assets/masroor_temple.png',
      category: 'Architecture',
      tokens: '+140 Tokens',
      co2: '28kg CO2 saved',
      pickup: 'gaggal',
      drop: 'kangra_temple'
    },
    {
      title: 'McLeod Ganj',
      desc: 'Home to the Dalai Lama, this vibrant town is famous for its Tibetan culture, monasteries, and the stunning Bhagsu Falls.',
      img: '/assets/mcleod_ganj.png',
      category: 'Culture',
      tokens: '+85 Tokens',
      co2: '17kg CO2 saved',
      pickup: 'gaggal',
      drop: 'mcleodganj'
    },
    {
      title: 'Bir Billing',
      desc: 'The paragliding capital of India, Bir is also a center for ecotourism, spiritual studies, and meditation.',
      img: '/assets/bir_billing.png',
      category: 'Adventure',
      tokens: '+185 Tokens',
      co2: '37kg CO2 saved',
      pickup: 'gaggal',
      drop: 'dharamshala'
    },
    {
      title: 'Baijnath Temple',
      desc: 'A beautiful 13th-century temple dedicated to Lord Shiva, renowned for its exquisite stone carvings and peaceful atmosphere.',
      img: '/assets/baijnath_temple.png',
      category: 'Spiritual',
      tokens: '+150 Tokens',
      co2: '30kg CO2 saved',
      pickup: 'gaggal',
      drop: 'kangra_temple'
    },
    {
      title: 'Palampur Tea Gardens',
      desc: 'Explore the lush green tea estates of Palampur, often referred to as the tea capital of Northwest India.',
      img: '/assets/palampur_tea.png',
      category: 'Nature',
      tokens: '+120 Tokens',
      co2: '24kg CO2 saved',
      pickup: 'gaggal',
      drop: 'dharamshala'
    }
  ];

  const filteredAttractions = attractions.filter(attr => {
    const query = search.toLowerCase();
    return (
      attr.title.toLowerCase().includes(query) ||
      attr.desc.toLowerCase().includes(query) ||
      attr.category.toLowerCase().includes(query)
    );
  });

  return (
    <main>
      {/* Hero */}
      <section className="flex items-center justify-center px-8 py-24 text-center" style={{ background: 'linear-gradient(135deg, #071e27 0%, #354a53 50%, #445963 100%)', minHeight: '40vh' }}>
        <div className="space-y-5 animate-entrance opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="material-symbols-outlined text-blue-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Discover Himachal</span>
          </div>
          <h1 className="display-lg text-white">Tourist <span style={{ color: '#b4cad6' }}>Attractions</span></h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Explore the majestic forts, spiritual temples, and scenic landscapes of Himachal Pradesh.
          </p>
        </div>
      </section>

      {/* Attractions Grid */}
      <section className="py-20 px-6 max-w-screen-2xl mx-auto">
        <div className="mb-12 max-w-lg mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search by name, description, or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 pl-12 pr-6 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm text-sm font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-700">search</span>
        </div>

        {filteredAttractions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 max-w-md mx-auto space-y-4 shadow-sm animate-entrance">
            <span className="material-symbols-outlined text-slate-300 text-5xl">search_off</span>
            <h4 className="font-headline font-bold text-slate-700 text-lg">No Attractions Found</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">Try searching for other popular spots like &ldquo;Bir&rdquo;, &ldquo;Fort&rdquo;, or &ldquo;Temple&rdquo;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAttractions.map((attr, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 group">
                <div className="h-[250px] bg-[#f2f4f3] flex items-center justify-center overflow-hidden">
                  <img src={attr.img} alt={attr.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-headline font-extrabold text-on-surface">{attr.title}</h3>
                  <p className="text-tertiary leading-relaxed text-sm">{attr.desc}</p>
                  <div className="pt-4 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest block">{attr.category}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                        <span className="material-symbols-outlined text-xs" aria-hidden="true">eco</span> {attr.tokens} &nbsp;•&nbsp; {attr.co2} <span className="material-symbols-outlined text-xs" aria-hidden="true">bolt</span>
                      </span>
                    </div>
                    <button
                      onClick={() => openBookingWizard({ pickup: attr.pickup, drop: attr.drop })}
                      className="text-primary font-bold text-sm flex items-center gap-1 group/btn cursor-pointer bg-transparent border-none focus-visible:outline-none"
                    >
                      Plan Visit <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
