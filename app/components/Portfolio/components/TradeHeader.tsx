import React from "react";
import Badge from "~/components/shared/Badge";

interface TradeHeaderProps {
  type: "CALL" | "PUT";
  quantity: number;
  isExpanded: boolean;
}

const TradeHeader: React.FC<TradeHeaderProps> = ({
  type,
  quantity,
  isExpanded,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Badge text={type} variant={type === "CALL" ? "success" : "error"} />
        {quantity > 1 && <Badge text={`x${quantity}`} variant="gray" />}
      </div>
      <svg
        className={`h-5 w-5 text-gray-500 transform transition-transform ${
          isExpanded ? "rotate-180" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default TradeHeader;
