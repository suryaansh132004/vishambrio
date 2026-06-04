import { Booking } from './types';

export const BookingsStore = {
  getStorageKey(email: string): string {
    return `vishambrio_bookings_${email.trim().toLowerCase()}`;
  },

  seedSampleBookings(email: string): void {
    if (typeof window === 'undefined') return;
    const key = this.getStorageKey(email);
    if (!localStorage.getItem(key)) {
      const samples: Booking[] = [
        {
          id: 'EV-HP-8932',
          name: 'Arjun Sharma',
          phone: '9876543210',
          email: email,
          date: '2026-05-28',
          time: '14:30',
          pickup: 'Gaggal Airport (DHM)',
          drop: 'McLeodganj Main Square',
          vehicle: 'Tata XPRES-T EV',
          fare: '₹530',
          status: 'Completed',
          timestamp: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
          otp: 5821,
        },
        {
          id: 'EV-HP-7419',
          name: 'Arjun Sharma',
          phone: '9876543210',
          email: email,
          date: '2026-05-24',
          time: '09:15',
          pickup: 'Pathankot Cantt Railway Station (PTK)',
          drop: 'Dharamshala Skyway Terminal',
          vehicle: 'Tata Nexon EV',
          fare: '₹2,270',
          status: 'Completed',
          timestamp: new Date().getTime() - 8 * 24 * 60 * 60 * 1000,
          otp: 9345,
        },
      ];
      localStorage.setItem(key, JSON.stringify(samples));
    }
  },

  getUserBookings(email: string): Booking[] {
    if (typeof window === 'undefined') return [];
    this.seedSampleBookings(email);
    try {
      const key = this.getStorageKey(email);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error fetching user bookings:', e);
      return [];
    }
  },

  addBooking(email: string, bookingData: Booking): boolean {
    if (typeof window === 'undefined' || !email) return false;
    try {
      const key = this.getStorageKey(email);
      const bookings = this.getUserBookings(email);
      bookings.unshift(bookingData);
      localStorage.setItem(key, JSON.stringify(bookings));
      return true;
    } catch (e) {
      console.error('Error adding booking:', e);
      return false;
    }
  },

  cancelBooking(id: string, email: string): boolean {
    if (typeof window === 'undefined' || !email) return false;
    try {
      const key = this.getStorageKey(email);
      let bookings = this.getUserBookings(email);
      bookings = bookings.map((b) => {
        if (b.id === id) b.status = 'Cancelled';
        return b;
      });
      localStorage.setItem(key, JSON.stringify(bookings));
      return true;
    } catch (e) {
      console.error('Error cancelling booking:', e);
      return false;
    }
  },
};
