import { useEffect, useState } from "react";
import { getDerivAPI } from "../../services/deriv-api.instance";
import { SmartChart, ChartTitle } from "@deriv/deriv-charts";
import { isBrowser } from "../../common/utils";
import { 
  Button, 
  TextField, 
  Text, 
  Tooltip,
  Checkbox,
  CheckboxProps
} from '@deriv-com/quill-ui';
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
  const [duration, setDuration] = useState(1);
  const [stake, setStake] = useState(50);
  const [allowEquals, setAllowEquals] = useState(false);
  const [activeTab, setActiveTab] = useState('duration');
  const [activeStakeTab, setActiveStakeTab] = useState('stake');
  const [growthRate, setGrowthRate] = useState(3);

  const derivAPI = getDerivAPI();

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

  const handleCheckboxChange: CheckboxProps['onChange'] = (e) => {
    if (e.target instanceof HTMLInputElement) {
      setAllowEquals(e.target.checked);
    }
  };

  const is_connection_opened = !!derivAPI;
  const settings: ChartSettings = {
    assetInformation: true,
    countdown: true,
    isHighestLowestMarkerEnabled: true,
    language: "en",
    position: "bottom",
    theme: "light",
  };

  const growthRates = [1, 2, 3, 4, 5];

  return (
    <div className="trading-container">
      <div className="chart-section">
        <div className="chart-container">
          {showChart && (
            <SmartChart
              id="dbot"
              barriers={barriers}
              chartControlsWidgets={null}
              enabledChartFooter={true}
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
      </div>

      <div className="trading-panel">
        <div className="panel-header">
          <Text size="sm" className="learn-link">Learn about this trade type</Text>
          <div className="trade-type">
            <div className="trade-icons">
              <div className="rise-icon">↑</div>
              <div className="fall-icon">↓</div>
            </div>
            <Text size="sm">Rise/Fall</Text>
          </div>
        </div>

        <div className="growth-rate-section">
          <Text size="sm">Growth rate</Text>
          <div className="rate-buttons">
            {growthRates.map((rate) => (
              <button
                key={rate}
                className={growthRate === rate ? 'active' : ''}
                onClick={() => setGrowthRate(rate)}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        <div className="stake-section">
          <Text size="sm">Stake</Text>
          <div className="stake-input">
            <button 
              className="minus-btn"
              onClick={() => setStake(Math.max(0, stake - 1))}
            >
              -
            </button>
            <TextField
              value={stake.toString()}
              onChange={(e) => handleStakeChange(e.target.value)}
              className="stake-field"
            />
            <Text size="sm" className="currency">USD</Text>
            <button 
              className="plus-btn"
              onClick={() => setStake(stake + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="equals-section">
          <div className="checkbox-wrapper">
            <Checkbox
              id="allow-equals"
              checked={allowEquals}
              onChange={handleCheckboxChange}
              label="Allow equals"
            />
          </div>
          <Tooltip tooltipContent="Allow equals tooltip" tooltipPosition="top">
            <Text size="sm">ⓘ</Text>
          </Tooltip>
        </div>

        <div className="payout-section">
          <div className="payout-info">
            <div className="info-row">
              <Text size="sm">Max. payout</Text>
              <Text size="sm">6,000.00 USD</Text>
            </div>
            <div className="info-row">
              <Text size="sm">Max. ticks</Text>
              <Text size="sm">75 ticks</Text>
            </div>
          </div>

          <Button 
            variant="primary"
            size="lg"
            fullWidth
            className="rise-button"
          >
            <div className="button-content">
              <div className="left">
                <Text size="sm">↑</Text>
                <Text size="sm">Rise</Text>
              </div>
              <Text size="sm">95.42%</Text>
            </div>
          </Button>

          <Button 
            variant="primary"
            size="lg"
            fullWidth
            className="fall-button"
          >
            <div className="button-content">
              <div className="left">
                <Text size="sm">↓</Text>
                <Text size="sm">Fall</Text>
              </div>
              <Text size="sm">95.20%</Text>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}