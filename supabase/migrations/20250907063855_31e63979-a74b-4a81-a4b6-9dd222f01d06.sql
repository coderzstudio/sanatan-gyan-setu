-- Fix rate_limits table security policy
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

-- Create more restrictive policies for rate_limits table
CREATE POLICY "Rate limits are not publicly accessible" 
ON public.rate_limits 
FOR SELECT 
TO anon, authenticated
USING (false);

-- Only system functions can manage rate limits (no user access needed)
CREATE POLICY "System functions can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);