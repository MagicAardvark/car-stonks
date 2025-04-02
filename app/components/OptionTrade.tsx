import { useState } from "react";

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
}: OptionTradeProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 relative">
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10 rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Position Close</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to close your {type} position on {carName}?
              {isProfitable
                ? ` You will realize a profit of $${profitLoss.toLocaleString()}.`
                : ` You will realize a loss of $${Math.abs(profitLoss).toLocaleString()}.`}
            </p>
            <p className="text-gray-600 mb-4">
              ${currentValue.toLocaleString()} will be added to your cash
              balance.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClose(id);
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Close Position
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trade Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{carName}</h3>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                type === "CALL"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {type}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            <p>Strike Price: ${strikePrice.toLocaleString()}</p>
            <p>Entry Price: ${entryPrice.toLocaleString()}</p>
            <p>Expiry: {formattedExpiry}</p>
            {quantity > 1 && <p>Quantity: {quantity} contracts</p>}
          </div>
        </div>

        {/* Financial Details */}
        <div>
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Premium Paid:</span>
              <span className="font-medium">${premium.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Current Value:</span>
              <span className="font-medium">
                ${currentValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Profit/Loss:</span>
              <span
                className={`font-medium ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {profitLoss >= 0 ? "+" : ""}
                {profitLoss.toLocaleString()} ({profitLossPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowConfirmation(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close Position
          </button>
        </div>
      </div>
    </div>
  );
}
