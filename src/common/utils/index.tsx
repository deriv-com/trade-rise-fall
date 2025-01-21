import { authStore } from "../../stores/AuthStore";

/**
 * Check if code is running in a browser environment
 * @returns {boolean} True if running in browser, false otherwise
 */
export const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Gets the base URL path considering the current location pathname
 * @param path - Optional path to append to the base URL
 * @returns The complete URL path
 */

export const isLogged = (): boolean => {
  return authStore.isAuthenticated;
};
