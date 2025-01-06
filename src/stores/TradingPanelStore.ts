import { makeAutoObservable } from "mobx";

export class TradingPanelStore {
  duration = 1;
  price = "10";
  allowEquals = false;
  selectedDurationTab: "duration" | "endtime" = "duration";
  selectedStakeTab: "stake" | "payout" = "stake";

  constructor() {
    makeAutoObservable(this);
  }

  setDuration = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      this.duration = Math.min(Math.max(numValue, 1), 1440);
    }
  };

  setPrice = (value: string) => {
    if (!value) {
      this.price = "";
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      this.price = numValue.toString();
    }
  };

  setAllowEquals = (value: boolean) => {
    this.allowEquals = value;
  };

  setSelectedDurationTab = (value: "duration" | "endtime") => {
    this.selectedDurationTab = value;
  };

  setSelectedStakeTab = (value: "stake" | "payout") => {
    this.selectedStakeTab = value;
  };
}

export const tradingPanelStore = new TradingPanelStore();
