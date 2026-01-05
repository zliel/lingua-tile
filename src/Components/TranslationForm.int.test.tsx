import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import TranslationForm from "./TranslationForm";
import axios from "axios";
// Mock axios
vi.mock("axios");
describe("TranslationForm Component", () => {
  it("renders source and target text fields", async () => {
    render(<TranslationForm />);
    // Check for source text field
    await expect.element(page.getByLabelText("Source Text")).toBeVisible();
    await expect.element(page.getByLabelText("Translated Text")).toBeVisible();
  });
  it("updates source text and triggers translation", async () => {
    // Setup mock response
    (axios.get as any).mockResolvedValue({
      data: { translatedText: "テスト" }
    });
    render(<TranslationForm />);

    const srcInput = page.getByLabelText("Source Text");
    await userEvent.clear(srcInput);
    await userEvent.type(srcInput, "World");

    await expect.element(srcInput).toHaveValue("World");

    await expect.element(page.getByLabelText("Translated Text")).toHaveValue("テスト");
  });
});
