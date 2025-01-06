import { useEffect, useState } from "react";
import { getDerivAPI } from "../services/deriv-api.instance";
import { PriceProposalResponse } from "../types/deriv-api.types";
import useDebounce from "./useDebounce";
export const usePriceProposal = (
  price: string,
  duration: number,
  basis: string,
  symbol: string
) => {
  const [proposal, setProposal] = useState<PriceProposalResponse["proposal"]>();
  const debouncedPrice = useDebounce(price, 1000);
  const derivAPI = getDerivAPI();

  const clearProposal = () => {
    setProposal(undefined);
  };

  useEffect(() => {
    const handleProposal = async () => {
      const data = {
        price: debouncedPrice,
        duration,
        basis,
        symbol,
      };

      const numPrice = parseFloat(data.price);
      if (numPrice <= 0) {
        return;
      }

      try {
        await derivAPI.subscribeStream(
          {
            proposal: 1,
            subscribe: 1,
            amount: numPrice,
            basis: data.basis,
            contract_type: "CALL",
            currency: "USD",
            duration: data.duration,
            duration_unit: "m",
            symbol: data.symbol,
          },
          (response: any) => {
            if (response.error) {
              console.error("Proposal error:", response.error);
            } else if (response.proposal) {
              setProposal(response.proposal);
            }
          },
          "PROPOSAL"
        );
      } catch (err) {
        console.error("Subscription error:", err);
      }
    };

    if (debouncedPrice && duration && basis && symbol) {
      handleProposal();
    }
  }, [debouncedPrice, duration, basis, symbol, derivAPI]);

  return { proposal, clearProposal };
};
