// ==========================================
// VISHAMBRIO CABS — SHARED DOMAIN TYPES
// ==========================================
// Single source of truth for all data shapes.
// When the backend (Prisma/API routes) arrives, these
// interfaces will become the contract between client & server.

export interface User {
  id: string;
  name: string;
  email: string;
}

export type BookingStatus = 'Confirmed' | 'Driver Assigned' | 'En Route' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;           // e.g. 'EV-HP-abc123-789'
  name: string;         // Lead rider name
  phone: string;
  email: string;
  date: string;         // ISO date string
  time: string;         // HH:MM
  pickup: string;       // Full display name of pickup location
  drop: string;         // Full display name of drop-off location
  vehicle: string;      // e.g. 'Nexon EV'
  fare: string;         // Display string e.g. '₹2,270'
  status: BookingStatus;
  timestamp: number;    // Unix ms
  otp: number;
}

export interface Complaint {
  id: string;           // e.g. 'CMP-4921'
  category: string;
  text: string;
  status: 'Submitted' | 'Investigating' | 'Resolved';
  timestamp: number;
  reply?: string;
}

export interface UserProfile {
  phone: string;
  memberLevel: string;
  seededTokens: number;
  seededCarbon: number;
  seededMoney: number;
  complaints: Complaint[];
}

// Form data that flows through the 7-step booking wizard
export interface BookingFormData {
  journeyType: 'oneway' | 'roundtrip';
  pickup: string;       // select value (e.g. 'pathankot')
  pickupLabel: string;  // display label
  drop: string;         // select value (e.g. 'dharamshala')
  dropLabel: string;
  date: string;
  time: string;
  returnDate: string;
  returnTime: string;
  returnType: 'sameday' | 'multiday';
  returnPickup: string;
  returnPickupLabel: string;
  riderName: string;
  riderPhone: string;
  riderEmail: string;
  whatsappUpdates: boolean;
  transitNumber: string;
  suitcases: number;
  handbags: number;
  fleet: 'nexon' | 'xprest';
  baseFare: number;
  gst: number;
  totalFare: number;
  paymentMethod: 'upi' | 'card' | 'partial';
}

export const INITIAL_FORM_DATA: BookingFormData = {
  journeyType: 'oneway',
  pickup: '',
  pickupLabel: '',
  drop: '',
  dropLabel: '',
  date: '',
  time: '',
  returnDate: '',
  returnTime: '',
  returnType: 'sameday',
  returnPickup: '',
  returnPickupLabel: '',
  riderName: '',
  riderPhone: '',
  riderEmail: '',
  whatsappUpdates: true,
  transitNumber: '',
  suitcases: 2,
  handbags: 2,
  fleet: 'nexon',
  baseFare: 2150,
  gst: 108,
  totalFare: 2258,
  paymentMethod: 'upi',
};

// Pricing matrix: pickup -> drop -> Nexon base fare (INR)
export const PRICING_MATRIX: Record<string, Record<string, number>> = {
  pathankot: {
    dharamshala: 2150,
    mcleodganj: 2400,
    kangra_temple: 2250,
  },
  gaggal: {
    dharamshala: 450,
    mcleodganj: 650,
    kangra_temple: 700,
  },
  kandwal: {
    dharamshala: 1600,
    mcleodganj: 1850,
    kangra_temple: 1500,
  },
};

// Approximate travel times: pickup -> drop -> time (in minutes)
export const TRAVEL_TIME_MATRIX_MINUTES: Record<string, Record<string, number>> = {
  pathankot: {
    dharamshala: 150, // 2.5 hours
    mcleodganj: 180,  // 3 hours
    kangra_temple: 120, // 2 hours
  },
  gaggal: {
    dharamshala: 45,
    mcleodganj: 60,
    kangra_temple: 30,
  },
  kandwal: {
    dharamshala: 120,
    mcleodganj: 150,
    kangra_temple: 90,
  },
};

export const PICKUP_OPTIONS = [
  { value: 'pathankot', label: 'Pathankot Cantt Railway Station (PTK)' },
  { value: 'gaggal', label: 'Gaggal Airport (DHM)' },
  { value: 'kandwal', label: 'Kandwal Garage (Kangra Entry)' },
];

export const DROP_OPTIONS = [
  { value: 'dharamshala', label: 'Dharamshala Skyway Terminal' },
  { value: 'mcleodganj', label: 'McLeodganj Main Square' },
  { value: 'kangra_temple', label: 'Kangra Devi Temple' },
];

export const RETURN_PICKUP_OPTIONS: Record<string, { value: string; label: string }[]> = {
  dharamshala: [
    { value: 'dharamshala_skyway', label: 'Dharamshala Skyway Terminal' },
    { value: 'hpca_stadium', label: 'HPCA Cricket Stadium Parking' },
    { value: 'kotwali_bazaar', label: 'Kotwali Bazaar (Main Market)' },
    { value: 'dari_ground', label: 'Dari Mela Ground' },
  ],
  mcleodganj: [
    { value: 'mcleod_square', label: 'McLeodganj Main Square' },
    { value: 'bhagsunag_parking', label: 'Bhagsunag Waterfall Parking' },
    { value: 'dharamkot_tushita', label: 'Dharamkot (Tushita Road)' },
    { value: 'dal_lake', label: 'Dal Lake Parking' },
  ],
  kangra_temple: [
    { value: 'kangra_temple_ent', label: 'Kangra Devi Temple Entrance' },
    { value: 'kangra_fort', label: 'Kangra Fort Parking' },
    { value: 'kangra_railway', label: 'Kangra Railway Station' },
    { value: 'ranital_chowk', label: 'Ranital Chowk' },
  ],
};
