import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import Flashcard from "./Flashcard";

describe("Flashcard Component Integration", () => {
  const defaultProps = {
    frontText: "こんにちは",
    backText: "Hello",
    onNextCard: vi.fn(),
    onPreviousCard: vi.fn(),
  };

  it("flips when clicked", async () => {
    render(<Flashcard {...defaultProps} />);

    await expect.element(page.getByText("こんにちは")).toBeVisible();

    await userEvent.click(page.getByText("こんにちは"));

    await expect.element(page.getByText("Hello")).toBeVisible();
  });
});
