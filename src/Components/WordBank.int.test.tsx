import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import WordBank from "./WordBank";
import { createTheme, ThemeProvider } from "@mui/material";

describe("WordBank Integration", () => {
  const theme = createTheme();

  const mockAvailableWords = [
    { id: "w1", text: "word1" },
    { id: "w2", text: "word2" },
  ];
  const mockSelectedWords = [{ id: "w3", text: "word3" }];

  const createWrapper =
    () =>
    ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );

  it("renders available and selected words", async () => {
    const Wrapper = createWrapper();
    render(
      <WordBank
        availableWords={mockAvailableWords}
        selectedWords={mockSelectedWords}
        onWordClick={vi.fn()}
        isCorrect={null}
      />,
      { wrapper: Wrapper },
    );

    await expect.element(page.getByText("word1")).toBeVisible();
    await expect.element(page.getByText("word2")).toBeVisible();
    await expect.element(page.getByText("word3")).toBeVisible();
  });

  it("calls onWordClick with true when available word is clicked", async () => {
    const onWordClick = vi.fn();
    const Wrapper = createWrapper();
    render(
      <WordBank
        availableWords={mockAvailableWords}
        selectedWords={[]}
        onWordClick={onWordClick}
        isCorrect={null}
      />,
      { wrapper: Wrapper },
    );

    await userEvent.click(page.getByText("word1"));
    expect(onWordClick).toHaveBeenCalledWith(
      expect.objectContaining({ text: "word1" }),
      true,
    );
  });

  it("calls onWordClick with false when selected word is clicked", async () => {
    const onWordClick = vi.fn();
    const Wrapper = createWrapper();
    render(
      <WordBank
        availableWords={[]}
        selectedWords={mockSelectedWords}
        onWordClick={onWordClick}
        isCorrect={null}
      />,
      { wrapper: Wrapper },
    );

    await userEvent.click(page.getByText("word3"));
    expect(onWordClick).toHaveBeenCalledWith(
      expect.objectContaining({ text: "word3" }),
      false,
    );
  });

  it("does not call onWordClick when isCorrect is set (disabled)", async () => {
    const onWordClick = vi.fn();
    const Wrapper = createWrapper();
    render(
      <WordBank
        availableWords={mockAvailableWords}
        selectedWords={[]}
        onWordClick={onWordClick}
        isCorrect={true}
      />,
      { wrapper: Wrapper },
    );

    await userEvent.click(page.getByText("word1"));
    expect(onWordClick).not.toHaveBeenCalled();
  });
});
