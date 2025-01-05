import { Chart } from "../components/TradingComponents/Chart/Chart";
import { TradingPanel } from "../components/TradingComponents/TradingPanel/TradingPanel";
import "@deriv/deriv-charts/dist/smartcharts.css";
import "./DerivTrading.scss";
import { observer } from "mobx-react-lite";
export default observer(function DerivTrading() {
  return (
    <div className="trading-container">
      <Chart />
      <TradingPanel />
    </div>
  );
});
