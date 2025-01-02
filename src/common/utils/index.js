/**
 * Check if code is running in a browser environment
 * @returns {boolean} True if running in browser, false otherwise
 */
export const isBrowser = () => typeof window !== "undefined";
