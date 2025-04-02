import { useState } from "react";
import type { Car } from "~/types";

interface BetFormProps {
  car: Car;
  onSubmit: (bet: {
    type: "CALL" | "PUT";
    expiryMonths: number;
    percentageChange: number;
    premium: number;
    quantity: number;
  }) => void;
}

const EXPIRY_OPTIONS = [1, 3, 6]; // months
const PERCENTAGE_CHANGES = [1, 2, 5, 10, 15, 30];

export default function BetForm({ car, onSubmit }: BetFormProps) {
  const [selectedType, setSelectedType] = useState<"CALL" | "PUT" | null>(null);
  const [selectedExpiry, setSelectedExpiry] = useState<number | null>(null);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate a more realistic premium based on option pricing factors
  const calculatePremium = () => {
    if (!selectedType || !selectedExpiry || !selectedPercentage) return 0;

    // For a more realistic options model, we consider:
    // 1. Current price (higher value = higher premium)
    // 2. Volatility (approximated by price history variance)
    // 3. Time to expiry (longer = higher premium)
    // 4. Strike distance (higher percentage = higher premium)

    // Calculate historical volatility (simplified)
    const priceChanges = car.priceHistory
      .map((h, i, arr) =>
        i > 0 ? (h.price - arr[i - 1].price) / arr[i - 1].price : 0,
      )
      .slice(1);

    const volatility =
      priceChanges.length > 0
        ? Math.max(
            0.05,
            Math.abs(
              priceChanges.reduce((sum, val) => sum + val, 0) /
                priceChanges.length,
            ) * 10,
          )
        : 0.1; // Fallback volatility

    // Base premium calculation (more realistic)
    const carValue = car.currentPrice;
    const basePercentage = 0.5; // 0.5% of car price as base
    const basePremium = carValue * (basePercentage / 100);

    // Adjust based on option type (CALL options are priced differently than PUT)
    const typeMultiplier =
      selectedType === "CALL"
        ? 1 +
          (car.priceHistory.length > 1
            ? (car.currentPrice - car.priceHistory[0].price) /
              car.priceHistory[0].price
            : 0.1)
        : 1 +
          (car.priceHistory.length > 1
            ? (car.priceHistory[0].price - car.currentPrice) /
                car.priceHistory[0].price +
              0.1
            : 0.1);

    // Time value adjustment (longer expiry = more premium)
    const expiryMultiplier = Math.sqrt(selectedExpiry);

    // Strike adjustment (higher percentage change = higher premium)
    const percentageMultiplier = selectedPercentage / 5;

    // Volatility adjustment
    const volatilityMultiplier = 1 + volatility;

    // Calculate total premium for a single contract
    const premium = Math.max(
      1000, // Minimum premium of $1,000
      Math.round(
        basePremium *
          typeMultiplier *
          expiryMultiplier *
          percentageMultiplier *
          volatilityMultiplier,
      ),
    );

    return premium;
  };

  // Calculate total premium for all contracts
  const calculateTotalPremium = () => {
    return calculatePremium() * quantity;
  };

  const calculatePotentialProfit = () => {
    if (!selectedType || !selectedExpiry || !selectedPercentage) return 0;

    const premium = calculatePremium();
    let strikePrice = 0;

    if (selectedType === "CALL") {
      // For CALL options, strike is current price + percentage increase
      strikePrice = car.currentPrice * (1 + selectedPercentage / 100);

      // Potential profit if price increases by 50% more than the target
      const potentialPrice =
        car.currentPrice * (1 + (selectedPercentage * 1.5) / 100);
      return (
        Math.round(Math.max(0, potentialPrice - strikePrice) - premium) *
        quantity
      );
    } else {
      // For PUT options, strike is current price - percentage decrease
      strikePrice = car.currentPrice * (1 - selectedPercentage / 100);

      // Potential profit if price decreases by 50% more than the target
      const potentialPrice =
        car.currentPrice * (1 - (selectedPercentage * 1.5) / 100);
      return (
        Math.round(Math.max(0, strikePrice - potentialPrice) - premium) *
        quantity
      );
    }
  };

  const handleSubmit = () => {
    if (!selectedType || !selectedExpiry || !selectedPercentage) return;

    onSubmit({
      type: selectedType,
      expiryMonths: selectedExpiry,
      percentageChange: selectedPercentage,
      premium: calculateTotalPremium(),
      quantity: quantity,
    });
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrement quantity, but never below 1
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-medium text-gray-900">Trade Options</h3>

      {/* Option explanation */}
      <div className="mt-2 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <span className="font-medium">CALL Option:</span> Bet that the
          car&apos;s price will rise above a certain threshold. You profit if
          the price increases more than your target percentage.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">PUT Option:</span> Bet that the
          car&apos;s price will fall below a certain threshold. You profit if
          the price decreases more than your target percentage.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Option Type Selection */}
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
              onClick={() => setSelectedType("CALL")}
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
              onClick={() => setSelectedType("PUT")}
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

        {/* Expiry Selection */}
        <div>
          <label
            htmlFor="expiry-period"
            className="block text-sm font-medium text-gray-700"
          >
            Expiry Period
          </label>
          <div id="expiry-period" className="mt-2 grid grid-cols-3 gap-4">
            {EXPIRY_OPTIONS.map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setSelectedExpiry(months)}
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

        {/* Percentage Change Selection */}
        <div>
          <label
            htmlFor="percentage-change"
            className="block text-sm font-medium text-gray-700"
          >
            Target Percentage Change
          </label>
          <div id="percentage-change" className="mt-2 grid grid-cols-3 gap-4">
            {PERCENTAGE_CHANGES.map((percentage) => (
              <button
                key={percentage}
                type="button"
                onClick={() => setSelectedPercentage(percentage)}
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
          {selectedType && selectedPercentage && (
            <div>
              <p className="mt-2 text-xs text-gray-500">
                Strike Price:{" "}
                {selectedType === "CALL"
                  ? `$${Math.round(
                      car.currentPrice * (1 + selectedPercentage / 100),
                    ).toLocaleString()}`
                  : `$${Math.round(
                      car.currentPrice * (1 - selectedPercentage / 100),
                    ).toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-500">
                You&apos;re betting the car will be worth{" "}
                {selectedType === "CALL" ? "more" : "less"} than this amount by
                expiry
              </p>
            </div>
          )}
        </div>

        {/* Quantity Selection */}
        <div>
          <label
            htmlFor="quantity-selector"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <div id="quantity-selector" className="mt-2 flex items-center">
            <button
              type="button"
              onClick={decrementQuantity}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              -
            </button>
            <span className="mx-4 text-lg font-medium">{quantity}</span>
            <button
              type="button"
              onClick={incrementQuantity}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Premium and Profit Potential Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900">
              Contract Premium
            </h4>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              ${calculateTotalPremium().toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {quantity > 1
                ? `${quantity} × $${calculatePremium().toLocaleString()}`
                : "Amount you pay now"}
            </p>
          </div>

          {selectedType && selectedPercentage && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">
                Potential Profit
              </h4>
              <p className="mt-2 text-2xl font-bold text-green-600">
                ${calculatePotentialProfit().toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                If price {selectedType === "CALL" ? "rises" : "falls"} by{" "}
                {selectedPercentage * 1.5}%
              </p>
            </div>
          )}
        </div>

        {/* Trade Button */}
        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          disabled={!selectedType || !selectedExpiry || !selectedPercentage}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Place Trade
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">Confirm Trade</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Car</p>
                <p className="text-sm font-medium text-gray-900">{car.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Option Type</p>
                <p
                  className={`text-sm font-medium ${selectedType === "CALL" ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedType} (
                  {selectedType === "CALL"
                    ? "Price Increase"
                    : "Price Decrease"}
                  )
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedExpiry ?? 0} Month
                  {(selectedExpiry ?? 0) > 1 ? "s" : ""}
                  <span className="text-xs text-gray-500 ml-2">
                    (expires{" "}
                    {new Date(
                      new Date().setMonth(
                        new Date().getMonth() + (selectedExpiry ?? 0),
                      ),
                    ).toLocaleDateString()}
                    )
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Strike Price ({selectedType === "CALL" ? "Above" : "Below"})
                </p>
                <p className="text-sm font-medium text-gray-900">
                  $
                  {selectedType === "CALL"
                    ? Math.round(
                        car.currentPrice *
                          (1 + (selectedPercentage ?? 0) / 100),
                      ).toLocaleString()
                    : Math.round(
                        car.currentPrice *
                          (1 - (selectedPercentage ?? 0) / 100),
                      ).toLocaleString()}
                  <span className="text-xs text-gray-500 ml-2">
                    ({selectedPercentage ?? 0}%{" "}
                    {selectedType === "CALL" ? "above" : "below"} current price)
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-900">
                  {quantity} contract{quantity > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Premium</p>
                <p className="text-sm font-medium text-gray-900">
                  ${calculateTotalPremium().toLocaleString()}
                </p>
                {quantity > 1 && (
                  <p className="text-xs text-gray-500">
                    (${calculatePremium().toLocaleString()} per contract)
                  </p>
                )}
              </div>

              <div className="p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">
                  By placing this trade, you agree to pay $
                  {calculateTotalPremium().toLocaleString()} now for {quantity}{" "}
                  contract{quantity > 1 ? "s" : ""}.
                  {selectedType === "CALL"
                    ? ` Your option will be valuable if the price rises above $${Math.round(car.currentPrice * (1 + (selectedPercentage ?? 0) / 100)).toLocaleString()}.`
                    : ` Your option will be valuable if the price falls below $${Math.round(car.currentPrice * (1 - (selectedPercentage ?? 0) / 100)).toLocaleString()}.`}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSubmit();
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
