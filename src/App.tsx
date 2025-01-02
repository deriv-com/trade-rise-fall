import { useEffect } from "react";
import DerivTrading from "./pages/trading/DerivTrading";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { setSmartChartsPublicPath } from "@deriv/deriv-charts";
import { getUrlBase } from "./utils/url";
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
    <ThemeProvider theme="light">
      <div className="app">
        <header className="app-header">
          <Heading.H2>Deriv Trading App</Heading.H2>
        </header>

        <main className="app-main">
          <ErrorBoundary>
            <DerivTrading />
          </ErrorBoundary>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
