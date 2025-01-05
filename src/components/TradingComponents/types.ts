export interface ChartSettings {
  assetInformation: boolean;
  countdown: boolean;
  isHighestLowestMarkerEnabled: boolean;
  language: string;
  position: string;
  theme: string;
}

export interface ChartProps {
  symbol: string;
  chartStatus: boolean;
  showChart: boolean;
  onChartStatusChange: (status: boolean) => void;
  onSymbolChange: (symbol: string) => void;
}

export type DurationTabValue = "duration" | "endtime";
export type StakeTabValue = "stake" | "payout";

export interface TradingPanelProps {
  duration: number;
  price: number;
  allowEquals: boolean;
  selectedDurationTab: DurationTabValue;
  selectedStakeTab: StakeTabValue;
  onDurationChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onAllowEqualsChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLSpanElement>
  ) => void;
  onDurationTabChange: (tab: DurationTabValue) => void;
  onStakeTabChange: (tab: StakeTabValue) => void;
  onDurationIncrement: () => void;
  onDurationDecrement: () => void;
  onPriceIncrement: () => void;
  onPriceDecrement: () => void;
}
