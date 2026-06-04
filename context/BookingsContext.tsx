'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Booking } from '@/lib/types';
import { BookingsStore } from '@/lib/bookings';
import { useAuth } from './AuthContext';

interface BookingsContextType {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (bookingData: Booking) => boolean;
  cancelBooking: (id: string) => boolean;
  refreshBookings: () => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBookings = useCallback(() => {
    if (user?.email) {
      setBookings(BookingsStore.getUserBookings(user.email));
    } else {
      setBookings([]);
    }
  }, [user?.email]);

  useEffect(() => {
    setIsLoading(true);
    refreshBookings();
    setIsLoading(false);
  }, [refreshBookings]);

  const addBooking = (bookingData: Booking) => {
    if (!user?.email) return false;
    const success = BookingsStore.addBooking(user.email, bookingData);
    if (success) refreshBookings();
    return success;
  };

  const cancelBooking = (id: string) => {
    if (!user?.email) return false;
    const success = BookingsStore.cancelBooking(id, user.email);
    if (success) refreshBookings();
    return success;
  };

  return (
    <BookingsContext.Provider value={{ bookings, isLoading, addBooking, cancelBooking, refreshBookings }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
