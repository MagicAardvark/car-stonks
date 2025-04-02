import React from "react";

interface ExpirySelectorProps {
  options: number[];
  selectedExpiry: number | null;
  onSelect: (expiry: number) => void;
}

const ExpirySelector: React.FC<ExpirySelectorProps> = ({
  options,
  selectedExpiry,
  onSelect,
}) => {
  return (
    <div>
      <label
        htmlFor="expiry-period"
        className="block text-sm font-medium text-gray-700"
      >
        Expiry Period
      </label>
      <div id="expiry-period" className="mt-2 grid grid-cols-3 gap-4">
        {options.map((months) => (
          <button
            key={months}
            type="button"
            onClick={() => onSelect(months)}
            className={`relative flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md ${
              selectedExpiry === months
                ? "border-transparent text-white bg-indigo-600 hover:bg-indigo-700"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            {months} Month{months > 1 ? "s" : ""}
          </button>
        ))}
      </div>
      {selectedExpiry && (
        <p className="mt-2 text-xs text-gray-500">
          Expires:{" "}
          {new Date(
            new Date().setMonth(new Date().getMonth() + selectedExpiry),
          ).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ExpirySelector;
