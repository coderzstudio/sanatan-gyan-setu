-- Security Hardening Migration (Corrected)
-- Phase 1: Critical Data Protection

-- Add explicit denial policies for public access to contact_messages
CREATE POLICY "Deny public access to contact messages" 
ON public.contact_messages 
FOR SELECT 
TO anon, authenticated
USING (false);

-- Add explicit denial policies for public access to reports
CREATE POLICY "Deny public access to reports" 
ON public.reports 
FOR SELECT 
TO anon, authenticated
USING (false);

-- Strengthen the is_admin function with additional security checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Enhanced admin check with session validation
  SELECT COALESCE(
    -- Check if user is authenticated and email is in admin list
    (auth.uid() IS NOT NULL) AND 
    (auth.jwt() ->> 'email' IN (
      'admin@sanatanigyan.com',
      'support@sanatanigyan.com'
    )) AND
    -- Verify the session is valid and not expired
    (auth.jwt() ->> 'exp')::bigint > extract(epoch from now()),
    false
  );
$function$;

-- Add input validation constraints for contact messages
ALTER TABLE public.contact_messages 
ADD CONSTRAINT contact_name_length CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100),
ADD CONSTRAINT contact_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT contact_subject_length CHECK (length(trim(subject)) >= 3 AND length(trim(subject)) <= 200),
ADD CONSTRAINT contact_message_length CHECK (length(trim(message)) >= 10 AND length(trim(message)) <= 5000);

-- Add input validation constraints for reports
ALTER TABLE public.reports 
ADD CONSTRAINT report_name_length CHECK (length(trim(name)) >= 2 AND length(trim(name)) <= 100),
ADD CONSTRAINT report_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT report_issue_type_length CHECK (length(trim(issue_type)) >= 3 AND length(trim(issue_type)) <= 100),
ADD CONSTRAINT report_message_length CHECK (length(trim(message)) >= 10 AND length(trim(message)) <= 5000);

-- Create security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
USING (is_admin());

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (event_type, user_id, details)
  VALUES (event_type, auth.uid(), details);
EXCEPTION
  WHEN OTHERS THEN
    -- Fail silently to not break application flow
    NULL;
END;
$$;

-- Create rate limiting table for form submissions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP or session identifier
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  identifier TEXT,
  action_type TEXT,
  max_attempts INTEGER DEFAULT 5,
  window_minutes INTEGER DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Clean up old entries
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - (window_minutes || ' minutes')::interval;
  
  -- Get current attempts in window
  SELECT attempt_count, rate_limits.window_start 
  INTO current_attempts, window_start
  FROM public.rate_limits 
  WHERE rate_limits.identifier = check_rate_limit.identifier 
    AND rate_limits.action_type = check_rate_limit.action_type;
  
  -- If no record exists, create one
  IF current_attempts IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action_type, attempt_count)
    VALUES (identifier, action_type, 1)
    ON CONFLICT (identifier, action_type) 
    DO UPDATE SET 
      attempt_count = 1,
      window_start = now();
    RETURN true;
  END IF;
  
  -- Check if window has expired
  IF window_start < now() - (window_minutes || ' minutes')::interval THEN
    UPDATE public.rate_limits 
    SET attempt_count = 1, window_start = now()
    WHERE rate_limits.identifier = check_rate_limit.identifier 
      AND rate_limits.action_type = check_rate_limit.action_type;
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_attempts >= max_attempts THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits 
  SET attempt_count = attempt_count + 1
  WHERE rate_limits.identifier = check_rate_limit.identifier 
    AND rate_limits.action_type = check_rate_limit.action_type;
  
  RETURN true;
END;
$$;