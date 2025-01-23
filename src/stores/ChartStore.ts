import { makeAutoObservable, configure } from "mobx";
import { tradingPanelStore } from "./TradingPanelStore";

// Configure MobX to use legacy decorators
configure({ useProxies: "never" });

export class ChartStore {
  symbol: string = "";
  chartStatus: boolean = false;
  showChart: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSymbol(symbol: string) {
    tradingPanelStore.setIsRiseFallValid(false);
    this.symbol = symbol;
    tradingPanelStore.priceError = null;
    tradingPanelStore.durationError = null;
  }

  setChartStatus(status: boolean) {
    this.chartStatus = status;
  }

  setShowChart(show: boolean) {
    this.showChart = show;
  }
}

export const chartStore = new ChartStore();
