import { useState } from "react";
import ConfirmationModal from "~/components/shared/ConfirmationModal";
import TradeHeader from "./components/TradeHeader";
import TradeInfo from "./components/TradeInfo";
import TradeDetails from "./components/TradeDetails";

interface OptionTradeProps {
  id: string;
  carName: string;
  type: "CALL" | "PUT";
  entryPrice: number;
  currentValue: number;
  expiryDate: string;
  percentageChange: number;
  premium: number;
  quantity: number;
  onClose: (id: string) => void;
  imageUrl?: string;
}

export default function OptionTrade({
  id,
  carName,
  type,
  entryPrice,
  currentValue,
  expiryDate,
  percentageChange,
  premium,
  quantity = 1,
  onClose,
  imageUrl = "/images/default-car.jpg",
}: OptionTradeProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const profitLoss = currentValue - premium;
  const profitLossPercent = ((profitLoss / premium) * 100).toFixed(2);
  const isProfitable = profitLoss > 0;
  const formattedExpiry = new Date(expiryDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Calculate strike price
  const strikePrice =
    type === "CALL"
      ? Math.round(entryPrice * (1 + percentageChange / 100))
      : Math.round(entryPrice * (1 - percentageChange / 100));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClosePosition = () => {
    onClose(id);
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      {/* Main card content */}
      <div
        className="cursor-pointer"
        onClick={toggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleExpand();
            e.preventDefault();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`trade-details-${id}`}
      >
        <TradeHeader type={type} quantity={quantity} isExpanded={isExpanded} />

        <TradeInfo
          carName={carName}
          formattedExpiry={formattedExpiry}
          strikePrice={strikePrice}
          currentValue={currentValue}
          profitLoss={profitLoss}
          profitLossPercent={profitLossPercent}
          imageUrl={imageUrl}
        />
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <TradeDetails
          id={id}
          strikePrice={strikePrice}
          entryPrice={entryPrice}
          premium={premium}
          percentageChange={percentageChange}
          type={type}
          onClose={() => setShowConfirmation(true)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Position Close"
        message={
          <>
            <p className="text-gray-600 mb-4">
              Are you sure you want to close your {type} position on {carName}?
              {isProfitable
                ? ` You will realize a profit of $${profitLoss.toLocaleString()}.`
                : ` You will realize a loss of $${Math.abs(profitLoss).toLocaleString()}.`}
            </p>
            <p className="text-gray-600">
              ${currentValue.toLocaleString()} will be added to your cash
              balance.
            </p>
          </>
        }
        confirmText="Close Position"
        onConfirm={handleClosePosition}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
}
