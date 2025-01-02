import { useEffect, useState, useRef } from "react";
import { getDerivAPI } from "../../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";
import { TickResponse } from "../../types/deriv-api.types";
import { DerivAPIService } from "../../services/deriv-api.service";

const AccumulatorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
  </svg>
);

interface Subscriptions {
  [key: string]: boolean;
}

const subscriptions: Subscriptions = {};

const DerivTrading = () => {
  const [selectedRate, setSelectedRate] = useState<number>(3);
  const [stake, setStake] = useState<number>(50);
  const [takeProfit, setTakeProfit] = useState<number>(150);
  const [symbol, setSymbol] = useState<string>("1HZ10V");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartStatus, setChartStatus] = useState<boolean>(true);
  const [chatSubscriptionId, setChatSubscriptionId] = useState<string>("");
  
  const barriers: any[] = [];
  const derivAPI: DerivAPIService = getDerivAPI();
  const chartSubscriptionIdRef = useRef<string>(chatSubscriptionId);

  const handleStakeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setStake(numValue);
    }
  };

  const handleTakeProfitChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setTakeProfit(numValue);
    }
  };

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
    theme: "light",
  };

  return (
    <div className="trading-container">
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
      <div className="trading-panel">
        <div className="info-header">
          <div className="trade-type">
            <AccumulatorIcon />
            <span>Accumulators</span>
          </div>
          <a href="#" className="learn-link">Learn about this trade type</a>
        </div>

        <div className="growth-rate">
          <div className="label">
            <h4>Growth rate</h4>
            <span>ℹ️</span>
          </div>
          <div className="rate-buttons">
            {[1, 2, 3, 4, 5].map((rate) => (
              <button
                key={rate}
                className={selectedRate === rate ? 'active' : ''}
                onClick={() => setSelectedRate(rate)}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <div className="label">
            <h4>Stake</h4>
          </div>
          <div className="input-wrapper">
            <button onClick={() => setStake(Math.max(0, stake - 1))}>-</button>
            <input
              type="text"
              value={stake.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={(e) => handleStakeChange(e.target.value)}
            />
            <div className="currency">USD</div>
            <button onClick={() => setStake(stake + 1)}>+</button>
          </div>
        </div>

        <div className="input-group">
          <div className="label">
            <h4>Take profit</h4>
            <span>ℹ️</span>
          </div>
          <div className="input-wrapper">
            <button onClick={() => setTakeProfit(Math.max(0, takeProfit - 1))}>-</button>
            <input
              type="text"
              value={takeProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={(e) => handleTakeProfitChange(e.target.value)}
            />
            <div className="currency">USD</div>
            <button onClick={() => setTakeProfit(takeProfit + 1)}>+</button>
          </div>
        </div>

        <div className="info-row">
          <span>Max. payout</span>
          <span className="value">{(6000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
        </div>
        <div className="info-row">
          <span>Max. ticks</span>
          <span className="value">75 ticks</span>
        </div>

        <button className="buy-button">
          <span>Buy</span>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DerivTrading;
