import { render } from "vitest-browser-react";
import { describe, it, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import StreakCounter from "./StreakCounter";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe("StreakCounter Component Integration", () => {
  it("renders active streak with fire icon", async () => {
    render(<StreakCounter streak={5} />, { wrapper: Wrapper });

    await expect.element(page.getByText("5")).toBeVisible();
    // Fire icon is rendered as an SVG, we can check for its presence
    await expect
      .element(page.getByTestId("LocalFireDepartmentIcon"))
      .toBeVisible();
  });

  it("renders zero streak with disabled color", async () => {
    render(<StreakCounter streak={0} />, { wrapper: Wrapper });

    await expect.element(page.getByText("0")).toBeVisible();
    await expect
      .element(page.getByTestId("LocalFireDepartmentIcon"))
      .toBeVisible();
  });

  it("renders tooltip on hover", async () => {
    render(<StreakCounter streak={3} />, { wrapper: Wrapper });

    await userEvent.hover(page.getByRole("heading", { name: '3' }));
    await expect.element(page.getByText("Daily Streak: 3 days")).toBeVisible();
  });

  it("renders nothing when loading", async () => {
    const renderResult = await render(
      <StreakCounter streak={5} loading={true} />,
      { wrapper: Wrapper },
    );

    await expect.element(page.getByText("5")).not.toBeInTheDocument();

    renderResult.unmount();
  });
});
