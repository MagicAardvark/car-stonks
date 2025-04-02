import React from "react";

interface TradeSummaryProps {
  premium: number;
  totalPremium: number;
  potentialProfit: number;
  isValid: boolean;
}

const TradeSummary: React.FC<TradeSummaryProps> = ({
  premium,
  totalPremium,
  potentialProfit,
  isValid,
}) => {
  if (!isValid) return null;

  return (
    <div className="bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
        Trade Summary
      </h3>

      {/* Cost Section */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Premium per Contract:</span>
          <span className="font-medium text-gray-800">
            ${premium.toLocaleString()}
          </span>
        </div>

        {totalPremium !== premium && (
          <>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Contracts:</span>
              <span className="font-medium text-gray-800">
                {totalPremium / premium}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Total Premium:</span>
              <span className="font-bold text-gray-900">
                ${totalPremium.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Outcome Section */}
      <div className="bg-white rounded-md p-3 border border-gray-200 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Potential Profit:</span>
          <div className="flex items-center">
            <span className="text-emerald-600 font-medium text-sm">
              +${potentialProfit.toLocaleString()}
            </span>
            <svg
              className="w-4 h-4 ml-1 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Max Loss:</span>
          <div className="flex items-center">
            <span className="text-red-600 font-medium text-sm">
              -${totalPremium.toLocaleString()}
            </span>
            <svg
              className="w-4 h-4 ml-1 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Risk Notice */}
      <div className="mt-3 text-xs text-gray-500 italic">
        Note: Options trading involves risk. You can lose your entire premium
        amount.
      </div>
    </div>
  );
};

export default TradeSummary;
