import { useEffect, useState, useRef } from "react";
import { getDerivAPI } from "../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import { isBrowser } from "../common/utils";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";

export const DerivTrading = () => {
  const barriers = [];
  const [symbol, setSymbol] = useState("1HZ10V");
  const [chartStatus, setChartStatus] = useState(true);
  const derivAPI = getDerivAPI();
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setShowChart(isBrowser());
  }, []);

  const requestAPI = async (request) => {
    return derivAPI.sendRequest(request);
  };

  const requestSubscribe = async (request, callback) => {
    try {
      derivAPI.subscribeStream(
        request,
        (response) => {
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
    } catch (error) {
      if (error?.code === "MarketIsClosed") {
        callback([]);
      }
    }
  };

  const is_connection_opened = !!derivAPI;
  const settings = {
    assetInformation: false, // ui.is_chart_asset_info_visible,
    countdown: true,
    isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
    language: "en",
    position: "bottom",
    theme: "dark",
  };

  return (
    <div className="trading-container">
      <h2>Available Trading Symbols</h2>
      <div className="dashboard__chart-wrapper" dir="ltr">
        {showChart && (
          <SmartChart
            id="dbot"
            barriers={barriers}
            chartControlsWidgets={null}
            enabledChartFooter={false}
            chartStatusListener={(v) => setChartStatus(!v)}
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
              <ChartTitle onChange={(symbol) => setSymbol(symbol)} />
            )}
            isConnectionOpened={is_connection_opened}
            isLive
          />
        )}
      </div>
    </div>
  );
};
