import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import TranslationQuestion from "./TranslationQuestion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { SnackbarContext } from "@/Contexts/SnackbarContext";

const createWrapper = (mockShowSnackbar: any) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SnackbarContext.Provider
        value={{ showSnackbar: mockShowSnackbar } as any}
      >
        <MemoryRouter>{children}</MemoryRouter>
      </SnackbarContext.Provider>
    </QueryClientProvider>
  );
};

describe("TranslationQuestion Component Integration", () => {
  const defaultProps = {
    sentence: {
      full_sentence: "これはテストの文です。",
      possible_answers: ["This is a test sentence."],
      words: ["This", "is", "a", "test", "sentence"],
    },
    allSentences: [],
    onNext: vi.fn(),
  };

  it("handles keyboard input validation", async () => {
    const mockShowSnackbar = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar);

    render(<TranslationQuestion {...defaultProps} />, { wrapper: Wrapper });

    // Switch to keyboard mode first
    const switchButton = page.getByText(/Switch to Keyboard/i);
    await userEvent.click(switchButton);

    const input = page.getByRole("textbox");

    await userEvent.type(input, "This is a test sentence");

    const checkButton = page.getByRole("button", { name: /check/i });
    await userEvent.click(checkButton);

    // Check for success feedback via polling
    await expect
      .poll(() => mockShowSnackbar.mock.calls.length)
      .toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith("Correct!", "success", 500);
  });

  it("handles word bank interactions", async () => {
    const mockShowSnackbar = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar);

    render(<TranslationQuestion {...defaultProps} />, { wrapper: Wrapper });

    await userEvent.click(page.getByText("This").nth(2));
    await userEvent.click(page.getByText("is", { exact: true }));
    await userEvent.click(page.getByText("a", { exact: true }));
    await userEvent.click(page.getByText("test", { exact: true }));
    await userEvent.click(page.getByText("sentence", { exact: true }));

    const checkButton = page.getByRole("button", { name: /check/i });
    await userEvent.click(checkButton);

    await expect
      .poll(() => mockShowSnackbar.mock.calls.length)
      .toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith("Correct!", "success", 500);
  });

  it("shows error on incorrect answer", async () => {
    const mockShowSnackbar = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar);

    render(<TranslationQuestion {...defaultProps} />, { wrapper: Wrapper });

    const switchButton = page.getByText(/Switch to Keyboard/i);
    await userEvent.click(switchButton);

    const input = page.getByRole("textbox");
    await userEvent.type(input, "Wrong Answer");

    const checkButton = page.getByRole("button", { name: /check/i });
    await userEvent.click(checkButton);

    await expect
      .poll(() => mockShowSnackbar.mock.calls.length)
      .toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith("Incorrect", "error");
  });
});
