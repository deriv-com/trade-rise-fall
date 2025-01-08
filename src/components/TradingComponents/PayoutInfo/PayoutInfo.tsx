import { Text, Tooltip } from "@deriv-com/quill-ui";
import { LabelPairedCircleInfoSmBoldIcon } from "@deriv/quill-icons";

interface PayoutInfoProps {
  type: "rise" | "fall";
  label: string;
  amount: string;
  isLoading: boolean;
}

export const PayoutInfo = ({
  type,
  label,
  amount,
  isLoading,
}: PayoutInfoProps) => {
  return (
    <div className="payout-info-row">
      {!isLoading && (
        <>
          <Text as="span" size="sm" className="text-bold">
            {label}
          </Text>
          <Text as="span" size="lg" className="text-bold">
            {amount} USD
          </Text>
          <Tooltip tooltipContent={`${label} info`}>
            <LabelPairedCircleInfoSmBoldIcon className="info-icon" />
          </Tooltip>
        </>
      )}
    </div>
  );
};
