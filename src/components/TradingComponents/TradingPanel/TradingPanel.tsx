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
import { TradingPanelProps, DurationTabValue, StakeTabValue } from "../types";
import "./TradingPanel.scss";

export const TradingPanel = ({
  duration,
  price,
  allowEquals,
  selectedDurationTab,
  selectedStakeTab,
  onDurationChange,
  onPriceChange,
  onAllowEqualsChange,
  onDurationTabChange,
  onStakeTabChange,
}: TradingPanelProps) => {
  const durationTabs: Array<{ label: string; value: DurationTabValue }> = [
    { label: "Duration", value: "duration" },
    { label: "End time", value: "endtime" },
  ];

  const stakeTabs: Array<{ label: string; value: StakeTabValue }> = [
    { label: "Stake", value: "stake" },
    { label: "Payout", value: "payout" },
  ];

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
            onChange={onDurationTabChange}
          />
          {selectedDurationTab === "duration" ? (
            <div className="duration-input">
              <Text as="span" size="sm" className="text-bold">
                Minutes
              </Text>
              <TextFieldWithSteppers
                value={duration.toString()}
                onChange={(e) => onDurationChange(e.target.value)}
                className="duration-field"
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
            onChange={onStakeTabChange}
          />
          <TextFieldWithSteppers
            type="text"
            allowDecimals
            allowSign={false}
            regex={/[^0-9.,]/g}
            inputMode="decimal"
            shouldRound={false}
            customType="commaRemoval"
            decimals={2}
            textAlignment="center"
            minusDisabled={Number(price) - 1 <= 0}
            variant="fill"
            value={price.toString()}
            onChange={(e) => onPriceChange(e.target.value)}
            unitRight="USD"
            className="stake-field"
          />
        </div>
      </div>

      <div className="equals-section">
        <Checkbox
          name="allow-equals"
          checked={allowEquals}
          onChange={onAllowEqualsChange}
          label="Allow equals"
        />
        <Tooltip tooltipContent="Allow equals tooltip">
          <LabelPairedCircleInfoSmBoldIcon className="text-less-prominent" />
        </Tooltip>
      </div>

      <div className="payout-section">
        <div className="payout-info">
          <div className="payout-amount">
            <Text as="span" size="sm" className="text-less-prominent">
              Payout
            </Text>
            <Text as="span" size="lg" className="text-bold">
              97.71 USD
            </Text>
          </div>
          <Tooltip tooltipContent="Payout info">
            <Button variant="secondary" size="sm" className="info-button">
              <LabelPairedCircleInfoSmBoldIcon />
            </Button>
          </Tooltip>
        </div>

        <Button variant="primary" size="lg" fullWidth className="rise-button">
          <div className="button-content">
            <div className="left">
              <TradeTypesUpsAndDownsRiseIcon />
              <Text as="span" size="lg" className="text-bold">
                Rise
              </Text>
            </div>
            <Text as="span" size="lg" className="text-bold">
              95.42%
            </Text>
          </div>
        </Button>

        <Button variant="primary" size="lg" fullWidth className="fall-button">
          <div className="button-content">
            <div className="left">
              <TradeTypesUpsAndDownsFallIcon />
              <Text as="span" size="lg" className="text-bold">
                Fall
              </Text>
            </div>
            <Text as="span" size="lg" className="text-bold">
              95.20%
            </Text>
          </div>
        </Button>
      </div>
    </div>
  );
};
