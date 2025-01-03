import { useEffect } from "react";
import "./App.scss";
import TradingPage from "./pages/trading";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { setSmartChartsPublicPath } from "@deriv/deriv-charts";
import { getChartUrl } from "./common/utils";

const App: React.FC = () => {
  useEffect(() => {
    try {
      const chartsPath = getChartUrl();
      setSmartChartsPublicPath(chartsPath);
    } catch (error) {
      console.error("Failed to initialize charts:", error);
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Deriv Trading App</h1>
      </header>

      <main className="app-main">
        <ErrorBoundary>
          <TradingPage />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
