import { useState, useEffect } from "react";
import Layout from "~/components/Layout";
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
  const [expandedTrades, setExpandedTrades] = useState<Record<string, boolean>>(
    {},
  );
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

  // Toggle expansion of a trade
  const toggleTradeExpansion = (tradeId: string) => {
    setExpandedTrades((prev) => ({
      ...prev,
      [tradeId]: !prev[tradeId],
    }));
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

              const profitLoss = trade.currentValue - trade.premium;
              const profitLossPercent = (
                (profitLoss / trade.premium) *
                100
              ).toFixed(2);
              const isExpanded = expandedTrades[trade.id];
              const strikePrice =
                trade.type === "CALL"
                  ? Math.round(
                      trade.entryPrice * (1 + trade.percentageChange / 100),
                    )
                  : Math.round(
                      trade.entryPrice * (1 - trade.percentageChange / 100),
                    );

              return (
                <div
                  key={trade.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
                >
                  {/* Main card content */}
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleTradeExpansion(trade.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleTradeExpansion(trade.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`trade-details-${trade.id}`}
                  >
                    {/* Header with type badge and expand/collapse icon */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.type === "CALL"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {trade.type}
                        </span>
                        {trade.quantity && trade.quantity > 1 && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            x{trade.quantity}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400">
                        {isExpanded ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Car Image and Info */}
                    <div className="flex p-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold">{car.name}</h3>
                        <p className="text-sm text-gray-600">
                          {car.brand} {car.model} ({car.year})
                        </p>

                        {/* Key info */}
                        <div className="mt-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expires:</span>
                            <span>
                              {new Date(trade.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Current Value:
                            </span>
                            <span className="font-medium">
                              ${trade.currentValue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">P/L:</span>
                            <span
                              className={`font-medium ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {profitLoss >= 0 ? "+" : ""}$
                              {profitLoss.toLocaleString()} ({profitLossPercent}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div
                      id={`trade-details-${trade.id}`}
                      className="p-4 bg-gray-50 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Strike Price</p>
                          <p className="font-medium">
                            ${strikePrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            ({trade.percentageChange}%{" "}
                            {trade.type === "CALL" ? "above" : "below"} entry)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Entry Price</p>
                          <p className="font-medium">
                            ${trade.entryPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Premium Paid</p>
                          <p className="font-medium">
                            ${trade.premium.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Potential Target</p>
                          <p className="font-medium">
                            {trade.type === "CALL" ? "↑" : "↓"} $
                            {Math.abs(
                              strikePrice - trade.entryPrice,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClosePosition(trade.id);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                          Close Position
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
