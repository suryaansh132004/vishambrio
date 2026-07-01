-- Drop the overly permissive FOR ALL policies
DROP POLICY IF EXISTS "Users can access own profile" ON public.users;
DROP POLICY IF EXISTS "Users can access own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can access own complaints" ON public.complaints;

-- =============================================
-- users table: scoped per operation
-- Users can read and update their own row only.
-- INSERT is handled by the server-side trigger on auth.users.
-- DELETE is not permitted from the client.
-- email_verified is excluded from the update policy via a check.
-- =============================================
CREATE POLICY "users_select_own"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "users_update_own"
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND email_verified = (SELECT email_verified FROM public.users WHERE id = auth.uid())
);

-- =============================================
-- bookings table: scoped per operation
-- Users can read and insert their own bookings.
-- Update is limited to cancellation (status field only via app logic).
-- DELETE is not permitted from the client.
-- =============================================
CREATE POLICY "bookings_select_own"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "bookings_insert_own"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_update_own"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- complaints table: scoped per operation
-- Users can read and insert their own complaints.
-- Update and delete not permitted from the client.
-- =============================================
CREATE POLICY "complaints_select_own"
ON public.complaints FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "complaints_insert_own"
ON public.complaints FOR INSERT
WITH CHECK (auth.uid() = user_id);
