-- Create a security definer function to check if a user is an admin
-- This function will be used in RLS policies to determine admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
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

-- Add RLS policy to allow only administrators to read reports
CREATE POLICY "Administrators can view all reports" ON public.reports
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Add RLS policy to allow administrators to update report status
CREATE POLICY "Administrators can update reports" ON public.reports
FOR UPDATE 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.reports TO authenticated;