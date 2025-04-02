import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Index from "~/routes/index";
import * as data from "~/data";

// Mock the data dependencies
vi.mock("~/data", () => ({
  mockCars: [
    {
      id: "1",
      name: "Test Car 1",
      brand: "TestBrand",
      model: "TestModel",
      year: 2023,
      imageUrl: "/test-car-1.jpg",
      currentPrice: 100000,
      priceHistory: [
        { date: "2023-01-01", price: 90000 },
        { date: "2023-06-01", price: 100000 },
      ],
    },
    {
      id: "2",
      name: "Test Car 2",
      brand: "AnotherBrand",
      model: "AnotherModel",
      year: 2022,
      imageUrl: "/test-car-2.jpg",
      currentPrice: 120000,
      priceHistory: [
        { date: "2023-01-01", price: 130000 },
        { date: "2023-06-01", price: 120000 },
      ],
    },
    {
      id: "3",
      name: "Test Car 3",
      brand: "ThirdBrand",
      model: "ThirdModel",
      year: 2021,
      imageUrl: "/test-car-3.jpg",
      currentPrice: 150000,
      priceHistory: [
        { date: "2023-01-01", price: 140000 },
        { date: "2023-06-01", price: 150000 },
      ],
    },
  ],
  marketTrends: [
    { name: "Test Car 1", change: 2.5, price: 100000 },
    { name: "Test Car 2", change: -1.5, price: 120000 },
  ],
  portfolioStats: {
    totalInvested: 50000,
    totalValue: 60000,
    totalProfitLoss: 10000,
    percentageReturn: "20.00",
    activePositions: 2,
    cashBalance: 40000,
  },
}));

// Mock Layout component to simplify testing
vi.mock("~/components/shared/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-mock">{children}</div>
  ),
}));

// Mock the Dashboard component
vi.mock("~/components/Home/Dashboard", () => ({
  default: (props: {
    totalInvested: number;
    totalValue: number;
    totalProfitLoss: number;
    percentageReturn: string;
    activePositions: number;
    marketTrends: Array<{ name: string; change: number; price: number }>;
  }) => (
    <div data-testid="dashboard-mock">
      <div data-testid="dashboard-props">{JSON.stringify(props)}</div>
    </div>
  ),
}));

describe("Index Route", () => {
  it("renders welcome heading and description", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>,
    );

    expect(getByText("Welcome to CarStonks")).toBeVisible();
    expect(
      getByText("Trade options on luxury cars just like the stock market"),
    ).toBeVisible();
  });

  it("renders Dashboard with correct props", () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>,
    );

    const dashboardProps = JSON.parse(
      getByTestId("dashboard-props").textContent || "{}",
    );

    // Check dashboard props match mock data
    expect(dashboardProps.totalInvested).toBe(
      data.portfolioStats.totalInvested,
    );
    expect(dashboardProps.totalValue).toBe(data.portfolioStats.totalValue);
    expect(dashboardProps.totalProfitLoss).toBe(
      data.portfolioStats.totalProfitLoss,
    );
    expect(dashboardProps.percentageReturn).toBe(
      data.portfolioStats.percentageReturn,
    );
    expect(dashboardProps.activePositions).toBe(
      data.portfolioStats.activePositions,
    );
    expect(dashboardProps.marketTrends).toEqual(data.marketTrends);
  });

  it("renders Popular Cars section with first 3 cars", () => {
    const { getByText, getAllByRole } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>,
    );

    // Check heading
    expect(getByText("Popular Cars")).toBeVisible();

    // Check "View All" link
    const viewAllLink = getByText("View All →");
    expect(viewAllLink).toBeVisible();
    expect(viewAllLink.closest("a")).toHaveAttribute("href", "/cars");

    // Check car cards - we should have 3 car links
    const carLinks = getAllByRole("link").filter((link) =>
      link.getAttribute("href")?.startsWith("/cars/"),
    );
    expect(carLinks.length).toBe(3);

    // Check first car details
    expect(getByText("Test Car 1")).toBeVisible();
    expect(getByText("TestBrand TestModel (2023)")).toBeVisible();
    expect(getByText("$100,000")).toBeVisible();

    // Check for price change percentage
    expect(getByText("+11.11%")).toBeVisible(); // Test Car 1 price change
    expect(getByText("-7.69%")).toBeVisible(); // Test Car 2 price change
  });

  it("renders How It Works section", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>,
    );

    // Check heading
    expect(getByText("How CarStonks Works")).toBeVisible();

    // Check steps
    expect(getByText("Choose a Car")).toBeVisible();
    expect(getByText("Place a Trade")).toBeVisible();
    expect(getByText("Track Your Portfolio")).toBeVisible();

    // Check step numbers
    expect(getByText("1")).toBeVisible();
    expect(getByText("2")).toBeVisible();
    expect(getByText("3")).toBeVisible();

    // Check descriptions
    expect(getByText(/Browse our selection of luxury cars/)).toBeVisible();
    expect(
      getByText(/Select CALL \(price up\) or PUT \(price down\)/),
    ).toBeVisible();
    expect(getByText(/Monitor your positions and close them/)).toBeVisible();
  });
});
