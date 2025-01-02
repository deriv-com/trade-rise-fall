import { useEffect, useState, useRef } from "react";
import { getDerivAPI } from "../../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";
import { TickResponse } from "../../types/deriv-api.types";
import { DerivAPIService } from "../../services/deriv-api.service";
import { Heading } from "@deriv-com/quill-ui";

interface Subscriptions {
  [key: string]: boolean;
}

const subscriptions: Subscriptions = {};

const DerivTrading = () => {
  const barriers: any[] = [];
  const [symbol, setSymbol] = useState<string>("1HZ10V");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartStatus, setChartStatus] = useState<boolean>(true);
  const derivAPI: DerivAPIService = getDerivAPI();
  const [chatSubscriptionId, setChatSubscriptionId] = useState<string>("");
  const chartSubscriptionIdRef = useRef<string>(chatSubscriptionId);

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

  const requestAPI = async (request: any): Promise<any> => {
    return derivAPI.sendRequest(request);
  };

  const requestForget = async (): Promise<void> => {
    return derivAPI.unsubscribeAll();
  };

  const requestForgetStream = (): void => {
    derivAPI.unsubscribeAll();
  };

  const requestSubscribe = async (
    request: any,
    callback: (response: TickResponse | []) => void
  ): Promise<void> => {
    try {
      derivAPI.subscribeTicks(request, (response: TickResponse) => {
        if ("error" in response) {
          throw response.error;
        }
        callback(response);
      });
    } catch (e: any) {
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

  const is_connection_opened: boolean = !!derivAPI;
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
      <Heading.H3 centered>Available Trading Symbols</Heading.H3>
      <div className="dashboard__chart-wrapper" dir="ltr">
        <SmartChart
          id="dbot"
          barriers={barriers}
          chartControlsWidgets={null}
          enabledChartFooter={false}
          chartStatusListener={(v: boolean) => setChartStatus(!v)}
          toolbarWidget={() => <></>}
          chartType="line"
          isMobile={false}
          enabledNavigationWidget={true}
          granularity={0}
          requestAPI={requestAPI}
          requestForget={requestForget}
          requestForgetStream={() => derivAPI.unsubscribeAll()}
          requestSubscribe={requestSubscribe}
          settings={settings}
          symbol={symbol}
          topWidgets={() => (
            <ChartTitle onChange={(symbol: string) => setSymbol(symbol)} />
          )}
          isConnectionOpened={is_connection_opened}
          isLive
        />
      </div>
    </div>
  );
};

export default DerivTrading;
