import React from "react";

interface PercentageSelectorProps {
  options: number[];
  selectedPercentage: number | null;
  onSelect: (percentage: number) => void;
}

const PercentageSelector: React.FC<PercentageSelectorProps> = ({
  options,
  selectedPercentage,
  onSelect,
}) => {
  return (
    <div>
      <label
        htmlFor="percentage-change"
        className="block text-sm font-medium text-gray-700"
      >
        Target Percentage Change
      </label>
      <div id="percentage-change" className="mt-2 grid grid-cols-3 gap-4">
        {options.map((percentage) => (
          <button
            key={percentage}
            type="button"
            onClick={() => onSelect(percentage)}
            className={`relative flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md ${
              selectedPercentage === percentage
                ? "border-transparent text-white bg-indigo-600 hover:bg-indigo-700"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            {percentage}%
          </button>
        ))}
      </div>
    </div>
  );
};

export default PercentageSelector;
