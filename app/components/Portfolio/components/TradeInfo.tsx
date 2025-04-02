import React from "react";
import TextInfo from "~/components/shared/TextInfo";

interface TradeInfoProps {
  carName: string;
  formattedExpiry: string;
  strikePrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: string;
  imageUrl: string;
}

const TradeInfo: React.FC<TradeInfoProps> = ({
  carName,
  formattedExpiry,
  strikePrice,
  currentValue,
  profitLoss,
  profitLossPercent,
  imageUrl,
}) => {
  return (
    <div className="flex p-4">
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={carName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-bold">{carName}</h3>

        {/* Key info */}
        <div className="mt-2 text-sm space-y-1">
          <TextInfo label="Expires:" value={formattedExpiry} />

          <TextInfo
            label="Strike Price:"
            value={`$${strikePrice.toLocaleString()}`}
          />

          <TextInfo
            label="Current Value:"
            value={`$${currentValue.toLocaleString()}`}
          />

          <TextInfo
            label="P/L:"
            value={
              <>
                {profitLoss >= 0 ? "+" : ""}${profitLoss.toLocaleString()} (
                {profitLossPercent}%)
              </>
            }
            valueClassName={`font-medium ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TradeInfo;
