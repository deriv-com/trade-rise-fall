import { useEffect } from "react";
import "./App.scss";
import DerivTrading from "./pages/trading/DerivTrading";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { setSmartChartsPublicPath } from "@deriv/deriv-charts";
import { getUrlBase } from "./utils/url";

const App: React.FC = () => {
  useEffect(() => { 
    try {
      const chartsPath = getUrlBase("/js/smartcharts/");
      setSmartChartsPublicPath(chartsPath);
    } catch (error) {
      console.error('Failed to initialize charts:', error);
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Deriv Trading App</h1>
      </header>
      
      <main className="app-main">
        <ErrorBoundary>
          <DerivTrading />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
