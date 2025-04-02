import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OptionTrade from "~/components/Portfolio/OptionTrade";

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
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888",
  };

  it("renders the trade details correctly", () => {
    const { getByText, getAllByText } = render(<OptionTrade {...mockProps} />);

    // Check car name
    expect(getByText("Ferrari 458")).toBeVisible();

    // Check trade type
    expect(getByText("CALL")).toBeVisible();

    // Check price information - the text is split across multiple elements
    expect(getByText("Strike Price:")).toBeVisible();
    expect(getAllByText("$220,000")[0]).toBeVisible();
  });

  it("shows profit information correctly", () => {
    const { getByText, getAllByText } = render(<OptionTrade {...mockProps} />);

    // Check financial details - text is broken up
    // These are only visible when expanded, need to first expand the trade
    const mainElement = getByText("Ferrari 458").closest("[role='button']");
    if (mainElement) userEvent.click(mainElement);

    // The financial details should now be visible in the expanded view
    expect(getAllByText("Current Value:")[0]).toBeVisible();
    expect(getAllByText("$230,000")[0]).toBeVisible();

    const profitLoss = mockProps.currentValue - mockProps.premium;
    const profitLossPercent = ((profitLoss / mockProps.premium) * 100).toFixed(
      2,
    );

    // Check profit/loss display
    expect(getByText(/\+/)).toBeVisible();
    expect(getByText(/\$50,000/)).toBeVisible();
    expect(getByText(new RegExp(`${profitLossPercent}%`))).toBeVisible();
  });

  it("shows loss information correctly", () => {
    const lossProps = {
      ...mockProps,
      currentValue: 150000, // Less than premium (180000)
    };

    const { getByText } = render(<OptionTrade {...lossProps} />);

    // Expand the trade to see more details
    const mainElement = getByText("Ferrari 458").closest("[role='button']");
    if (mainElement) userEvent.click(mainElement);

    // Check loss display - look for the specific format in the component
    expect(getByText(/\$\s*-30,000/)).toBeVisible();
    expect(getByText(/-16.67%/)).toBeVisible();
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

    // Look for the badge showing x3 instead
    expect(getByText("x3")).toBeVisible();
  });

  it("calls onClose when closing position", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const props = {
      ...mockProps,
      onClose: mockOnClose,
    };

    const { getByText, getByRole } = render(<OptionTrade {...props} />);

    // First we need to expand the trade to see the details
    const tradeCard = getByText("Ferrari 458").closest("[role='button']");
    if (tradeCard) await user.click(tradeCard);

    // Now look for the Close Position button in the expanded view
    // Since we need to first expand the component to see the button
    const closeButton = getByRole("button", { name: /close position/i });
    await user.click(closeButton);

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

    const { getByText, queryByText, getByRole } = render(
      <OptionTrade {...props} />,
    );

    // First we need to expand the trade to see the details
    const tradeCard = getByText("Ferrari 458").closest("[role='button']");
    if (tradeCard) await user.click(tradeCard);

    // Now look for the Close Position button in the expanded view
    const closeButton = getByRole("button", { name: /close position/i });
    await user.click(closeButton);

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
