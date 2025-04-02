import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OptionTrade from "~/components/OptionTrade";

describe("OptionTrade Component", () => {
  const mockProps = {
    id: "trade1",
    carName: "Ferrari 458",
    type: "CALL" as const,
    entryPrice: 200000,
    currentValue: 230000,
    expiryDate: "2025-06-15",
    percentageChange: 10,
    premium: 180000,
    quantity: 1,
    onClose: vi.fn(),
  };

  it("renders the trade details correctly", () => {
    const { getByText } = render(<OptionTrade {...mockProps} />);

    // Check car name
    expect(getByText("Ferrari 458")).toBeVisible();

    // Check trade type
    expect(getByText("CALL")).toBeVisible();

    // Check price information
    expect(getByText("Strike Price: $220,000")).toBeVisible();
    expect(getByText("Entry Price: $200,000")).toBeVisible();

    // Check expiry date - actual format might vary based on timezone when test runs
    expect(getByText(/Jun \d+, 2025/)).toBeVisible();
  });

  it("shows profit information correctly", () => {
    const { getByText } = render(<OptionTrade {...mockProps} />);

    // Check financial details
    expect(getByText("Premium Paid:")).toBeVisible();
    expect(getByText("$180,000")).toBeVisible();
    expect(getByText("Current Value:")).toBeVisible();
    expect(getByText("$230,000")).toBeVisible();

    const profitLoss = mockProps.currentValue - mockProps.premium;
    const profitLossPercent = ((profitLoss / mockProps.premium) * 100).toFixed(
      2,
    );

    // Check profit/loss display
    expect(getByText(/\+50,000/)).toBeVisible();
    expect(getByText(new RegExp(`\\(${profitLossPercent}%\\)`))).toBeVisible();
  });

  it("shows loss information correctly", () => {
    const lossProps = {
      ...mockProps,
      currentValue: 150000, // Less than premium (180000)
    };

    const { getByText } = render(<OptionTrade {...lossProps} />);

    const profitLoss = lossProps.currentValue - lossProps.premium;
    const profitLossPercent = ((profitLoss / lossProps.premium) * 100).toFixed(
      2,
    );

    // Check loss display
    expect(getByText(/-30,000/)).toBeVisible();
    expect(getByText(new RegExp(`\\(${profitLossPercent}%\\)`))).toBeVisible();
  });

  it("applies correct styling for CALL vs PUT options", () => {
    // Test CALL option (already in mockProps)
    const { getByText, rerender } = render(<OptionTrade {...mockProps} />);

    // CALL should have green styling
    const callBadge = getByText("CALL");
    expect(callBadge.className).toContain("bg-green-100");
    expect(callBadge.className).toContain("text-green-800");

    // Test PUT option
    const putProps = {
      ...mockProps,
      type: "PUT" as const,
    };

    rerender(<OptionTrade {...putProps} />);

    // PUT should have red styling
    const putBadge = getByText("PUT");
    expect(putBadge.className).toContain("bg-red-100");
    expect(putBadge.className).toContain("text-red-800");
  });

  it("shows quantity when more than 1", () => {
    const multiQuantityProps = {
      ...mockProps,
      quantity: 3,
    };

    const { getByText } = render(<OptionTrade {...multiQuantityProps} />);

    expect(getByText("Quantity: 3 contracts")).toBeVisible();
  });

  it("calls onClose when closing position", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const props = {
      ...mockProps,
      onClose: mockOnClose,
    };

    const { getByText } = render(<OptionTrade {...props} />);

    // Click close position
    await user.click(getByText("Close Position"));

    // Confirmation dialog should appear
    expect(getByText("Confirm Position Close")).toBeVisible();
    expect(
      getByText(
        /Are you sure you want to close your CALL position on Ferrari 458/,
      ),
    ).toBeVisible();

    // Click "Close Position" in the confirmation dialog
    await user.click(getByText("Close Position", { selector: ".bg-red-600" }));

    // Check if onClose was called with the correct id
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith("trade1");
  });

  it("can cancel closing position", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const props = {
      ...mockProps,
      onClose: mockOnClose,
    };

    const { getByText, queryByText } = render(<OptionTrade {...props} />);

    // Click close position
    await user.click(getByText("Close Position"));

    // Confirmation dialog should appear
    expect(getByText("Confirm Position Close")).toBeVisible();

    // Click Cancel in the confirmation dialog
    await user.click(getByText("Cancel"));

    // Confirmation dialog should disappear
    expect(queryByText("Confirm Position Close")).not.toBeInTheDocument();

    // onClose should not have been called
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
