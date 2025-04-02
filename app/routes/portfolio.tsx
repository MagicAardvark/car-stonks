import { useState, useEffect } from "react";
import Layout from "~/components/shared/Layout";
import OptionTrade from "~/components/Portfolio/OptionTrade";
import {
  mockCars,
  mockTrades as mockTradesData,
  portfolioStats as initialPortfolioStats,
} from "~/data";

// Add these interfaces
interface Trade {
  id: string;
  carId: string;
  type: "CALL" | "PUT";
  entryPrice: number;
  currentValue: number;
  expiryDate: string;
  percentageChange: number;
  premium: number;
  quantity?: number;
}

// Cast mockTrades to Trade[]
const mockTrades = mockTradesData as unknown as Trade[];

export default function Portfolio() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolioStats, setPortfolioStats] = useState(initialPortfolioStats);
  const carsMap = Object.fromEntries(mockCars.map((car) => [car.id, car]));

  // Load trades from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTrades = localStorage.getItem("trades");
      if (savedTrades) {
        setTrades(JSON.parse(savedTrades));
      } else {
        setTrades(mockTrades);
      }

      const savedStats = localStorage.getItem("portfolioStats");
      if (savedStats) {
        setPortfolioStats(JSON.parse(savedStats));
      }
    }
  }, []);

  // Handler for closing a position
  const handleClosePosition = (tradeId: string) => {
    const closedTrade = trades.find((trade) => trade.id === tradeId);
    if (closedTrade) {
      // Update cash balance with the current value of the closed position
      setPortfolioStats((prev) => ({
        ...prev,
        cashBalance: prev.cashBalance + closedTrade.currentValue,
        activePositions: prev.activePositions - (closedTrade.quantity || 1),
      }));

      // Update trades and save to localStorage
      const updatedTrades = trades.filter((trade) => trade.id !== tradeId);
      setTrades(updatedTrades);

      if (typeof window !== "undefined") {
        localStorage.setItem("trades", JSON.stringify(updatedTrades));
        localStorage.setItem(
          "portfolioStats",
          JSON.stringify({
            ...portfolioStats,
            cashBalance: portfolioStats.cashBalance + closedTrade.currentValue,
            activePositions:
              portfolioStats.activePositions - (closedTrade.quantity || 1),
          }),
        );
      }
    }
  };

  // Calculate portfolio stats
  const totalInvested = trades.reduce((sum, trade) => sum + trade.premium, 0);
  const totalCurrentValue = trades.reduce(
    (sum, trade) => sum + trade.currentValue,
    0,
  );
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const percentageReturn = totalInvested
    ? ((totalProfitLoss / totalInvested) * 100).toFixed(2)
    : "0.00";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Option Portfolio</h1>

        {/* Portfolio summary card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">Cash Balance</p>
              <p className="text-2xl font-bold">
                ${portfolioStats.cashBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">Active Positions</p>
              <p className="text-2xl font-bold">{trades.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">Total Invested</p>
              <p className="text-2xl font-bold">
                ${totalInvested.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">Current Value</p>
              <p className="text-2xl font-bold">
                ${totalCurrentValue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500 text-sm">Total Profit/Loss</p>
              <p
                className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {totalProfitLoss >= 0 ? "+" : ""}$
                {totalProfitLoss.toLocaleString()} ({percentageReturn}%)
              </p>
            </div>
          </div>
        </div>

        {/* Active positions */}
        <h2 className="text-xl font-semibold mb-4">Active Positions</h2>

        {trades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trades.map((trade) => {
              const car = carsMap[trade.carId];
              if (!car) return null;

              return (
                <OptionTrade
                  key={trade.id}
                  id={trade.id}
                  carName={car.name}
                  type={trade.type}
                  entryPrice={trade.entryPrice}
                  currentValue={trade.currentValue}
                  expiryDate={trade.expiryDate}
                  percentageChange={trade.percentageChange}
                  premium={trade.premium}
                  quantity={trade.quantity || 1}
                  onClose={handleClosePosition}
                  imageUrl={car.imageUrl}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              You don&apos;t have any active option positions.
            </p>
            <a
              href="/cars"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
            >
              Browse Cars to Trade
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
