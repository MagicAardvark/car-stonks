import React from "react";

interface OptionTypeSelectorProps {
  selectedType: "CALL" | "PUT" | null;
  onSelect: (type: "CALL" | "PUT") => void;
}

const OptionTypeSelector: React.FC<OptionTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div>
      <label
        htmlFor="option-type"
        className="block text-sm font-medium text-gray-700"
      >
        Option Type
      </label>
      <div id="option-type" className="mt-2 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect("CALL")}
          className={`relative flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md ${
            selectedType === "CALL"
              ? "border-transparent text-white bg-green-600 hover:bg-green-700"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="mr-2">↑</span> CALL (Higher)
        </button>
        <button
          type="button"
          onClick={() => onSelect("PUT")}
          className={`relative flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md ${
            selectedType === "PUT"
              ? "border-transparent text-white bg-red-600 hover:bg-red-700"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="mr-2">↓</span> PUT (Lower)
        </button>
      </div>
    </div>
  );
};

export default OptionTypeSelector;
