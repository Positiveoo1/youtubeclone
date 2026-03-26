/**
 * Validation Utilities
 * Helper functions for input validation
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate username format
 */
export const isValidUsername = (username: string): boolean => {
  if (username.length < 3 || username.length > 30) {
    return false;
  }
  // Allow letters, numbers, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Validate input length
 */
export const isValidLength = (str: string, min: number, max: number): boolean => {
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Check if string contains only numbers
 */
export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * Check if string contains special characters
 */
export const hasSpecialCharacters = (str: string): boolean => {
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return specialCharRegex.test(str);
};
