import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Cars from "~/routes/cars";
import { mockCars } from "~/data/cars";
import type { Car } from "~/types";

// Create a location value that can be changed between tests
let mockLocation = { pathname: "/cars" };

// Mock dependencies
vi.mock("@remix-run/react", () => ({
  useLocation: () => mockLocation,
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
  useLoaderData: vi.fn(() => ({ cars: mockCars })),
  useOutletContext: vi.fn(),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

vi.mock("~/components/shared/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("~/components/CarGrid", () => ({
  default: ({ cars }: { cars: Car[]; showFilters: boolean }) => (
    <div data-testid="car-grid">
      {cars.map((car) => (
        <div key={car.id} data-testid={`car-${car.id}`}>
          {car.name}
        </div>
      ))}
    </div>
  ),
}));

describe("Cars Route", () => {
  beforeEach(() => {
    // Reset to default value before each test
    mockLocation = { pathname: "/cars" };
  });

  it("renders the cars page with correct title and description", () => {
    render(<Cars />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByText("Car Markets")).toBeInTheDocument();
    expect(
      screen.getByText("Browse all available cars and place option trades"),
    ).toBeInTheDocument();
  });

  it("renders the CarGrid component with mockCars data", () => {
    render(<Cars />);

    expect(screen.getByTestId("car-grid")).toBeInTheDocument();
    mockCars.forEach((car) => {
      expect(screen.getByText(car.name)).toBeInTheDocument();
    });
  });

  it("renders the CarGrid with showFilters=true", () => {
    render(<Cars />);
    expect(screen.getByTestId("car-grid")).toBeInTheDocument();
  });

  it("renders the Outlet component when not on root cars route", () => {
    // Change the pathname for this test
    mockLocation = { pathname: "/cars/123" };

    render(<Cars />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.queryByText("Car Markets")).not.toBeInTheDocument();
  });
});
