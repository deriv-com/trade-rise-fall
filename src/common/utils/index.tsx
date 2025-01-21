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
/**
 * Gets the chart URL based on environment
 * @param path - Path to append to the chart URL
 * @returns The complete chart URL
 */
export const getChartUrl = (): string => {
  const baseUrl =
    process.env.REACT_CURRENT_ENVIRONMENT === "local" ? "" : "/trade-rise-fall";
  return `${baseUrl}/js/smartcharts/`;
};

export const isLogged = (): boolean => {
  return authStore.isAuthenticated;
};
