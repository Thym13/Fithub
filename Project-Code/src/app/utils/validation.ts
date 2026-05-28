/**
 * Validation utilities for FitHub forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validates Greek phone number format
 */
export function validatePhone(phone: string): ValidationResult {
  // Greek phone format: +30 XXX XXX XXXX or 30XXXXXXXXXX
  const phoneRegex = /^(\+30|30)?[0-9]{10}$/;
  const cleanPhone = phone.replace(/\s+/g, '');

  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid Greek phone number (+30 XXX XXX XXXX)' };
  }

  return { isValid: true };
}

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
}

/**
 * Validates password confirmation matches
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}

/**
 * Validates name (not empty, at least 2 characters)
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  return { isValid: true };
}

/**
 * Validates date of birth (must be at least 16 years old)
 */
export function validateDateOfBirth(dob: string): ValidationResult {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    const actualAge = age - 1;
    if (actualAge < 16) {
      return { isValid: false, error: 'You must be at least 16 years old to register' };
    }
  } else if (age < 16) {
    return { isValid: false, error: 'You must be at least 16 years old to register' };
  }

  return { isValid: true };
}

/**
 * Checks password strength level
 */
export function getPasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong';
  score: number;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return { level: 'weak', score };
  if (score <= 4) return { level: 'medium', score };
  return { level: 'strong', score };
}

/**
 * Validates credit card number format
 */
export function validateCardNumber(cardNumber: string): ValidationResult {
  const cleaned = cardNumber.replace(/\s+/g, '');

  if (!cleaned) {
    return { isValid: false, error: 'Card number is required' };
  }

  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }

  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: 'Card number must be between 13 and 19 digits' };
  }

  return { isValid: true };
}

/**
 * Validates CVV format
 */
export function validateCVVFormat(cvv: string): ValidationResult {
  if (!cvv) {
    return { isValid: false, error: 'CVV is required' };
  }

  if (!/^\d{3,4}$/.test(cvv.trim())) {
    return { isValid: false, error: 'CVV must be 3 or 4 digits' };
  }

  return { isValid: true };
}

/**
 * Validates expiry date format (MM/YY)
 */
export function validateExpiryFormat(expiry: string): ValidationResult {
  if (!expiry) {
    return { isValid: false, error: 'Expiry date is required' };
  }

  const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryPattern.test(expiry)) {
    return { isValid: false, error: 'Expiry must be in MM/YY format' };
  }

  return { isValid: true };
}
