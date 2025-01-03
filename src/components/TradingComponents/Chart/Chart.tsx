import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import { getDerivAPI } from "../../../services/deriv-api.instance";
import { ChartSettings, ChartProps } from "../types";
import "./Chart.scss";

export const Chart = ({ 
  symbol, 
  chartStatus, 
  showChart, 
  onChartStatusChange, 
  onSymbolChange 
}: ChartProps) => {
  const derivAPI = getDerivAPI();

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
  const is_connection_opened = !!derivAPI;

  return (
    <div className="chart-section">
      <div className="chart-container">
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
            topWidgets={() => (
              <ChartTitle onChange={onSymbolChange} />
            )}
            isConnectionOpened={is_connection_opened}
            isLive
          />
        )}
      </div>
    </div>
  );
};
