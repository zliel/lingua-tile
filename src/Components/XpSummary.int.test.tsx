import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { XpSummary } from "./XpSummary";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

// Mock LevelProgressBar as it might have its own logic
vi.mock("./charts/LevelProgressBar", () => ({
  default: () => <div data-testid="level-progress-bar">Progress Bar</div>
}));

describe("XpSummary Component Integration", () => {
  const defaultProps = {
    summaryData: {
      xp_gained: 20,
      new_xp: 1500,
      new_level: 5,
      leveled_up: false
    },
    handleContinue: vi.fn()
  };

  it("displays XP gained", async () => {
    render(<XpSummary {...defaultProps} />, { wrapper: Wrapper });

    await expect.element(page.getByText("Lesson Complete!")).toBeVisible();
    await expect.element(page.getByText("+")).toBeVisible();
    await expect.element(page.getByText("20")).toBeVisible();
  });

  it("displays level up message", async () => {
    const props = {
      ...defaultProps,
      summaryData: {
        ...defaultProps.summaryData,
        leveled_up: true,
        new_level: 6
      }
    };
    render(<XpSummary {...props} />, { wrapper: Wrapper });

    await expect.element(page.getByText("Level Up!")).toBeVisible();
    await expect.element(page.getByText("You reached Level 6!")).toBeVisible();
  });

  it("calls handleContinue on button click", async () => {
    const onContinue = vi.fn();
    render(<XpSummary {...defaultProps} handleContinue={onContinue} />, { wrapper: Wrapper });

    await userEvent.click(page.getByRole("button", { name: /Continue/i }));
    expect(onContinue).toHaveBeenCalled();
  });
});
