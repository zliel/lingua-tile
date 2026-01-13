import { render } from "vitest-browser-react";
import { describe, it, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import FuriganaWord from "./FuriganaWord";
import { createTheme, ThemeProvider } from "@mui/material";

describe("FuriganaWord Integration", () => {
  const theme = createTheme();

  const createWrapper =
    () =>
    ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );

  it("renders furigana correctly", async () => {
    const Wrapper = createWrapper();
    render(<FuriganaWord text="word1(ふりがな)" key="w1" />, {
      wrapper: Wrapper,
    });

    await expect.element(page.getByText("word1")).toBeVisible();
    // Hover over word1 to see furigana
    await userEvent.hover(page.getByText("word1"));
    await expect.element(page.getByText("ふりがな")).toBeVisible();
  });

  it("renders word without furigana correctly", async () => {
    const Wrapper = createWrapper();
    render(<FuriganaWord text="word2" key="w2" />, { wrapper: Wrapper });

    await expect.element(page.getByText("word2")).toBeVisible();
  });
});
