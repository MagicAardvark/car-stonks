import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div>
      <label
        htmlFor="quantity"
        className="block text-sm font-medium text-gray-700"
      >
        Quantity
      </label>
      <div className="mt-2 flex items-center">
        <button
          type="button"
          onClick={onDecrement}
          className="p-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            />
          </svg>
        </button>
        <div className="px-4 py-2 border-t border-b border-gray-300 text-center min-w-[50px]">
          {quantity}
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="p-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
