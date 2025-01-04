import { useEffect, useState } from "react";
import { getDerivAPI } from "../../../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import { isBrowser } from "../../../common/utils";
import "@deriv/deriv-charts/dist/smartcharts.css";
import { ChartSettings, ChartProps } from "../types";
import { ReconnectingLoader } from "../../ReconnectingLoader/ReconnectingLoader";
import "./Chart.scss";

export const Chart = ({
  symbol,
  chartStatus,
  showChart,
  onChartStatusChange,
  onSymbolChange,
}: ChartProps) => {
  const derivAPI = getDerivAPI();
  const [isConnected, setIsConnected] = useState(derivAPI.isConnected());

  useEffect(() => {
    const cleanup = derivAPI.onConnectionChange((connected: boolean) => {
      setIsConnected(connected);
      onChartStatusChange(connected && isBrowser());
    });

    // Initial state
    const initialConnected = derivAPI.isConnected();
    setIsConnected(initialConnected);
    onChartStatusChange(initialConnected && isBrowser());

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

  const settings: ChartSettings = {
    assetInformation: true,
    countdown: true,
    isHighestLowestMarkerEnabled: true,
    language: "en",
    position: "bottom",
    theme: "light",
  };

  const barriers: any[] = [];
  const is_connection_opened = isConnected;

  return (
    <div className="chart-section">
      <div className="chart-container">
        {!isConnected && <ReconnectingLoader />}
        {showChart && (
          <SmartChart
            id="dbot"
            barriers={barriers}
            chartControlsWidgets={null}
            enabledChartFooter={true}
            chartStatusListener={(v: boolean) => onChartStatusChange(!v)}
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
            topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
            isConnectionOpened={is_connection_opened}
            isLive
          />
        )}
      </div>
    </div>
  );
};
