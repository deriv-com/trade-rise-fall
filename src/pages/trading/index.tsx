import React, { useEffect } from "react";
import DerivTrading from "../../features/DerivTrading";
import { setSmartChartsPublicPath } from "@deriv/deriv-charts";
import { getChartUrl } from "../../common/utils";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";

const TradingPage: React.FC = () => {

  useEffect(() => {
    try {
      const chartsPath = getChartUrl();
      setSmartChartsPublicPath(chartsPath);
    } catch (error) {
      console.error("Failed to initialize charts:", error);
    }
  }, []);

  
  return (
    <div className="app container">
    <main className="app-main">
      <ErrorBoundary>
        <DerivTrading />
      </ErrorBoundary>
    </main>
  </div>
  );
};

export default TradingPage;
