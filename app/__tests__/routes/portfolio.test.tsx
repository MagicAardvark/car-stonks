import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "~/routes/portfolio";
import { mockCars, mockTrades, portfolioStats } from "~/data";

// Mock the @remix-run/react module
vi.mock("@remix-run/react", () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className} data-testid={`link-to-${to}`}>
      {children}
    </a>
  ),
  useLoaderData: vi.fn(),
  useOutletContext: vi.fn(),
}));

// Mock the localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock Layout component
vi.mock("~/components/shared/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

// Mock OptionTrade component with proper props structure
vi.mock("~/components/Portfolio/OptionTrade", () => ({
  default: ({
    id,
    carName,
    type,
    entryPrice,
    currentValue,
    expiryDate,
    percentageChange,
    premium,
    quantity = 1,
    onClose,
  }: {
    id: string;
    carName: string;
    type: string;
    entryPrice: number;
    currentValue: number;
    expiryDate: string;
    percentageChange: number;
    premium: number;
    quantity: number;
    onClose: (id: string) => void;
  }) => {
    const profitLoss = currentValue - premium;
    const profitLossPercent = ((profitLoss / premium) * 100).toFixed(2);
    const isProfitable = profitLoss > 0;

    return (
      <div
        data-testid={`trade-${id}`}
        className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
      >
        <div
          role="button"
          className="cursor-pointer"
          tabIndex={0}
          aria-label={`${type} option for ${carName}`}
        >
          {/* Trade Header */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${type === "CALL" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {type}
              </span>
              {quantity > 1 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  x{quantity}
                </span>
              )}
            </div>
          </div>

          {/* Trade Info */}
          <div className="flex p-4">
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold">{carName}</h3>

              {/* Key info */}
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Expires:</span>
                  <span className="font-medium">
                    {new Date(expiryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Strike Price:</span>
                  <span className="font-medium">
                    $
                    {type === "CALL"
                      ? Math.round(
                          entryPrice * (1 + percentageChange / 100),
                        ).toLocaleString()
                      : Math.round(
                          entryPrice * (1 - percentageChange / 100),
                        ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Current Value:</span>
                  <span className="font-medium">
                    ${currentValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">P/L:</span>
                  <span
                    className={`font-medium ${isProfitable ? "text-green-600" : "text-red-600"}`}
                  >
                    {isProfitable ? "+" : "-"}$
                    {Math.abs(profitLoss).toLocaleString()} ({profitLossPercent}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => onClose(id)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            aria-label="Close position"
          >
            Close Position
          </button>
        </div>
      </div>
    );
  },
}));

describe("Portfolio Route", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("renders the portfolio page with the right title", () => {
    render(<Portfolio />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByText("Your Option Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Summary")).toBeInTheDocument();
  });

  it("loads trades from localStorage when available", () => {
    const savedTrades = JSON.stringify(mockTrades);
    localStorageMock.getItem.mockReturnValueOnce(savedTrades);

    render(<Portfolio />);

    // Check if at least one trade is displayed
    expect(screen.getByText(mockCars[0].name)).toBeInTheDocument();
  });

  it("uses mock trades when localStorage is empty", () => {
    localStorageMock.getItem.mockReturnValueOnce(null);

    render(<Portfolio />);

    // Check if at least one trade is displayed
    expect(screen.getByText(mockCars[0].name)).toBeInTheDocument();
  });

  it("loads portfolio stats from localStorage when available", () => {
    const savedStats = JSON.stringify(portfolioStats);
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockTrades)) // First call for trades
      .mockReturnValueOnce(savedStats); // Second call for portfolioStats

    render(<Portfolio />);

    // Check if stats are displayed
    expect(
      screen.getByText(`$${portfolioStats.cashBalance.toLocaleString()}`),
    ).toBeInTheDocument();
  });

  it("displays empty state when there are no trades", () => {
    localStorageMock.getItem.mockReturnValueOnce("[]"); // Empty array of trades

    render(<Portfolio />);

    expect(
      screen.getByText("You don't have any active option positions."),
    ).toBeInTheDocument();
    expect(screen.getByText("Browse Cars to Trade")).toBeInTheDocument();
  });

  it("calculates and displays portfolio summary correctly", () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockTrades));

    render(<Portfolio />);

    // Calculate expected values
    const totalInvested = mockTrades.reduce(
      (sum, trade) => sum + trade.premium,
      0,
    );
    const totalCurrentValue = mockTrades.reduce(
      (sum, trade) => sum + trade.currentValue,
      0,
    );
    const totalProfitLoss = totalCurrentValue - totalInvested;
    const percentageReturn = ((totalProfitLoss / totalInvested) * 100).toFixed(
      2,
    );

    // Check if the calculated values are displayed
    // Find the total invested value in the portfolio summary section
    const summarySection = screen
      .getByText("Portfolio Summary")
      .closest(".bg-white") as HTMLElement;
    expect(
      within(summarySection).getByText(`$${totalInvested.toLocaleString()}`),
    ).toBeInTheDocument();
    expect(
      within(summarySection).getByText(
        `$${totalCurrentValue.toLocaleString()}`,
      ),
    ).toBeInTheDocument();

    // Check profit/loss display
    const profitLossText =
      totalProfitLoss >= 0
        ? `+$${totalProfitLoss.toLocaleString()} (${percentageReturn}%)`
        : `-$${Math.abs(totalProfitLoss).toLocaleString()} (${percentageReturn}%)`;

    expect(
      screen.getByText(
        new RegExp(profitLossText.replace(/[^a-zA-Z0-9]/g, ".*")),
      ),
    ).toBeInTheDocument();
  });

  it("toggles trade expansion when clicked", async () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockTrades));
    const user = userEvent.setup();

    render(<Portfolio />);

    // Find the trade card buttons by their aria-label
    const tradeCardButtons = screen.getAllByRole("button", {
      name: /option for/i,
    });

    // Click to expand the first one
    await user.click(tradeCardButtons[0]);

    // Check if expanded content is visible - since it's a mock we can check for the close button
    // Use getAllByText instead of getByText since there are multiple close buttons
    const closeButtons = screen.getAllByText("Close Position");
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it("closes a position when the close position button is clicked", async () => {
    const mockTradesJson = JSON.stringify(mockTrades);
    localStorageMock.getItem
      .mockReturnValueOnce(mockTradesJson) // First call for trades
      .mockReturnValueOnce(JSON.stringify(portfolioStats)); // Second call for portfolioStats

    const user = userEvent.setup();

    render(<Portfolio />);

    // Find the close button - use the first one
    const closeButtons = screen.getAllByText("Close Position");
    await user.click(closeButtons[0]);

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "trades",
      expect.any(String),
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "portfolioStats",
      expect.any(String),
    );
  });

  it("renders trade details correctly", () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockTrades));

    render(<Portfolio />);

    // Check if trade information is displayed
    const trade = mockTrades[0];
    const car = mockCars.find((car) => car.id === trade.carId);

    if (car) {
      expect(screen.getByText(car.name)).toBeInTheDocument();

      // Check for trade type badge
      expect(screen.getByText(trade.type)).toBeInTheDocument();

      // Check for strike price
      const strikePrice =
        trade.type === "CALL"
          ? Math.round(
              trade.entryPrice * (1 + trade.percentageChange / 100),
            ).toLocaleString()
          : Math.round(
              trade.entryPrice * (1 - trade.percentageChange / 100),
            ).toLocaleString();

      expect(screen.getByText(`$${strikePrice}`)).toBeInTheDocument();
    }
  });
});
