import { useEffect, useState } from "react";
import { isBrowser } from "../common/utils";
import { Chart } from "../components/TradingComponents/Chart/Chart";
import { TradingPanel } from "../components/TradingComponents/TradingPanel/TradingPanel";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";
import { tradingPanelStore } from "../stores/TradingPanelStore";
import { observer } from "mobx-react-lite";
export default observer(function DerivTrading() {
  const [symbol, setSymbol] = useState<string>("1HZ10V");
  const [chartStatus, setChartStatus] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false);

  useEffect(() => {
    setShowChart(isBrowser());
  }, []);

  return (
    <div className="trading-container">
      <Chart
        symbol={symbol}
        chartStatus={chartStatus}
        showChart={showChart}
        onChartStatusChange={setChartStatus}
        onSymbolChange={setSymbol}
      />
      <TradingPanel />
    </div>
  );
});
