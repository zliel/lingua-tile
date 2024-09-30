import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmationDialog from "../src/Components/ConfirmationDialog";

describe("ConfirmationDialog", () => {
  it("renders with title and message", () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Test Title"
        message="Test Message"
      />,
    );
    expect(screen.getByText("Test Title")).toBeTruthy();
    expect(screen.getByText("Test Message")).toBeTruthy();
  });

  it("calls onClose when Cancel button is clicked", () => {
    const onClose = jest.fn();
    render(
      <ConfirmationDialog
        open={true}
        onClose={onClose}
        onConfirm={() => {}}
        title="Test Title"
        message="Test Message"
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Confirm button is clicked", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Test Title"
        message="Test Message"
      />,
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not render when open is false", () => {
    render(
      <ConfirmationDialog
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Test Title"
        message="Test Message"
      />,
    );
    expect(screen.queryByText("Test Title")).toBeFalsy();
    expect(screen.queryByText("Test Message")).toBeFalsy();
  });
});
