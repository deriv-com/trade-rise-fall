import { useEffect, useState } from "react";
import { getDerivAPI } from "../services/deriv-api.instance";
import { PriceProposalResponse } from "../types/deriv-api.types";
import useDebounce from "./useDebounce";

interface ProposalState {
  rise?: PriceProposalResponse["proposal"];
  fall?: PriceProposalResponse["proposal"];
}

interface LoadingState {
  rise: boolean;
  fall: boolean;
}

export const usePriceProposal = (
  price: string,
  duration: number,
  basis: string,
  symbol: string
) => {
  const [proposal, setProposal] = useState<ProposalState>({});
  const [isLoading, setIsLoading] = useState<LoadingState>({
    rise: false,
    fall: false,
  });
  const debouncedPrice = useDebounce(price, 1000);
  const debouncedDuration = useDebounce(duration, 1000);

  const derivAPI = getDerivAPI();

  const clearProposal = () => {
    setProposal({});
  };

  useEffect(() => {
    const handleProposal = async () => {
      setIsLoading({ fall: true, rise: true });

      const data = {
        price: debouncedPrice,
        duration: debouncedDuration,
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
            setIsLoading((prev) => ({ ...prev, rise: false }));
            if (response.error) {
              console.error("Rise proposal error:", response.error);
            } else if (response.proposal) {
              setProposal((prev) => ({ ...prev, rise: response.proposal }));
            }
          },
          "PROPOSAL_RISE"
        );
      } catch (err) {
        console.error("Rise subscription error:", err);
        setIsLoading((prev) => ({ ...prev, rise: false }));
      }

      try {
        await derivAPI.subscribeStream(
          {
            proposal: 1,
            subscribe: 1,
            amount: numPrice,
            basis: data.basis,
            contract_type: "PUT",
            currency: "USD",
            duration: data.duration,
            duration_unit: "m",
            symbol: data.symbol,
          },
          (response: any) => {
            setIsLoading((prev) => ({ ...prev, fall: false }));
            if (response.error) {
              console.error("Fall proposal error:", response.error);
            } else if (response.proposal) {
              setProposal((prev) => ({ ...prev, fall: response.proposal }));
            }
          },
          "PROPOSAL_FALL"
        );
      } catch (err) {
        console.error("Fall subscription error:", err);
        setIsLoading((prev) => ({ ...prev, fall: false }));
      }
    };

    setProposal({});
    setIsLoading({ rise: false, fall: false });

    if (debouncedPrice && duration && basis && symbol) {
      handleProposal();
    }
  }, [debouncedPrice, debouncedDuration, basis, symbol, derivAPI]);

  return { proposal, clearProposal, isLoading };
};
