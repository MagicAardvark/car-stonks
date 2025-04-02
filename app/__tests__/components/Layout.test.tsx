import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Layout from "~/components/shared/Layout";

// Helper to render with router
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Layout Component", () => {
  it("renders the navigation bar", () => {
    const { getByText } = renderWithRouter(
      <Layout>
        <div data-testid="test-content">Content</div>
      </Layout>,
    );

    // Check if logo is visible
    expect(getByText("CarStonks")).toBeVisible();

    // Check if navigation links are visible
    expect(getByText("Home")).toBeVisible();
    expect(getByText("Cars")).toBeVisible();
    expect(getByText("Portfolio")).toBeVisible();

    // Check if connect wallet button is visible
    expect(getByText("Connect Wallet")).toBeVisible();
  });

  it("renders the footer with copyright info", () => {
    const { getByText } = renderWithRouter(
      <Layout>
        <div data-testid="test-content">Content</div>
      </Layout>,
    );

    // Check if footer is visible with current year
    const currentYear = new Date().getFullYear();
    expect(
      getByText(`© ${currentYear} CarStonks. All rights reserved.`),
    ).toBeVisible();
  });

  it("renders children content", () => {
    const { getByTestId } = renderWithRouter(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>,
    );

    // Check if children content is rendered
    expect(getByTestId("test-content")).toBeVisible();
    expect(getByTestId("test-content").textContent).toBe("Test Content");
  });

  it("has correct navigation links", () => {
    const { getByText } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    // Check if links point to the correct routes
    const homeLink = getByText("Home").closest("a");
    const carsLink = getByText("Cars").closest("a");
    const portfolioLink = getByText("Portfolio").closest("a");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(carsLink).toHaveAttribute("href", "/cars");
    expect(portfolioLink).toHaveAttribute("href", "/portfolio");
  });
});
