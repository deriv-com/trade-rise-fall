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
  } = tradingPanelStore;

  const { proposal, clearProposal } = usePriceProposal(
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

  const getDisplayAmount = () => {
    if (!proposal) return "0.00";

    if (selectedStakeTab === "stake") {
      return proposal.payout?.toFixed(2) ?? "0.00";
    }
    return proposal.ask_price?.toFixed(2) ?? "0.00";
  };

  const getDisplayLabel = () => {
    return selectedStakeTab === "stake" ? "Payout" : "Stake";
  };

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
                value={duration.toString()}
                onChange={(e) => setDuration(e.target.value)}
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
        <div className="payout-info">
          <div className="payout-amount">
            <Text as="span" size="sm" className="text-less-prominent">
              {getDisplayLabel()}
            </Text>
            <Text as="span" size="lg" className="text-bold">
              {getDisplayAmount()} USD
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
              {proposal
                ? (
                    ((proposal.payout - proposal.ask_price) /
                      proposal.ask_price) *
                    100
                  ).toFixed(2)
                : "0.00"}
              %
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
              {proposal
                ? (
                    ((proposal.payout - proposal.ask_price) /
                      proposal.ask_price) *
                    100
                  ).toFixed(2)
                : "0.00"}
              %
            </Text>
          </div>
        </Button>
      </div>
    </div>
  );
});
