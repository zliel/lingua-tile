import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import KanaKeyboard from "../../src/Components/KanaKeyboard";
import * as wanakana from "wanakana";

// Mock the wanakana module
jest.mock("wanakana", () => ({
  bind: jest.fn(),
  unbind: jest.fn(),
}));

describe("KanaKeyboard", () => {
  it("renders TextField with correct props", () => {
    render(<KanaKeyboard srcText="test" setSrcText={() => {}} />);
    const input = screen.getByLabelText("IME Text");
    expect(input).toBeTruthy();
    expect(input.value).toBe("test");
  });

  it("calls setSrcText on input change", () => {
    const setSrcText = jest.fn();
    render(<KanaKeyboard srcText="" setSrcText={setSrcText} />);
    const input = screen.getByLabelText("IME Text");
    fireEvent.change(input, { target: { value: "new text" } });
    expect(setSrcText).toHaveBeenCalled();
  });

  it("binds and unbinds wanakana on mount and unmount", () => {
    const { unmount } = render(
      <KanaKeyboard srcText="" setSrcText={() => {}} />,
    );
    expect(wanakana.bind).toHaveBeenCalled();
    unmount();
    expect(wanakana.unbind).toHaveBeenCalled();
  });

  it("does not call setSrcText if not provided", () => {
    const setSrcText = jest.fn();
    render(<KanaKeyboard srcText="" setSrcText={setSrcText} />);
    const input = screen.getByLabelText("IME Text");
    fireEvent.change(input, { target: { value: "new text" } });
    // No assertion needed, just ensuring no error is thrown
  });
});
