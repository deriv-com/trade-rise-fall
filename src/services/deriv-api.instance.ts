import { DerivAPIService } from "./deriv-api.service";
import { DerivAPIConfig } from "../types/deriv-api.types";

let derivAPIInstance: DerivAPIService | null = null;

export const initializeDerivAPI = (config: DerivAPIConfig): DerivAPIService => {
  if (!derivAPIInstance) {
    derivAPIInstance = new DerivAPIService(config);
  }
  return derivAPIInstance;
};

export const getDerivAPI = (): DerivAPIService => {
  if (!derivAPIInstance) {
    throw new Error("DerivAPI not initialized. Call initializeDerivAPI first.");
  }
  return derivAPIInstance;
};

// Cleanup function to properly close the connection
export const cleanupDerivAPI = (): void => {
  if (derivAPIInstance) {
    derivAPIInstance.disconnect();
    derivAPIInstance = null;
  }
};
