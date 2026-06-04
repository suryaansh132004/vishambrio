'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProfileStore } from '@/lib/profile';
import { UserProfile, Complaint } from '@/lib/types';

export default function ProfileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints'>('overview');
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState({ tokens: 0, carbon: 0 });
  const [totalSpent, setTotalSpent] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  const [complaintCategory, setComplaintCategory] = useState('');
  const [complaintText, setComplaintText] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-profile-drawer', handleOpen);
    return () => window.removeEventListener('open-profile-drawer', handleOpen);
  }, []);

  useEffect(() => {
    if (user?.email) {
      setProfile(ProfileStore.getUserProfile(user.email));
      setMetrics(ProfileStore.getCarbonMetrics(user.email));
      setTotalSpent(ProfileStore.getTotalMoneySpent(user.email));
      setPhoneInput(ProfileStore.getUserProfile(user.email)?.phone || '');
    }
  }, [user, isOpen]);

  const closeDrawer = () => setIsOpen(false);

  const handleSavePhone = () => {
    if (user?.email && phoneInput) {
      ProfileStore.updateProfilePhone(user.email, phoneInput);
      setProfile(ProfileStore.getUserProfile(user.email));
      setIsEditing(false);
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email && complaintCategory && complaintText) {
      ProfileStore.submitComplaint(user.email, complaintCategory, complaintText);
      setProfile(ProfileStore.getUserProfile(user.email));
      setComplaintCategory('');
      setComplaintText('');
      alert('Complaint submitted successfully.');
    }
  };

  if (!user || !profile) return null; // Or show login prompt if needed

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl z-[99999] transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-900 text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">account_circle</span>
            <h2 className="text-xl font-headline font-bold">My Green Profile</h2>
          </div>
          <button onClick={closeDrawer} className="p-1 rounded-full hover:bg-white/10 text-white transition-colors" aria-label="Close Profile">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 border-b border-slate-100 bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 font-headline font-bold text-sm text-slate-500 border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'overview' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100' : 'border-transparent hover:text-emerald-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span> Overview
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-4 font-headline font-bold text-sm text-slate-500 border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'complaints' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100' : 'border-transparent hover:text-emerald-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">chat</span> Complaints
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 font-headline font-extrabold text-2xl flex items-center justify-center shadow-inner">
                  {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline font-extrabold text-lg leading-tight">{user.name}</h3>
                  <span className="text-xs text-emerald-200 block font-medium truncate">{user.email}</span>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 mt-1 border border-emerald-700/50">
                    {profile.memberLevel}
                  </span>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Details</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input type="text" value={user.name} disabled className="w-full wizard-input py-2 px-3 bg-slate-50 text-sm font-semibold border-2 border-transparent disabled:opacity-85" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input type="email" value={user.email} disabled className="w-full wizard-input py-2 px-3 bg-slate-50 text-sm font-semibold border-2 border-transparent disabled:opacity-85" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                  <input 
                    type="text" 
                    value={phoneInput} 
                    onChange={(e) => setPhoneInput(e.target.value)}
                    disabled={!isEditing} 
                    className={`w-full wizard-input py-2 px-3 text-sm font-semibold border-2 ${isEditing ? 'bg-white border-emerald-400' : 'bg-slate-50 border-transparent disabled:opacity-85'}`} 
                  />
                </div>
                {isEditing ? (
                  <button onClick={handleSavePhone} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors mt-2">
                    Save Details
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="w-full py-2.5 bg-slate-100 hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs transition-colors border border-transparent hover:border-emerald-100 mt-2">
                    Edit Details
                  </button>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-emerald-100/50 p-4 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Green Tokens</span>
                    <span className="material-symbols-outlined text-emerald-600 text-lg">eco</span>
                  </div>
                  <div>
                    <div className="text-3xl font-headline font-extrabold text-emerald-950">{metrics.tokens}</div>
                    <span className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest block mt-0.5">Eco-Points Earned🌱</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-emerald-100/50 p-4 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CO₂ Saved</span>
                    <span className="material-symbols-outlined text-emerald-600 text-lg">forest</span>
                  </div>
                  <div>
                    <div className="text-3xl font-headline font-extrabold text-emerald-950">{metrics.carbon} <span className="text-sm">kg</span></div>
                    <span className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest block mt-0.5">vs Diesel Travel 💨</span>
                  </div>
                </div>
                <div className="col-span-2 bg-white rounded-2xl border border-emerald-100/50 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Total Travel Spend</span>
                      <div className="text-2xl font-headline font-extrabold text-emerald-950">₹{totalSpent.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs font-semibold text-amber-900 leading-relaxed">
                <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                Your feedback helps us maintain the highest standards of safety and sustainability across our Himalayan fleet.
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">File a New Report</h4>
                <form onSubmit={handleSubmitComplaint} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      required
                      className="w-full wizard-input py-2 px-3 text-sm font-semibold"
                    >
                      <option value="" disabled>Select a category...</option>
                      <option value="Driver Behavior">Driver Behavior</option>
                      <option value="Vehicle Condition">Vehicle Condition</option>
                      <option value="AC / Climate">AC / Climate</option>
                      <option value="App / Booking Issue">App / Booking Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</label>
                    <textarea
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      required
                      placeholder="Please describe the issue..."
                      className="w-full wizard-input py-2 px-3 text-sm font-semibold resize-none h-24"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors mt-2 shadow-md">
                    Submit Report
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">History</h4>
                {profile.complaints.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No reports filed yet.</p>
                ) : (
                  profile.complaints.map((c) => (
                    <ComplaintCard key={c.id} complaint={c} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-800';
      case 'Investigating': return 'bg-amber-100 text-amber-800';
      default: return 'bg-sky-100 text-sky-800';
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket ID: {complaint.id}</span>
          <h5 className="font-bold text-slate-800 text-sm">{complaint.category}</h5>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest ${getBadgeStyle(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>
      <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        "{complaint.text}"
      </p>
      {complaint.reply && (
        <div className="mt-2 pl-3 border-l-2 border-emerald-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Vishambrio Support</span>
          <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
            {complaint.reply}
          </p>
        </div>
      )}
    </div>
  );
}
