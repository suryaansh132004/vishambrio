'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Booking } from '@/lib/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface BookingsContextType {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (bookingData: Booking) => Promise<boolean>;
  cancelBooking: (id: string) => Promise<boolean>;
  refreshBookings: () => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBookings = useCallback(async () => {
    if (!user?.id) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings from Supabase:', error.message);
        setBookings([]);
      } else {
        const mappedBookings: Booking[] = (data || []).map((b: any) => ({
          id: b.id,
          name: b.name,
          phone: b.phone,
          email: b.email,
          date: b.booking_date,
          time: b.booking_time ? b.booking_time.slice(0, 5) : '',
          pickup: b.pickup,
          drop: b.drop_off,
          vehicle: b.vehicle,
          fare: b.fare,
          status: b.status,
          timestamp: new Date(b.created_at).getTime(),
          otp: b.otp,
        }));
        setBookings(mappedBookings);
      }
    } catch (e) {
      console.error('Fetch bookings exception:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const addBooking = async (bookingData: Booking) => {
    if (!user?.id) return false;
    try {
      const { error } = await supabase.from('bookings').insert({
        id: bookingData.id,
        user_id: user.id,
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        pickup: bookingData.pickup,
        drop_off: bookingData.drop,
        vehicle: bookingData.vehicle,
        fare: bookingData.fare,
        status: bookingData.status,
        otp: bookingData.otp,
      });

      if (error) {
        console.error('Error inserting booking in Supabase:', error.message);
        return false;
      }

      await refreshBookings();
      return true;
    } catch (e) {
      console.error('Insert booking exception:', e);
      return false;
    }
  };

  const cancelBooking = async (id: string) => {
    if (!user?.id) return false;
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error cancelling booking in Supabase:', error.message);
        return false;
      }

      await refreshBookings();
      return true;
    } catch (e) {
      console.error('Cancel booking exception:', e);
      return false;
    }
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
