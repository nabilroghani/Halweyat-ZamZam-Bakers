import dns from 'dns';
import net from 'net';

/**
 * Validation utilities for Pakistani phone numbers and strict email addresses.
 */

// Pakistani Mobile Phone Number Regex
// Accepts: 03001234567, 03275001166, +923001234567, 00923001234567
// Must start with 03 (or +923 / 00923) and have exactly 11 digits total (or 13 with +92).
export const isValidPakistaniPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-()]/g, '');
  const pakPhoneRegex = /^(\+92|0092|0)?3[0-9]{9}$/;
  return pakPhoneRegex.test(cleaned);
};

// Formats phone number consistently to 03XXXXXXXXX or +923XXXXXXXXX
export const formatPakistaniPhone = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[\s-()]/g, '');
  if (cleaned.startsWith('+92')) {
    return '0' + cleaned.slice(3);
  }
  if (cleaned.startsWith('0092')) {
    return '0' + cleaned.slice(4);
  }
  return cleaned;
};

// Common dummy / fake test email usernames to reject upfront
const DUMMY_TEST_USERNAMES = [
  'nabil@gmail.com', 'test@gmail.com', 'testing@gmail.com', 'abc@gmail.com', 'xyz@gmail.com',
  'admin@gmail.com', 'user@gmail.com', 'fake@gmail.com', 'temp@gmail.com', 'demo@gmail.com',
  'a@gmail.com', 'b@gmail.com', 'c@gmail.com', 'asdf@gmail.com', 'qwerty@gmail.com',
  '123@gmail.com', '12345@gmail.com', 'hello@gmail.com', 'mail@gmail.com', 'email@gmail.com',
  'info@gmail.com', 'me@gmail.com', 'sample@gmail.com', 'dummy@gmail.com', 'guest@gmail.com'
];

// Strict Email Address Regex
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) return false;

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop();
  if (tld.length < 2) return false;

  return true;
};

// DNS MX Record Domain Verification
export const hasValidEmailMxDomain = async (email) => {
  if (!isValidEmail(email)) return false;
  try {
    const domain = email.trim().toLowerCase().split('@')[1];
    const mxRecords = await dns.promises.resolveMx(domain);
    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Real Mailbox Existence Verification
 * Checks:
 * 1. Email format validity
 * 2. Generic test email pattern detector (e.g. test@gmail.com, nabil@gmail.com, aaaa@gmail.com)
 * 3. DNS MX Domain record resolution
 */
export const verifyRealMailboxExists = async (email) => {
  const cleanEmail = email.trim().toLowerCase();

  // Step 1: Format check
  if (!isValidEmail(cleanEmail)) {
    return { valid: false, reason: 'Invalid email syntax format. (e.g. name@example.com)' };
  }

  // Step 2: Dummy / placeholder email check
  const username = cleanEmail.split('@')[0];
  if (DUMMY_TEST_USERNAMES.includes(cleanEmail) || username.length < 3 || /^(.)\1+$/.test(username)) {
    return { 
      valid: false, 
      reason: `'${cleanEmail}' is a generic test address. Please enter your real active Gmail address.` 
    };
  }

  // Step 3: DNS MX Mail Server lookup
  const hasMx = await hasValidEmailMxDomain(cleanEmail);
  if (!hasMx) {
    return { 
      valid: false, 
      reason: `The domain '${cleanEmail.split('@')[1]}' does not have active mail servers.` 
    };
  }

  return { valid: true };
};
