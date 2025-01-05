import { makeAutoObservable } from "mobx";

export class ChartStore {
  symbol: string = "";
  chartStatus: boolean = false;
  showChart: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSymbol = (symbol: string) => {
    this.symbol = symbol;
  };

  setChartStatus = (status: boolean) => {
    this.chartStatus = status;
  };

  setShowChart = (show: boolean) => {
    this.showChart = show;
  };
}

export const chartStore = new ChartStore();
