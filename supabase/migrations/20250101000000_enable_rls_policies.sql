-- Enable RLS on all three tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Users table: each user can only access their own profile row
CREATE POLICY "Users can access own profile"
ON public.users FOR ALL
USING (auth.uid() = id);

-- Bookings table: each user can only access their own bookings
CREATE POLICY "Users can access own bookings"
ON public.bookings FOR ALL
USING (auth.uid() = user_id);

-- Complaints table: each user can only access their own complaints
CREATE POLICY "Users can access own complaints"
ON public.complaints FOR ALL
USING (auth.uid() = user_id);
