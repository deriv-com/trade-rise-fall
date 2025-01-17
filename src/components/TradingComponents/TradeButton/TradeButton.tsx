import { Button, Text } from "@deriv-com/quill-ui";
import {
  TradeTypesUpsAndDownsRiseIcon,
  TradeTypesUpsAndDownsFallIcon,
} from "@deriv/quill-icons";

interface TradeButtonProps {
  type: "rise" | "fall";
  percentage: string;
}

export const TradeButton = ({ type, percentage }: TradeButtonProps) => {
  const Icon =
    type === "rise"
      ? TradeTypesUpsAndDownsRiseIcon
      : TradeTypesUpsAndDownsFallIcon;
  const label = type === "rise" ? "Rise" : "Fall";
  const className = `${type}-button`;

  return (
    <Button variant="primary" size="lg" fullWidth className={className}>
      <div className="button-content">
        <div className="left">
          <Icon />
          <Text as="span" size="lg" className="text-bold">
            {label}
          </Text>
        </div>
        <Text as="span" size="lg" className="text-bold">
          {percentage}%
        </Text>
      </div>
    </Button>
  );
};
