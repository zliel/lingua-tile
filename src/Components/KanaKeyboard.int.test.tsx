import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import KanaKeyboard from "./KanaKeyboard";
import * as wanakana from "wanakana";

// Mock wanakana
vi.mock("wanakana", () => ({
  bind: vi.fn(),
  unbind: vi.fn(),
}));

describe("KanaKeyboard Component", () => {
  const mockSetSrcText = vi.fn().mockReturnValue(vi.fn());
  const defaultProps = {
    srcText: "",
    setSrcText: mockSetSrcText,
  };

  it("renders the text field", async () => {
    render(<KanaKeyboard {...defaultProps} />);

    await expect.element(page.getByLabelText("IME Text")).toBeVisible();
  });

  it("binds wanakana on mount", async () => {
    render(<KanaKeyboard {...defaultProps} />);

    expect(wanakana.bind).toHaveBeenCalled();
  });

  it("calls setSrcText handler on input", async () => {
    // Create a handler that we can verify is called
    const handleChange = vi.fn();
    const setSrcTextWrapper = vi.fn().mockReturnValue(handleChange);

    render(<KanaKeyboard srcText="" setSrcText={setSrcTextWrapper} />);

    const input = page.getByLabelText("IME Text");
    await userEvent.type(input, "a");

    expect(setSrcTextWrapper).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalled();
  });
});

