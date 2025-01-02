import { useEffect } from "react";
import TradingPage from "./pages/trading";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { setSmartChartsPublicPath } from "@deriv/deriv-charts";
import { getUrlBase } from "./common/utils";
import { Heading, ThemeProvider } from "@deriv-com/quill-ui";

const App: React.FC = () => {
  useEffect(() => {
    try {
      const chartsPath = getUrlBase("/js/smartcharts/");
      setSmartChartsPublicPath(chartsPath);
    } catch (error) {
      console.error("Failed to initialize charts:", error);
    }
  }, []);

  return (
    <ThemeProvider theme="light" persistent>
      <div className="app container">
        <main className="app-main">
          <ErrorBoundary>
            <TradingPage />
          </ErrorBoundary>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
