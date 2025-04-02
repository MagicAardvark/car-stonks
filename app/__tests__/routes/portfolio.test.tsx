import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "~/routes/portfolio";
import { mockCars, mockTrades, portfolioStats } from "~/data";

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

// Mock navigate
vi.mock("@remix-run/react", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock Layout component
vi.mock("~/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
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

    // Use more specific selectors based on the output from TestingLibrary
    const tradeCards = screen.getAllByRole("button", {
      name: /(?:CALL|PUT).+(?:Porsche|Ferrari|Lamborghini)/i,
    });

    // Click to expand the first one
    await user.click(tradeCards[0]);

    // Check if expanded content is visible
    expect(screen.getByText("Strike Price")).toBeInTheDocument();
    expect(screen.getByText("Entry Price")).toBeInTheDocument();
    expect(screen.getByText("Premium Paid")).toBeInTheDocument();
    expect(screen.getByText("Potential Target")).toBeInTheDocument();
  });

  it("closes a position when the close position button is clicked", async () => {
    const mockTradesJson = JSON.stringify(mockTrades);
    localStorageMock.getItem
      .mockReturnValueOnce(mockTradesJson) // First call for trades
      .mockReturnValueOnce(JSON.stringify(portfolioStats)); // Second call for portfolioStats

    const user = userEvent.setup();

    render(<Portfolio />);

    // Use more specific selectors based on the output from TestingLibrary
    const tradeCards = screen.getAllByRole("button", {
      name: /(?:CALL|PUT).+(?:Porsche|Ferrari|Lamborghini)/i,
    });
    await user.click(tradeCards[0]);

    // Find and click the close position button
    const closeButton = screen.getByText("Close Position");
    await user.click(closeButton);

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
      const badgeText = trade.type;
      expect(screen.getByText(badgeText)).toBeInTheDocument();

      // Check for financial details - use getAllByText since there might be multiple occurrences
      const currentValueElements = screen.getAllByText(
        `$${trade.currentValue.toLocaleString()}`,
      );
      expect(currentValueElements.length).toBeGreaterThan(0);

      // Calculate profit/loss
      const profitLoss = trade.currentValue - trade.premium;

      // Use a more flexible regex pattern to match profit/loss text
      const profitLossRegex = new RegExp(
        `[+-]?\\$${Math.abs(profitLoss).toLocaleString().replace(/,/g, "[,.]?")}`,
      );
      const profitLossElements = screen.getAllByText(profitLossRegex);
      expect(profitLossElements.length).toBeGreaterThan(0);
    }
  });
});
