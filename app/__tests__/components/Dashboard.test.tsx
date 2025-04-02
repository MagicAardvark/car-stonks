import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Dashboard from "~/components/Home/Dashboard";

// Mock data for testing
const mockDashboardProps = {
  totalInvested: 150000,
  totalValue: 175000,
  totalProfitLoss: 25000,
  percentageReturn: "16.67",
  activePositions: 5,
  marketTrends: [
    { name: "Ferrari 458", change: 2.5, price: 200000 },
    { name: "Lamborghini Huracan", change: 1.8, price: 250000 },
    { name: "Porsche 911", change: -0.5, price: 120000 },
  ],
};

describe("Dashboard Component", () => {
  it("renders the dashboard with correct portfolio data", () => {
    const { getByText } = render(<Dashboard {...mockDashboardProps} />);

    // Check if portfolio summary title is visible
    expect(getByText("Portfolio Summary")).toBeVisible();

    // Check if portfolio data is shown correctly
    expect(getByText("Total Invested")).toBeVisible();
    expect(getByText("$150,000")).toBeVisible();

    expect(getByText("Current Value")).toBeVisible();
    expect(getByText("$175,000")).toBeVisible();

    expect(getByText("Total Profit/Loss")).toBeVisible();
    expect(getByText(/\+\$25,000/)).toBeVisible();
    expect(getByText(/\(16.67%\)/)).toBeVisible();

    expect(getByText("Active Positions")).toBeVisible();
    expect(getByText("5")).toBeVisible();
  });

  it("renders market trends with correct data", () => {
    const { getByText } = render(<Dashboard {...mockDashboardProps} />);

    // Check if market trends title is visible
    expect(getByText("Market Trends")).toBeVisible();

    // Check table headers
    expect(getByText("Car")).toBeVisible();
    expect(getByText("Price")).toBeVisible();
    expect(getByText("24h Change")).toBeVisible();

    // Check if all car entries are in the table
    expect(getByText("Ferrari 458")).toBeVisible();
    expect(getByText("Lamborghini Huracan")).toBeVisible();
    expect(getByText("Porsche 911")).toBeVisible();

    // Check if prices are displayed correctly
    expect(getByText("$200,000")).toBeVisible();
    expect(getByText("$250,000")).toBeVisible();
    expect(getByText("$120,000")).toBeVisible();

    // Check if percentage changes are displayed correctly
    expect(getByText("+2.50%")).toBeVisible();
    expect(getByText("+1.80%")).toBeVisible();
    expect(getByText("-0.50%")).toBeVisible();

    // Check for the "View All Markets" link
    expect(getByText("View All Markets →")).toBeVisible();
  });

  it("uses correct text colors for profit/loss values", () => {
    const { getByText } = render(<Dashboard {...mockDashboardProps} />);

    // Positive values should have green text
    const profitLossText = getByText(/\+\$25,000/);
    expect(profitLossText.classList.contains("text-green-600")).toBe(true);

    // Positive change should have green text
    const positiveChange = getByText("+2.50%");
    expect(positiveChange.classList.contains("text-green-600")).toBe(true);

    // Negative change should have red text
    const negativeChange = getByText("-0.50%");
    expect(negativeChange.classList.contains("text-red-600")).toBe(true);
  });

  it("renders with negative profit/loss correctly", () => {
    const negativeProps = {
      ...mockDashboardProps,
      totalValue: 130000,
      totalProfitLoss: -20000,
      percentageReturn: "-13.33",
    };

    const { container } = render(<Dashboard {...negativeProps} />);

    // Find the element with the negative profit/loss text
    // Check the container for profit/loss element which is the third flex item in the portfolio summary
    const profitLossElement = container.querySelectorAll(
      ".flex.justify-between.items-center.p-4.bg-gray-50.rounded-md",
    )[2];
    const profitLossValueElement =
      profitLossElement.querySelector(".font-bold");

    // Check if it has the red color class
    expect(profitLossValueElement).toBeVisible();
    expect(profitLossValueElement?.classList.contains("text-red-600")).toBe(
      true,
    );

    // Check the text content contains our negative value
    expect(profitLossValueElement?.textContent).toContain("-20,000");
  });
});
