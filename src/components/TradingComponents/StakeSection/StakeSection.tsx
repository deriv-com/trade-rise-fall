import { TextFieldWithSteppers } from "@deriv-com/quill-ui";
import { Tab } from "../Tab";
import { StakeTabValue } from "../types";

interface StakeSectionProps {
  price: string;
  selectedStakeTab: StakeTabValue;
  priceError: string;
  setPrice: (value: string) => void;
  setSelectedStakeTab: (value: StakeTabValue) => void;
}

interface StakeTab {
  label: string;
  value: StakeTabValue;
}

export const StakeSection = ({
  price,
  selectedStakeTab,
  priceError,
  setPrice,
  setSelectedStakeTab,
}: StakeSectionProps) => {
  const stakeTabs: StakeTab[] = [
    { label: "Stake", value: "stake" },
    { label: "Payout", value: "payout" },
  ];

  return (
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
  );
};
