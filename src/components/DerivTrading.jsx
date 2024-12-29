import { useEffect, useState, useRef } from "react";
import { getDerivAPI } from "../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";

const subscriptions = {};

export const DerivTrading = () => {
  const barriers = [];
  const [symbol, setSymbol] = useState("1HZ10V");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chartStatus, setChartStatus] = useState(true);
  const derivAPI = getDerivAPI();
  const [chatSubscriptionId, setChatSubscriptionId] = useState("");
  const chartSubscriptionIdRef = useRef(chatSubscriptionId);

  useEffect(() => {
    const initializeAPI = async () => {
      try {
        // const response = await derivAPI.getActiveSymbols();
        // setSymbols(response.active_symbols);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize Deriv API"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeAPI();

    // Cleanup subscriptions
    return () => {
      derivAPI.unsubscribeAll();
      Object.keys(subscriptions).forEach(requestForgetStream);
    };
  }, []);

  useEffect(() => {
    chartSubscriptionIdRef.current = chatSubscriptionId;
  }, [chatSubscriptionId]);

  const requestAPI = async (request) => {
    console.log(
      JSON.stringify(request),
      request,
      await derivAPI.sendRequest(request),
      "requestAPI"
    );
    return derivAPI.sendRequest(request);
  };

  const requestForget = async () => {
    return derivAPI.unsubscribeAll();
  };

  const requestForgetStream = (subscription_id) => {
    subscription_id && derivAPI.forget(subscription_id);
  };

  const requestSubscribe = async (request, callback) => {
    console.log(request, "requestsubscribe");
    try {
      derivAPI.subscribeTicks(request, (response) => {
        console.log(response, "response");
        if (response.error) {
          throw response.error;
        }
        callback(response);
      });
    } catch (e) {
      console.log(e, "error");
      // eslint-disable-next-line no-console
      e?.error?.code === "MarketIsClosed" && callback([]); //if market is closed sending a empty array  to resolve
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      </div>
    </div>
  );
};
