import {
  Button,
  TextField,
  Text,
  Tooltip,
  Checkbox,
  TextFieldWithSteppers,
} from "@deriv-com/quill-ui";
import { Tab } from "../Tab";
import {
  LabelPairedBackwardSmBoldIcon,
  TradeTypesUpsAndDownsRiseIcon,
  TradeTypesUpsAndDownsFallIcon,
  LabelPairedCircleInfoSmBoldIcon,
} from "@deriv/quill-icons";
import { DurationTabValue, StakeTabValue } from "../types";
import { observer } from "mobx-react-lite";
import { tradingPanelStore } from "../../../stores/TradingPanelStore";
import { chartStore } from "../../../stores/ChartStore";
import { usePriceProposal } from "../../../hooks/usePriceProposal";
import "./TradingPanel.scss";

export const TradingPanel = observer(() => {
  const {
    duration,
    price,
    allowEquals,
    selectedDurationTab,
    selectedStakeTab,
    setDuration,
    setPrice,
    setAllowEquals,
    setSelectedDurationTab,
    setSelectedStakeTab,
    durationError,
    priceError,
  } = tradingPanelStore;

  const { proposal, clearProposal, isLoading } = usePriceProposal(
    price,
    duration,
    selectedStakeTab,
    chartStore.symbol
  );

  const durationTabs: Array<{ label: string; value: DurationTabValue }> = [
    { label: "Duration", value: "duration" },
    { label: "End time", value: "endtime" },
  ];

  const stakeTabs: Array<{ label: string; value: StakeTabValue }> = [
    { label: "Stake", value: "stake" },
    { label: "Payout", value: "payout" },
  ];

  const getAmount = (type: "rise" | "fall") => {
    const currentProposal = proposal[type];
    if (!currentProposal) return "0.00";

    if (selectedStakeTab === "stake") {
      return currentProposal.payout?.toFixed(2) ?? "0.00";
    }
    return currentProposal.ask_price?.toFixed(2) ?? "0.00";
  };

  const getPercentage = (type: "rise" | "fall") => {
    const currentProposal = proposal[type];
    if (!currentProposal) return "0.00";

    const { payout, ask_price } = currentProposal;
    if (!payout || !ask_price) return "0.00";

    return (((payout - ask_price) / ask_price) * 100).toFixed(2);
  };

  const label = selectedStakeTab === "stake" ? "Payout" : "Stake";

  return (
    <div className="trading-panel">
      <div className="panel-header">
        <div className="header-left">
          <Button variant="secondary" size="sm" onClick={() => {}}>
            <LabelPairedBackwardSmBoldIcon />
          </Button>
          <Text as="span" size="sm" className="learn-link">
            Learn about this trade type
          </Text>
        </div>
        <div className="trade-type">
          <div className="trade-icons">
            <div className="rise-icon">
              <TradeTypesUpsAndDownsRiseIcon />
            </div>
            <div className="fall-icon">
              <TradeTypesUpsAndDownsFallIcon />
            </div>
          </div>
          <Text as="span" size="sm" className="text-bold">
            Rise/Fall
          </Text>
        </div>
      </div>

      <div className="tabs-container">
        <div className="duration-endtime-section">
          <Tab
            tabs={durationTabs}
            activeTab={selectedDurationTab}
            onChange={setSelectedDurationTab}
          />
          {selectedDurationTab === "duration" ? (
            <div className="duration-input">
              <Text as="span" size="sm" className="text-bold">
                Minutes
              </Text>
              <TextFieldWithSteppers
                type="text"
                value={duration.toString()}
                onChange={(e) => setDuration(e.target.value)}
                className="duration-field"
                allowDecimals={false}
                allowSign={false}
                regex={/[^0-9]|^$/g}
                inputMode="numeric"
                shouldRound={true}
                textAlignment="center"
                minusDisabled={Number(duration) - 1 <= 0}
                variant="fill"
                status={durationError ? "error" : "success"}
                message={durationError}
              />
              <Text as="span" size="sm" className="text-less-prominent">
                Range: 1 - 1,440 minutes
              </Text>
            </div>
          ) : (
            <div className="endtime-inputs">
              <TextField
                type="text"
                value="03 Jan 2025"
                readOnly
                className="date-input"
              />
              <TextField
                type="text"
                value="03:20 GMT"
                readOnly
                className="time-input"
              />
            </div>
          )}
        </div>

        <div className="stake-payout-section">
          <Tab
            tabs={stakeTabs}
            activeTab={selectedStakeTab}
            onChange={setSelectedStakeTab}
          />
          <TextFieldWithSteppers
            type="text"
            allowDecimals={false}
            allowSign={false}
            regex={/[^0-9]|^$/g}
            inputMode="numeric"
            shouldRound={true}
            textAlignment="center"
            minusDisabled={Number(price) - 1 <= 0}
            variant="fill"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            unitRight="USD"
            className="stake-field"
            status={priceError ? "error" : "success"}
            message={priceError}
          />
        </div>
      </div>

      <div className="equals-section">
        <Checkbox
          name="allow-equals"
          checked={allowEquals}
          onChange={(e) =>
            setAllowEquals((e.target as HTMLInputElement).checked)
          }
          label="Allow equals"
        />
        <Tooltip tooltipContent="Allow equals tooltip">
          <LabelPairedCircleInfoSmBoldIcon className="text-less-prominent" />
        </Tooltip>
      </div>

      <div className="payout-section">
        <Button variant="primary" size="lg" fullWidth className="rise-button">
          <div className="button-content">
            <div className="left">
              <TradeTypesUpsAndDownsRiseIcon />
              <Text as="span" size="lg" className="text-bold">
                Rise
              </Text>
            </div>
            <Text as="span" size="lg" className="text-bold">
              {getPercentage("rise")}%
            </Text>
          </div>
        </Button>
        <div className="payout-info-row">
          {!isLoading.rise && (
            <>
              <Text as="span" size="sm" className="text-bold">
                {label}
              </Text>
              <Text as="span" size="lg" className="text-bold">
                {getAmount("rise")} USD
              </Text>
              <Tooltip tooltipContent={`${label} info`}>
                <LabelPairedCircleInfoSmBoldIcon className="info-icon" />
              </Tooltip>
            </>
          )}
        </div>

        <Button variant="primary" size="lg" fullWidth className="fall-button">
          <div className="button-content">
            <div className="left">
              <TradeTypesUpsAndDownsFallIcon />
              <Text as="span" size="lg" className="text-bold">
                Fall
              </Text>
            </div>
            <Text as="span" size="lg" className="text-bold">
              {getPercentage("fall")}%
            </Text>
          </div>
        </Button>
        <div className="payout-info-row">
          {!isLoading.fall && (
            <>
              <Text as="span" size="sm" className="text-bold">
                {label}
              </Text>
              <Text as="span" size="lg" className="text-bold">
                {getAmount("fall")} USD
              </Text>
              <Tooltip tooltipContent={`${label} info`}>
                <LabelPairedCircleInfoSmBoldIcon className="info-icon" />
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
