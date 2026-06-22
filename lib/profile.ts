import { UserProfile, Complaint } from './types';
import { BookingsStore } from './bookings';

export const ProfileStore = {
  getStorageKey(email: string): string {
    return `vishambrio_profile_${email.trim().toLowerCase()}`;
  },

  seedUserProfile(email: string): void {
    if (typeof window === 'undefined') return;
    const key = this.getStorageKey(email);
    if (!localStorage.getItem(key)) {
      const profile: UserProfile = {
        phone: '+91 98765 43210',
        memberLevel: 'Eco-Explorer',
        seededTokens: 185,
        seededCarbon: 37,
        seededMoney: 4350,
        complaints: [
          {
            id: 'CMP-4921',
            category: 'AC / Climate',
            text: 'AC was slightly high during the McLeodganj climb. Driver was very polite though!',
            status: 'Resolved',
            reply: 'We have recalibrated vehicle climate controls for extreme climbs. Thank you for your feedback!',
            timestamp: new Date().getTime() - 6 * 24 * 60 * 60 * 1000,
          },
        ],
      };
      localStorage.setItem(key, JSON.stringify(profile));
    }
  },

  getUserProfile(email: string): UserProfile | null {
    if (typeof window === 'undefined') return null;
    this.seedUserProfile(email);
    try {
      const key = this.getStorageKey(email);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error fetching user profile:', e);
      return null;
    }
  },

  updateProfilePhone(email: string, newPhone: string): boolean {
    if (typeof window === 'undefined' || !email) return false;
    try {
      const key = this.getStorageKey(email);
      const profile = this.getUserProfile(email);
      if (profile) {
        profile.phone = newPhone.trim();
        localStorage.setItem(key, JSON.stringify(profile));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error updating phone:', e);
      return false;
    }
  },

  submitComplaint(email: string, category: string, text: string): Complaint | false {
    if (typeof window === 'undefined' || !email || !text) return false;
    try {
      const key = this.getStorageKey(email);
      const profile = this.getUserProfile(email);
      if (profile) {
        const randomId = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
        const newComplaint: Complaint = {
          id: randomId,
          category: category,
          text: text.trim(),
          status: 'Submitted',
          timestamp: new Date().getTime(),
        };
        profile.complaints.unshift(newComplaint);
        localStorage.setItem(key, JSON.stringify(profile));
        return newComplaint;
      }
      return false;
    } catch (e) {
      console.error('Error submitting complaint:', e);
      return false;
    }
  },

  _getBookingFareTotal(email: string): number {
    const bookings = BookingsStore.getUserBookings(email);
    return bookings.reduce((sum, b) => {
      if (b.status === 'Completed' || b.status === 'Confirmed') {
        return sum + (parseInt(b.fare.replace(/[^0-9]/g, '')) || 0);
      }
      return sum;
    }, 0);
  },

  getTotalMoneySpent(email: string): number {
    if (!email) return 0;
    const profile = this.getUserProfile(email);
    if (!profile) return 0;
    return profile.seededMoney + this._getBookingFareTotal(email);
  },

  getCarbonMetrics(email: string): { tokens: number; carbon: number } {
    if (!email) return { tokens: 0, carbon: 0 };
    const profile = this.getUserProfile(email);
    if (!profile) return { tokens: 0, carbon: 0 };
    const totalSpent = this._getBookingFareTotal(email);
    const additionalTokens = Math.floor(totalSpent / 25);
    const additionalCarbon = parseFloat((additionalTokens * 0.2).toFixed(1));
    return {
      tokens: profile.seededTokens + additionalTokens,
      carbon: parseFloat((profile.seededCarbon + additionalCarbon).toFixed(1)),
    };
  },
};
