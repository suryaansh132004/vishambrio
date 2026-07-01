import { supabase } from './supabase';
import { UserProfile, Complaint } from './types';

export const ProfileStore = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // 1. Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          // Row missing from public.users table - auto-create it from current Auth session
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser && authUser.id === userId) {
            const newProfile = {
              id: userId,
              email: authUser.email || '',
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Rider',
              phone: null,
              member_level: 'Eco-Explorer',
              seeded_tokens: 0,
              seeded_carbon: 0,
              seeded_money: 0,
              email_verified: !!authUser.email_confirmed_at,
            };
            const { error: insertError } = await supabase
              .from('users')
              .insert(newProfile);
            
            if (!insertError) {
              return {
                phone: '',
                memberLevel: 'Eco-Explorer',
                seededTokens: 0,
                seededCarbon: 0,
                seededMoney: 0,
                complaints: [],
              };
            } else {
              console.error('Error auto-creating missing user profile:', insertError.message);
            }
          }
        }
        console.error('Error fetching user profile from Supabase:', userError.message);
        return null;
      }

      // 2. Fetch user complaints
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (complaintsError) {
        console.error('Error fetching complaints from Supabase:', complaintsError.message);
      }

      const complaints: Complaint[] = (complaintsData || []).map((c: any) => ({
        id: c.id,
        category: c.category,
        text: c.details,
        status: c.status as any,
        timestamp: new Date(c.created_at).getTime(),
        reply: c.reply || undefined,
      }));

      return {
        phone: userData.phone || '',
        memberLevel: userData.member_level || 'Eco-Explorer',
        seededTokens: userData.seeded_tokens || 0,
        seededCarbon: userData.seeded_carbon || 0,
        seededMoney: userData.seeded_money || 0,
        complaints: complaints,
      };
    } catch (e) {
      console.error('getUserProfile exception:', e);
      return null;
    }
  },

  async updateProfilePhone(userId: string, newPhone: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ phone: newPhone.trim() })
        .eq('id', userId);

      if (error) {
        console.error('Error updating phone in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('updateProfilePhone exception:', e);
      return false;
    }
  },

  async submitComplaint(userId: string, category: string, text: string): Promise<Complaint | false> {
    try {
      const randomId = 'CMP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
      const { error } = await supabase.from('complaints').insert({
        id: randomId,
        user_id: userId,
        category: category,
        details: text.trim(),
        status: 'Submitted',
      });

      if (error) {
        console.error('Error submitting complaint in Supabase:', error.message);
        return false;
      }

      return {
        id: randomId,
        category: category,
        text: text.trim(),
        status: 'Submitted',
        timestamp: Date.now(),
      };
    } catch (e) {
      console.error('submitComplaint exception:', e);
      return false;
    }
  },

  async _getBookingFareTotal(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('fare, status')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching fares for calculations:', error.message);
        return 0;
      }

      return (data || []).reduce((sum: number, b: any) => {
        if (b.status === 'Completed' || b.status === 'Confirmed') {
          const raw = typeof b.fare === 'string' ? b.fare.replace(/[^0-9]/g, '') : String(b.fare ?? '');
          return sum + (parseInt(raw, 10) || 0);
        }
        return sum;
      }, 0);
    } catch (e) {
      console.error('Error calculating fare sum:', e);
      return 0;
    }
  },

  async getTotalMoneySpent(userId: string): Promise<number> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return 0;
    const bookingTotal = await this._getBookingFareTotal(userId);
    return profile.seededMoney + bookingTotal;
  },

  async getCarbonMetrics(userId: string): Promise<{ tokens: number; carbon: number }> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return { tokens: 0, carbon: 0 };
    const totalSpent = await this._getBookingFareTotal(userId);
    const additionalTokens = Math.floor(totalSpent / 25);
    const additionalCarbon = parseFloat((additionalTokens * 0.2).toFixed(1));
    return {
      tokens: profile.seededTokens + additionalTokens,
      carbon: parseFloat((profile.seededCarbon + additionalCarbon).toFixed(1)),
    };
  },
};
