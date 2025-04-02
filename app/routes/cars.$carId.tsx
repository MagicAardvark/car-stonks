import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import BetForm from "~/components/BetForm";
import {
  mockCars,
  portfolioStats as initialPortfolioStats,
  mockTrades,
} from "~/data";
import { v4 as uuidv4 } from "uuid";
import type { Car, PortfolioStats, BetData } from "~/types";

export default function CarDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [userStats, setUserStats] = useState<PortfolioStats>(() => {
    // Try to load from localStorage if available
    if (typeof window !== "undefined") {
      const savedStats = localStorage.getItem("portfolioStats");
      return savedStats ? JSON.parse(savedStats) : initialPortfolioStats;
    }
    return initialPortfolioStats;
  });

  // Fetch car data based on the ID
  useEffect(() => {
    const foundCar = mockCars.find((c) => c.id === params.carId);
    if (foundCar) {
      setCar(foundCar);
    }
  }, [params.carId]);

  // Save stats to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolioStats", JSON.stringify(userStats));
    }
  }, [userStats]);

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Loading car details...</p>
      </div>
    );
  }

  // Function to check if user has sufficient funds
  const hasSufficientFunds = (premium: number): boolean => {
    return userStats.cashBalance >= premium;
  };

  // Handle bet submission
  const handleBetSubmit = (betData: BetData) => {
    // Check if user has enough funds
    if (!hasSufficientFunds(betData.premium)) {
      alert(
        `Insufficient funds. You need $${betData.premium.toLocaleString()} to place this trade.`,
      );
      return;
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + betData.expiryMonths);

    // Create a new trade
    const newTrade = {
      id: uuidv4(),
      carId: car.id,
      type: betData.type,
      entryPrice: car.currentPrice,
      currentValue: Math.round(betData.premium * 0.9), // Initially worth slightly less due to spread
      expiryDate: expiryDate.toISOString(),
      percentageChange: betData.percentageChange,
      premium: betData.premium,
      quantity: betData.quantity || 1,
    };

    // Update user stats
    setUserStats((prev) => ({
      ...prev,
      cashBalance: prev.cashBalance - betData.premium,
      activePositions: prev.activePositions + (betData.quantity || 1),
      totalTrades: prev.totalTrades + 1,
    }));

    // Add the new trade to localStorage
    if (typeof window !== "undefined") {
      const existingTrades = JSON.parse(
        localStorage.getItem("trades") || JSON.stringify(mockTrades),
      );
      localStorage.setItem(
        "trades",
        JSON.stringify([...existingTrades, newTrade]),
      );
    }

    // Show success message and navigate to portfolio
    const contractText =
      (betData.quantity || 1) > 1
        ? `${betData.quantity} contracts`
        : "a contract";
    alert(
      `Successfully purchased ${contractText} of ${betData.type} options on ${car.name}!`,
    );
    navigate("/portfolio");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left column: Car image and details */}
      <div>
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />

        <div className="mt-6">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          <p className="text-xl text-gray-600 mt-1">
            {car.brand} {car.model} ({car.year})
          </p>

          <div className="flex items-center mt-4">
            <div className="bg-blue-50 rounded-lg p-4 flex-1">
              <p className="text-gray-600 text-sm">Current Value</p>
              <p className="text-2xl font-bold text-blue-700">
                ${car.currentPrice.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex-1 ml-4">
              <p className="text-gray-600 text-sm">Your Cash Balance</p>
              <p className="text-2xl font-bold text-gray-700">
                ${userStats.cashBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Price History */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Price History</h3>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              {car.priceHistory.map((history, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-gray-600">
                    {new Date(history.date).toLocaleDateString()}
                  </span>
                  <span className="font-medium">
                    ${history.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Car Specifications */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">
              Specifications
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Brand</p>
                  <p className="font-medium">{car.brand}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Model</p>
                  <p className="font-medium">{car.model}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Year</p>
                  <p className="font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Market Sentiment</p>
                  <p className="font-medium">
                    {car.priceHistory.length > 1 &&
                    car.priceHistory[0].price < car.currentPrice
                      ? "Bullish 📈"
                      : "Bearish 📉"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: Trading form */}
      <div>
        <BetForm car={car} onSubmit={handleBetSubmit} />
      </div>
    </div>
  );
}
