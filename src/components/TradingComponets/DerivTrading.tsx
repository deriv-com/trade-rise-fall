import { useEffect, useState } from "react";
import { getDerivAPI } from "../../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import { isBrowser } from "../../common/utils";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";

interface ChartSettings {
  assetInformation: boolean;
  countdown: boolean;
  isHighestLowestMarkerEnabled: boolean;
  language: string;
  position: string;
  theme: string;
}

export default function DerivTrading() {
  const barriers: any[] = [];
  const [symbol, setSymbol] = useState<string>("1HZ10V");
  const [chartStatus, setChartStatus] = useState<boolean>(true);
  const derivAPI = getDerivAPI();
  const [showChart, setShowChart] = useState(false);
  const [isConnected, setIsConnected] = useState(derivAPI.isConnected());

  useEffect(() => {
    const cleanup = derivAPI.onConnectionChange((connected) => {
      setIsConnected(connected);
      setShowChart(connected && isBrowser());
    });

    // Initial state
    const initialConnected = derivAPI.isConnected();
    setIsConnected(initialConnected);
    setShowChart(initialConnected && isBrowser());

    return cleanup;
  }, [derivAPI]);

  const requestAPI = async (request: any): Promise<any> => {
    return derivAPI.sendRequest(request);
  };

  const requestSubscribe = async (
    request: any,
    callback: (data: any) => void
  ): Promise<void> => {
    try {
      derivAPI.subscribeStream(
        request,
        (response: any) => {
          if (response?.error?.code === "MarketIsClosed") {
            return callback([]);
          }
          if (response?.error) {
            throw response.error;
          }
          callback(response);
        },
        "ticks"
      );
    } catch (error: any) {
      if (error?.code === "MarketIsClosed") {
        callback([]);
      }
    }
  };

  const is_connection_opened = isConnected;
  const settings: ChartSettings = {
    assetInformation: false,
    countdown: true,
    isHighestLowestMarkerEnabled: false,
    language: "en",
    position: "bottom",
    theme: "dark",
  };

  return (
    <div className="trading-container">
      <h2>Available Trading Symbols</h2>
      {!isConnected && (
        <div className="reconnecting-message">Reconnecting to Deriv API...</div>
      )}
      <div className="dashboard__chart-wrapper" dir="ltr">
        {showChart && (
          <SmartChart
            id="dbot"
            barriers={barriers}
            chartControlsWidgets={null}
            enabledChartFooter={false}
            chartStatusListener={(v: boolean) => setChartStatus(!v)}
            toolbarWidget={() => <></>}
            chartType={"line"}
            isMobile={false}
            enabledNavigationWidget={true}
            granularity={0}
            requestAPI={requestAPI}
            requestForget={() => {}}
            requestForgetStream={() => {}}
            requestSubscribe={requestSubscribe}
            settings={settings}
            symbol={symbol}
            topWidgets={() => (
              <ChartTitle onChange={(symbol: string) => setSymbol(symbol)} />
            )}
            isConnectionOpened={is_connection_opened}
            isLive
          />
        )}
      </div>
    </div>
  );
}
