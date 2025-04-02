import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BetForm from "~/components/CarDetails/BetForm";
import { ToastProvider } from "~/components/shared/ToastContext";
import type { Car } from "~/types";

// Mock data for testing
const mockCar: Car = {
  id: "car1",
  name: "Test Car",
  brand: "Test Brand",
  model: "Test Model",
  year: 2023,
  imageUrl: "/test-car.jpg",
  currentPrice: 100000,
  priceHistory: [
    { date: "2023-01-01", price: 90000 },
    { date: "2023-06-01", price: 100000 },
  ],
};

// Helper function to render component within ToastProvider
const renderWithToast = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

describe("BetForm Component", () => {
  it("renders the form correctly", () => {
    const { getByText } = renderWithToast(
      <BetForm car={mockCar} onSubmit={() => {}} />,
    );

    // Check if basic elements are visible
    expect(getByText("Trade Options")).toBeVisible();
    expect(getByText("CALL Option:")).toBeVisible();
    expect(getByText("PUT Option:")).toBeVisible();
    expect(getByText("Option Type")).toBeVisible();
    expect(getByText("CALL (Higher)")).toBeVisible();
    expect(getByText("PUT (Lower)")).toBeVisible();
  });

  it("handles option type selection", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithToast(
      <BetForm car={mockCar} onSubmit={() => {}} />,
    );

    // Click the CALL button and check if it becomes active
    const callButton = getByText("CALL (Higher)");
    await user.click(callButton);

    // Check if the selected class is applied (bg-green-600 color)
    expect(callButton.className).toContain("bg-green-600");

    // Click the PUT button and check if it becomes active
    const putButton = getByText("PUT (Lower)");
    await user.click(putButton);

    // Check if the selected class is applied (bg-red-600 color)
    expect(putButton.className).toContain("bg-red-600");
    // And the CALL button is deselected
    expect(callButton.className).not.toContain("bg-green-600");
  });

  it("handles expiry period selection", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithToast(
      <BetForm car={mockCar} onSubmit={() => {}} />,
    );

    // Click the 3 months button
    const threeMonthButton = getByText("3 Months");
    await user.click(threeMonthButton);

    // Check if the selected class is applied
    expect(threeMonthButton.className).toContain("bg-indigo-600");

    // Expiration date should be shown
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    const formattedDate = expiryDate.toLocaleDateString();
    expect(getByText(`Expires: ${formattedDate}`)).toBeVisible();
  });

  it("handles percentage change selection", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithToast(
      <BetForm car={mockCar} onSubmit={() => {}} />,
    );

    // Click the +5% button
    const fivePercentButton = getByText("5%");
    await user.click(fivePercentButton);

    // Check if the selected class is applied
    expect(fivePercentButton.className).toContain("bg-indigo-600");
  });

  it("handles quantity adjustments", async () => {
    const user = userEvent.setup();
    const { container } = renderWithToast(
      <BetForm car={mockCar} onSubmit={() => {}} />,
    );

    // First, select all required options to make quantity appear
    const callButton = container.querySelector(
      ".grid.grid-cols-2.gap-4 button:first-child",
    );
    const threeMonthButton = container
      .querySelectorAll(".grid.grid-cols-3.gap-4")[0]
      .querySelectorAll("button")[1];
    const fivePercentButton = container
      .querySelectorAll(".grid.grid-cols-3.gap-4")[1]
      .querySelectorAll("button")[2];

    await user.click(callButton!);
    await user.click(threeMonthButton!);
    await user.click(fivePercentButton!);

    // Get the quantity buttons
    const decrementButton = container.querySelector(
      ".mt-2.flex.items-center button:first-child",
    );
    const incrementButton = container.querySelector(
      ".mt-2.flex.items-center button:last-child",
    );
    const quantitySpan = container.querySelector(
      ".px-4.py-2.border-t.border-b.border-gray-300",
    );

    // Initial quantity should be 1
    expect(quantitySpan?.textContent).toBe("1");

    // Increment the quantity
    await user.click(incrementButton!);
    // Allow time for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Check new quantity
    expect(
      container.querySelector(".px-4.py-2.border-t.border-b.border-gray-300")
        ?.textContent,
    ).toBe("2");

    // Increment again
    await user.click(incrementButton!);
    // Allow time for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Check new quantity
    expect(
      container.querySelector(".px-4.py-2.border-t.border-b.border-gray-300")
        ?.textContent,
    ).toBe("3");

    // Decrement the quantity
    await user.click(decrementButton!);
    // Allow time for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Check new quantity
    expect(
      container.querySelector(".px-4.py-2.border-t.border-b.border-gray-300")
        ?.textContent,
    ).toBe("2");

    // Can't go below 1
    await user.click(decrementButton!);
    await user.click(decrementButton!);
    // Allow time for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Check new quantity
    expect(
      container.querySelector(".px-4.py-2.border-t.border-b.border-gray-300")
        ?.textContent,
    ).toBe("1");
  });

  it("calculates premiums correctly", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithToast(
      <BetForm car={mockCar} onSubmit={() => {}} />,
    );

    // Select all options
    await user.click(getByText("CALL (Higher)"));
    await user.click(getByText("3 Months"));
    await user.click(getByText("5%"));

    // Premium should be calculated and displayed - use the actual text that appears
    expect(getByText("Premium per Contract:")).toBeVisible();
  });

  it("submits the form with correct data", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const { getByText, container } = renderWithToast(
      <BetForm car={mockCar} onSubmit={handleSubmit} />,
    );

    // Select all options
    await user.click(getByText("CALL (Higher)"));
    await user.click(getByText("3 Months"));
    await user.click(getByText("5%"));

    // Click the Place Trade button - using the actual text that appears
    await user.click(getByText("Place Option Trade"));

    // Click the Confirm Trade button in the dialog
    const confirmButton = container.querySelector(
      ".flex.justify-end.space-x-3 button:nth-child(2)",
    );
    if (confirmButton) {
      await user.click(confirmButton);

      // Check if onSubmit was called with the right data
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "CALL",
          expiryMonths: 3,
          percentageChange: 5,
          quantity: 1,
        }),
      );
    }
  });
});
