/**
 * Client-side Validation Helpers for Email and Pakistani Phone Numbers
 */

export const isValidPakistaniPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-()]/g, '');
  const pakPhoneRegex = /^(\+92|0092|0)?3[0-9]{9}$/;
  return pakPhoneRegex.test(cleaned);
};

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) return false;
  
  const parts = email.trim().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop();
  return tld.length >= 2;
};
