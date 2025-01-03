import { useEffect, useState } from "react";
import { isBrowser } from "../common/utils";
import { Chart } from "../components/TradingComponents/Chart/Chart";
import { TradingPanel } from "../components/TradingComponents/TradingPanel/TradingPanel";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";

export default function DerivTrading() {
  const [symbol, setSymbol] = useState<string>("1HZ10V");
  const [chartStatus, setChartStatus] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [duration, setDuration] = useState(1);
  const [stake, setStake] = useState(50);
  const [allowEquals, setAllowEquals] = useState(false);
  const [selectedDurationTab, setSelectedDurationTab] = useState('duration');
  const [selectedStakeTab, setSelectedStakeTab] = useState('stake');

  useEffect(() => {
    setShowChart(isBrowser());
  }, []);

  const handleDurationChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setDuration(Math.min(Math.max(numValue, 1), 1440));
    }
  };

  const handleStakeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setStake(numValue);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.target instanceof HTMLInputElement) {
      setAllowEquals(e.target.checked);
    }
  };

  return (
    <div className="trading-container">
      <Chart 
        symbol={symbol}
        chartStatus={chartStatus}
        showChart={showChart}
        onChartStatusChange={setChartStatus}
        onSymbolChange={setSymbol}
      />

      <TradingPanel
        duration={duration}
        stake={stake}
        allowEquals={allowEquals}
        selectedDurationTab={selectedDurationTab}
        selectedStakeTab={selectedStakeTab}
        onDurationChange={handleDurationChange}
        onStakeChange={handleStakeChange}
        onAllowEqualsChange={handleCheckboxChange}
        onDurationTabChange={setSelectedDurationTab}
        onStakeTabChange={setSelectedStakeTab}
        onDurationIncrement={() => setDuration(Math.min(1440, duration + 1))}
        onDurationDecrement={() => setDuration(Math.max(1, duration - 1))}
        onStakeIncrement={() => setStake(stake + 1)}
        onStakeDecrement={() => setStake(Math.max(0, stake - 1))}
      />
    </div>
  );
}
