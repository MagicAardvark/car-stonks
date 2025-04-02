import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import * as testingLibrary from "@testing-library/react";
import CarGrid from "~/components/Cars/CarGrid";
import { BrowserRouter } from "react-router-dom";

// Extract screen and fireEvent from testingLibrary
const { screen, fireEvent } = testingLibrary;

// Test data for the CarGrid component
const mockCars = [
  {
    id: "1",
    name: "Test Car 1",
    brand: "TestBrand",
    model: "TestModel",
    year: 2023,
    imageUrl: "/test-car-1.jpg",
    currentPrice: 50000,
    priceHistory: [
      { date: "2023-01-01", price: 45000 },
      { date: "2023-07-01", price: 50000 },
    ],
  },
  {
    id: "2",
    name: "Test Car 2",
    brand: "AnotherBrand",
    model: "AnotherModel",
    year: 2022,
    imageUrl: "/test-car-2.jpg",
    currentPrice: 40000,
    priceHistory: [
      { date: "2023-01-01", price: 42000 },
      { date: "2023-07-01", price: 40000 },
    ],
  },
];

// Wrap component with BrowserRouter for Link components
const renderCarGrid = (props: {
  cars: typeof mockCars;
  showFilters?: boolean;
}) => {
  return render(
    <BrowserRouter>
      <CarGrid {...props} />
    </BrowserRouter>,
  );
};

describe("CarGrid Component", () => {
  beforeEach(() => {
    // Clear any previous renders between tests
    vi.clearAllMocks();
  });

  it("renders cars correctly", () => {
    renderCarGrid({ cars: mockCars });

    // Check if car names are visible in the document
    expect(screen.getByText("Test Car 1")).toBeVisible();
    expect(screen.getByText("Test Car 2")).toBeVisible();

    // Check brand and model info
    expect(screen.getByText("TestBrand TestModel (2023)")).toBeVisible();
    expect(screen.getByText("AnotherBrand AnotherModel (2022)")).toBeVisible();

    // Check prices
    expect(screen.getByText("$50,000")).toBeVisible();
    expect(screen.getByText("$40,000")).toBeVisible();
  });

  it("does not display filters when showFilters is false", () => {
    renderCarGrid({ cars: mockCars, showFilters: false });

    // Sort by selector should not be visible
    expect(screen.queryByText("Sort by:")).not.toBeInTheDocument();
    expect(screen.queryByText("Brand:")).not.toBeInTheDocument();
    expect(screen.queryByText("Year:")).not.toBeInTheDocument();
  });

  it("displays filters when showFilters is true", () => {
    renderCarGrid({ cars: mockCars, showFilters: true });

    // Filters should be visible
    expect(screen.getByText("Sort by:")).toBeVisible();
    expect(screen.getByText("Brand:")).toBeVisible();
    expect(screen.getByText("Year:")).toBeVisible();

    // Filter options should be available
    expect(screen.getByText("All Brands")).toBeVisible();
    expect(screen.getByText("All Years")).toBeVisible();
  });

  it("filters cars by brand when selected", () => {
    const { container } = renderCarGrid({ cars: mockCars, showFilters: true });

    // Both cars should be visible initially
    expect(screen.getByText("Test Car 1")).toBeVisible();
    expect(screen.getByText("Test Car 2")).toBeVisible();

    // Select TestBrand filter (select the second select element which corresponds to Brand)
    const brandSelect = container.querySelectorAll("select")[1];
    fireEvent.change(brandSelect, { target: { value: "testbrand" } });

    // Only TestBrand car should be in the count
    expect(screen.getByText("Showing 1 car in testbrand")).toBeVisible();
  });

  it("sorts cars by price ascending when selected", () => {
    const { container } = renderCarGrid({ cars: mockCars, showFilters: true });

    // Select Price (Low to High)
    const sortSelect = container.querySelectorAll("select")[0];
    fireEvent.change(sortSelect, { target: { value: "price-asc" } });

    // Verify that the lower price car appears first in the DOM
    const prices = screen.getAllByText(/\$\d{1,3},\d{3}/i);
    expect(prices[0].textContent).toBe("$40,000");
    expect(prices[1].textContent).toBe("$50,000");
  });

  it("changes view type when view buttons are clicked", () => {
    const { container } = renderCarGrid({ cars: mockCars, showFilters: true });

    // Default should be grid view
    const gridContainer = document.querySelector(".grid");
    expect(gridContainer).toBeVisible();

    // Click list view button - get the second button in the view section
    const listViewButton = container.querySelectorAll(
      ".flex.space-x-2 button",
    )[1];
    fireEvent.click(listViewButton);

    // Should not be grid anymore, should be list (space-y-4)
    const listContainer = document.querySelector(".space-y-4");
    expect(listContainer).toBeVisible();
    expect(document.querySelector(".grid")).not.toBeInTheDocument();
  });

  it("shows correct count of filtered cars", () => {
    const { container } = renderCarGrid({ cars: mockCars, showFilters: true });

    // Initially shows all cars
    expect(screen.getByText("Showing 2 cars")).toBeVisible();

    // Filter by year
    const yearSelect = container.querySelectorAll("select")[2];
    fireEvent.change(yearSelect, { target: { value: "2023" } });

    // Shows only 2023 cars
    expect(screen.getByText("Showing 1 car from 2023")).toBeVisible();
  });

  it("clears filters when clear filters button is clicked", () => {
    const { container } = renderCarGrid({ cars: mockCars, showFilters: true });

    // Apply a filter
    const brandSelect = container.querySelectorAll("select")[1];
    fireEvent.change(brandSelect, { target: { value: "testbrand" } });

    // Clear filters button should appear
    const clearButton = screen.getByText("Clear Filters");
    expect(clearButton).toBeVisible();

    // Click clear filters
    fireEvent.click(clearButton);

    // Should show all cars again
    expect(screen.getByText("Showing 2 cars")).toBeVisible();
    // Clear button should be gone
    expect(screen.queryByText("Clear Filters")).not.toBeInTheDocument();
  });
});
