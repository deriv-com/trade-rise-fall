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

export interface TradingPanelProps {
  duration: number;
  stake: number;
  allowEquals: boolean;
  selectedDurationTab: string;
  selectedStakeTab: string;
  onDurationChange: (value: string) => void;
  onStakeChange: (value: string) => void;
  onAllowEqualsChange: (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLSpanElement>) => void;
  onDurationTabChange: (tab: string) => void;
  onStakeTabChange: (tab: string) => void;
  onDurationIncrement: () => void;
  onDurationDecrement: () => void;
  onStakeIncrement: () => void;
  onStakeDecrement: () => void;
}
