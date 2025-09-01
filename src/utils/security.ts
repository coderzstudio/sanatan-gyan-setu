// Security utilities for input validation, sanitization, and rate limiting
import { supabase } from "@/integrations/supabase/client";

// Input sanitization to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, (match) => {
      const htmlEntities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return htmlEntities[match] || match;
    })
    .trim()
    .slice(0, 5000); // Limit length
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate name format
export const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100 && /^[a-zA-Z\s.-]+$/.test(trimmed);
};

// Validate message length and content
export const validateMessage = (message: string, minLength: number = 10): boolean => {
  const trimmed = message.trim();
  return trimmed.length >= minLength && trimmed.length <= 5000;
};

// Generate a simple browser fingerprint for rate limiting
export const getBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  const canvasData = canvas.toDataURL();
  
  const fingerprint = btoa(
    `${navigator.userAgent}_${screen.width}x${screen.height}_${navigator.language}_${canvasData.slice(-50)}`
  ).slice(0, 32);
  
  return fingerprint;
};

// Rate limiting check using Supabase function
export const checkRateLimit = async (actionType: string): Promise<boolean> => {
  try {
    const identifier = getBrowserFingerprint();
    
    const { data, error } = await supabase.rpc('check_rate_limit', {
      identifier,
      action_type: actionType,
      max_attempts: 5, // 5 attempts
      window_minutes: 15 // per 15 minutes
    });
    
    if (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to not block legitimate users
    }
    
    return data as boolean;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error
  }
};

// Enhanced form validation
export interface FormValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateContactForm = (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): FormValidationResult => {
  const errors: { [key: string]: string } = {};
  
  // Validate name
  if (!formData.name || !validateName(formData.name)) {
    errors.name = 'Name must be 2-100 characters and contain only letters, spaces, dots, and hyphens';
  }
  
  // Validate email
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate subject
  const subject = formData.subject.trim();
  if (!subject || subject.length < 3 || subject.length > 200) {
    errors.subject = 'Subject must be 3-200 characters long';
  }
  
  // Validate message
  if (!validateMessage(formData.message)) {
    errors.message = 'Message must be 10-5000 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateReportForm = (formData: {
  name: string;
  email: string;
  issue_type: string;
  message: string;
}): FormValidationResult => {
  const errors: { [key: string]: string } = {};
  
  // Validate name
  if (!formData.name || !validateName(formData.name)) {
    errors.name = 'Name must be 2-100 characters and contain only letters, spaces, dots, and hyphens';
  }
  
  // Validate email
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate issue type
  const validIssueTypes = ['copyright', 'bug', 'content', 'feature', 'general', 'other'];
  if (!formData.issue_type || !validIssueTypes.includes(formData.issue_type)) {
    errors.issue_type = 'Please select a valid issue type';
  }
  
  // Validate message
  if (!validateMessage(formData.message)) {
    errors.message = 'Message must be 10-5000 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Log security events
export const logSecurityEvent = async (eventType: string, details: any = {}) => {
  try {
    await supabase.rpc('log_security_event', {
      event_type: eventType,
      details: JSON.stringify(details)
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
    // Fail silently to not disrupt user experience
  }
};

// Sanitize form data
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};