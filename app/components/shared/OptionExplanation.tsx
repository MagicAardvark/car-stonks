import React from "react";

const OptionExplanation: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-600">
        <span className="font-medium">CALL Option:</span> Bet that the
        car&apos;s price will rise above a certain threshold. You profit if the
        price increases more than your target percentage.
      </p>
      <p className="mt-2 text-sm text-gray-600">
        <span className="font-medium">PUT Option:</span> Bet that the car&apos;s
        price will fall below a certain threshold. You profit if the price
        decreases more than your target percentage.
      </p>
    </div>
  );
};

export default OptionExplanation;
