/**
 * @module components/Chart
 * ChartComponent provides a wrapper around the SmartChart component from @deriv/deriv-charts
 * with additional features like loading states, error handling, and subscription management.
 */

import React from "react";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import { useDerivSubscription } from "../../hooks/useDerivSubscription";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import type { ChartBarrier, TradingSettings } from "../../types/trading.types";
import "./Chart.scss";

/**
 * Props for the ChartComponent
 */
interface ChartComponentProps {
  /** The trading symbol to display in the chart */
  /** Callback function when the symbol is changed */
  /** Optional callback for handling errors */
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Default settings for the SmartChart component
 */
const defaultSettings: TradingSettings = {
  assetInformation: false,
  countdown: true,
  isHighestLowestMarkerEnabled: false,
  language: "en",
  position: "bottom",
  theme: "dark",
};

/**
 * A component that renders a trading chart with real-time data subscription
 * @param props - The component props
 * @returns JSX.Element
 */
export const ChartComponent: React.FC<ChartComponentProps> = ({
  symbol,
  onSymbolChange,
  onError,
}) => {
  const barriers: ChartBarrier[] = [];

  const {
    isLoading,
    error,
    chartStatus,
    setChartStatus,
    requestAPI,
    requestSubscribe,
    unsubscribeAll,
    isConnectionOpened,
  } = useDerivSubscription({
    symbol,
    onError,
  });

  if (isLoading) {
    return (
      <div className="chart-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error">
        <h3>Chart Error</h3>
        <p>{error}</p>
        <button
          className="chart-error-retry"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="trading-container">
      <div className="dashboard__chart-wrapper" dir="ltr">
        {" "}
        <SmartChart
          id="deriv-trade"
          barriers={barriers}
          chartControlsWidgets={null}
          enabledChartFooter={false}
          chartStatusListener={(status) => setChartStatus(!status)}
          toolbarWidget={() => <></>}
          chartType="line"
          isMobile={false}
          enabledNavigationWidget={true}
          granularity={0}
          requestAPI={requestAPI}
          requestForget={unsubscribeAll}
          requestForgetStream={unsubscribeAll}
          requestSubscribe={requestSubscribe}
          settings={defaultSettings}
          symbol={symbol}
          topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
          isConnectionOpened={isConnectionOpened}
          isLive
        />
      </div>
    </div>
  );
};
