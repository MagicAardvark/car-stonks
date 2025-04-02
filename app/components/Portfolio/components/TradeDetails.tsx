import React from "react";
import Button from "~/components/shared/Button";

interface TradeDetailsProps {
  id: string;
  strikePrice: number;
  entryPrice: number;
  premium: number;
  percentageChange: number;
  type: "CALL" | "PUT";
  onClose: () => void;
}

const TradeDetails: React.FC<TradeDetailsProps> = ({
  id,
  strikePrice,
  entryPrice,
  premium,
  percentageChange,
  type,
  onClose,
}) => {
  return (
    <div
      id={`trade-details-${id}`}
      className="p-4 bg-gray-50 border-t border-gray-200"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Strike Price</p>
          <p className="font-medium">${strikePrice.toLocaleString()}</p>
          <p className="text-xs text-gray-500">
            ({percentageChange}% {type === "CALL" ? "above" : "below"} entry)
          </p>
        </div>
        <div>
          <p className="text-gray-500">Entry Price</p>
          <p className="font-medium">${entryPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Premium Paid</p>
          <p className="font-medium">${premium.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Potential Target</p>
          <p className="font-medium">
            {type === "CALL" ? "↑" : "↓"} $
            {Math.abs(strikePrice - entryPrice).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Close Position
        </Button>
      </div>
    </div>
  );
};

export default TradeDetails;
