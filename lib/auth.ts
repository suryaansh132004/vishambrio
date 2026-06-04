import { User } from './types';

const AUTH_KEY = 'vishambrio_current_user';

export const AuthStore = {
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userJson = localStorage.getItem(AUTH_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error('Error parsing session user:', e);
      return null;
    }
  },

  login(email: string, name: string): User | null {
    if (!email || !name) return null;
    const userData: User = { email: email.trim().toLowerCase(), name: name.trim() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return userData;
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
  }
};
