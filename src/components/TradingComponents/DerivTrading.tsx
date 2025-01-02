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
  const [showChart, setShowChart] = useState<boolean>(false);

  const [selectedRate, setSelectedRate] = useState<number>(3);
  const [stake, setStake] = useState<number>(50);
  const [takeProfit, setTakeProfit] = useState<number>(150);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatSubscriptionId, setChatSubscriptionId] = useState<string>("");

  const derivAPI = getDerivAPI();

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
    setShowChart(isBrowser());
  }, []);

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

  const is_connection_opened = !!derivAPI;
  const settings: ChartSettings = {
    assetInformation: false,
    countdown: true,
    isHighestLowestMarkerEnabled: false,
    language: "en",
    position: "bottom",
    theme: "dark",
  };

  const requestForget = async (): Promise<void> => {
    return derivAPI.unsubscribeAll();
  };

  const requestForgetStream = (): void => {
    derivAPI.unsubscribeAll();
  };

  return (
    <div className="trading-container">
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
      <div className="trading-panel">
        <div className="info-header">
          <div className="trade-type">
            <span>Accumulators</span>
          </div>
          <a href="#" className="learn-link">
            Learn about this trade type
          </a>
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
                className={selectedRate === rate ? "active" : ""}
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
              value={stake.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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
            <button onClick={() => setTakeProfit(Math.max(0, takeProfit - 1))}>
              -
            </button>
            <input
              type="text"
              value={takeProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              onChange={(e) => handleTakeProfitChange(e.target.value)}
            />
            <div className="currency">USD</div>
            <button onClick={() => setTakeProfit(takeProfit + 1)}>+</button>
          </div>
        </div>

        <div className="info-row">
          <span>Max. payout</span>
          <span className="value">
            {(6000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            USD
          </span>
        </div>
        <div className="info-row">
          <span>Max. ticks</span>
          <span className="value">75 ticks</span>
        </div>

        <button className="buy-button">
          <span>Buy</span>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
