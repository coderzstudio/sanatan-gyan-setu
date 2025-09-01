-- Fix RLS policy warnings and add missing policies

-- Add policies for rate_limits table
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add policy for security_audit_log INSERT (system needs to log events)
CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);