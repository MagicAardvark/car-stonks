import { useState } from "react";
import type { Car } from "~/types";
import Button from "~/components/shared/Button";
import OptionExplanation from "~/components/shared/OptionExplanation";
import OptionTypeSelector from "./components/OptionTypeSelector";
import ExpirySelector from "./components/ExpirySelector";
import PercentageSelector from "./components/PercentageSelector";
import QuantitySelector from "./components/QuantitySelector";
import TradeSummary from "./components/TradeSummary";
import { useToast } from "~/components/shared/ToastContext";

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
  const { showToast } = useToast();

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

    try {
      onSubmit({
        type: selectedType,
        expiryMonths: selectedExpiry,
        percentageChange: selectedPercentage,
        premium: calculateTotalPremium(),
        quantity: quantity,
      });

      showToast(
        `Successfully placed ${selectedType} option on ${car.name}!`,
        "success",
      );

      // Reset form after successful submission
      setSelectedType(null);
      setSelectedExpiry(null);
      setSelectedPercentage(null);
      setQuantity(1);
    } catch (error) {
      showToast("Failed to place option trade. Please try again.", "error");
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrement quantity, but never below 1
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // Check if form is valid for submission
  const isFormValid = selectedType && selectedExpiry && selectedPercentage;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-medium text-gray-900">Trade Options</h3>

      {/* Option explanation */}
      <div className="mt-2">
        <OptionExplanation />
      </div>

      <div className="mt-6 space-y-6">
        {/* Option Type Selection */}
        <OptionTypeSelector
          selectedType={selectedType}
          onSelect={setSelectedType}
        />

        {/* Expiry Selection */}
        <ExpirySelector
          options={EXPIRY_OPTIONS}
          selectedExpiry={selectedExpiry}
          onSelect={setSelectedExpiry}
        />

        {/* Percentage Change Selection */}
        <PercentageSelector
          options={PERCENTAGE_CHANGES}
          selectedPercentage={selectedPercentage}
          onSelect={setSelectedPercentage}
        />

        {/* Quantity Selection */}
        <QuantitySelector
          quantity={quantity}
          onIncrement={incrementQuantity}
          onDecrement={decrementQuantity}
        />

        {/* Trade Summary */}
        <TradeSummary
          premium={calculatePremium()}
          totalPremium={calculateTotalPremium()}
          potentialProfit={calculatePotentialProfit()}
          isValid={!!isFormValid}
        />

        {/* Submit Button */}
        <div>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            variant={isFormValid ? "primary" : "secondary"}
            fullWidth
            className="py-3"
          >
            Place Option Trade
          </Button>
        </div>
      </div>
    </div>
  );
}
