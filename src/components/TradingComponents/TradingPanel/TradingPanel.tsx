import {
  Button,
  TextField,
  Text,
  Tooltip,
  Checkbox,
  TextFieldWithSteppers,
} from "@deriv-com/quill-ui";
import { TradingPanelProps } from "../types";
import "./TradingPanel.scss";

export const TradingPanel = ({
  duration,
  stake,
  allowEquals,
  selectedDurationTab,
  selectedStakeTab,
  onDurationChange,
  onStakeChange,
  onAllowEqualsChange,
  onDurationTabChange,
  onStakeTabChange,
}: TradingPanelProps) => {
  return (
    <div className="trading-panel">
      <div className="panel-header">
        <div className="header-left">
          <Button variant="secondary" size="sm" onClick={() => {}}>
            ←
          </Button>
          <Text as="span" size="sm" className="learn-link">
            Learn about this trade type
          </Text>
        </div>
        <div className="trade-type">
          <div className="trade-icons">
            <div className="rise-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
            </div>
            <div className="fall-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
          <Text as="span" size="sm" className="text-bold">
            Rise/Fall
          </Text>
        </div>
      </div>

      <div className="tabs-container">
        <div className="duration-endtime-section">
          <div className="tab-buttons">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDurationTabChange("duration")}
              className={`tab-button ${
                selectedDurationTab === "duration" ? "active" : ""
              }`}
            >
              Duration
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDurationTabChange("endtime")}
              className={`tab-button ${
                selectedDurationTab === "endtime" ? "active" : ""
              }`}
            >
              End time
            </Button>
          </div>

          {selectedDurationTab === "duration" ? (
            <>
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
            </>
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
          <div className="tab-buttons">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onStakeTabChange("stake")}
              className={`tab-button ${
                selectedStakeTab === "stake" ? "active" : ""
              }`}
            >
              Stake
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onStakeTabChange("payout")}
              className={`tab-button ${
                selectedStakeTab === "payout" ? "active" : ""
              }`}
            >
              Payout
            </Button>
          </div>

          <TextFieldWithSteppers
            value={stake.toString()}
            onChange={(e) => onStakeChange(e.target.value)}
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
        <div className="tooltip-wrapper">
          <Text as="span" size="sm" className="text-less-prominent">
            ⓘ
          </Text>
          <span className="tooltip-text">Allow equals tooltip</span>
        </div>
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
          <Button variant="secondary" size="sm" className="info-button">
            ⓘ
          </Button>
        </div>

        <Button variant="primary" size="lg" fullWidth className="rise-button">
          <div className="button-content">
            <div className="left">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
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
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
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
