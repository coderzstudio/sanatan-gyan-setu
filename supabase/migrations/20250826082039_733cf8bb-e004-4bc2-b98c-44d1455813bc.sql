-- Fix the search path for the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  -- For now, we'll use a simple email-based admin check
  -- You can modify this later to use a proper roles system
  SELECT COALESCE(
    auth.jwt() ->> 'email' IN (
      'admin@sanatanigyan.com',
      'support@sanatanigyan.com'
    ),
    false
  );
$$;