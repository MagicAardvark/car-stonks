import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CarDetails from "~/routes/cars.$carId";
import { mockCars, portfolioStats } from "~/data";
import type { BetData, Car } from "~/types";

// Mock the uuid generation to get predictable IDs
vi.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

// Create a mock for the toast functionality
const mockShowToast = vi.fn();

// Mock the Toast context
vi.mock("~/components/shared/ToastContext", () => {
  return {
    useToast: () => ({
      showToast: mockShowToast,
    }),
  };
});

// Mock localStorage
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

// Mock React hooks
const mockNavigate = vi.fn();
let mockCarId = "1"; // Default to first car

vi.mock("@remix-run/react", () => ({
  useParams: () => ({ carId: mockCarId }),
  useNavigate: () => mockNavigate,
}));

// Mock BetForm component
vi.mock("~/components/CarDetails/BetForm", () => ({
  default: ({ onSubmit }: { car: Car; onSubmit: (data: BetData) => void }) => (
    <div data-testid="bet-form">
      <button
        data-testid="submit-bet-button"
        onClick={() =>
          onSubmit({
            type: "CALL",
            percentageChange: 5,
            expiryMonths: 3,
            premium: 10000,
            quantity: 1,
          })
        }
      >
        Submit Bet
      </button>
    </div>
  ),
}));

describe("CarDetails Route", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockCarId = "1"; // Reset to default car

    // Set up localStorage with default portfolio stats
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "portfolioStats") {
        return JSON.stringify(portfolioStats);
      }
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state when car is not found", () => {
    // Override carId to a non-existent one
    mockCarId = "non-existent";

    render(<CarDetails />);

    expect(screen.getByText("Loading car details...")).toBeInTheDocument();
  });

  it("renders car details when car is found", () => {
    render(<CarDetails />);

    const car = mockCars[0]; // First car from mock data

    expect(screen.getByText(car.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${car.brand} ${car.model} (${car.year})`),
    ).toBeInTheDocument();

    // Use getAllByText for elements that appear multiple times
    const priceElements = screen.getAllByText(
      `$${car.currentPrice.toLocaleString()}`,
    );
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it("renders car specifications", () => {
    render(<CarDetails />);

    const car = mockCars[0];

    expect(screen.getByText("Specifications")).toBeInTheDocument();
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText(car.brand)).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText(car.model)).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText(car.year.toString())).toBeInTheDocument();
  });

  it("renders price history", () => {
    render(<CarDetails />);

    expect(screen.getByText("Price History")).toBeInTheDocument();

    // Check if at least one price history entry is shown
    const car = mockCars[0];
    if (car.priceHistory.length > 0) {
      expect(
        screen.getByText(`$${car.priceHistory[0].price.toLocaleString()}`),
      ).toBeInTheDocument();
    }
  });

  it("renders the BetForm component", () => {
    render(<CarDetails />);

    expect(screen.getByTestId("bet-form")).toBeInTheDocument();
  });

  it("handles bet submission when user has sufficient funds", async () => {
    // Mock setTimeout to call the callback immediately
    vi.spyOn(global, "setTimeout").mockImplementation((callback) => {
      if (typeof callback === "function") callback();
      return 1 as unknown as NodeJS.Timeout;
    });

    const user = userEvent.setup();
    render(<CarDetails />);

    // Click the submit button
    await user.click(screen.getByTestId("submit-bet-button"));

    // Check if showToast was called with success message
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("Successfully purchased"),
      "success",
      expect.any(Number),
    );

    // Check if navigate was called (setTimeout calls the callback immediately in our mock)
    expect(mockNavigate).toHaveBeenCalledWith("/portfolio");

    // Check if localStorage was updated with new trade
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "trades",
      expect.any(String),
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "portfolioStats",
      expect.any(String),
    );

    // Restore mocks
    vi.restoreAllMocks();
  });

  it("shows toast error when user has insufficient funds", async () => {
    // Mock setTimeout to call the callback immediately
    vi.spyOn(global, "setTimeout").mockImplementation((callback) => {
      if (typeof callback === "function") callback();
      return 1 as unknown as NodeJS.Timeout;
    });

    // Set up mock portfolio stats with insufficient funds
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "portfolioStats") {
        const insufficientFunds = { ...portfolioStats, cashBalance: 5000 }; // Less than premium
        return JSON.stringify(insufficientFunds);
      }
      return null;
    });

    const user = userEvent.setup();
    render(<CarDetails />);

    // Click the submit button
    await user.click(screen.getByTestId("submit-bet-button"));

    // Check if showToast was called with error message
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("Insufficient funds"),
      "error",
      expect.any(Number),
    );

    // Check that navigation didn't happen
    expect(mockNavigate).not.toHaveBeenCalled();

    // Restore mocks
    vi.restoreAllMocks();
  }, 10000); // Set a higher timeout to avoid timeout failures
});
