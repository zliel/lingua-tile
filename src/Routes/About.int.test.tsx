import { render } from "vitest-browser-react";
import { describe, it, expect } from "vitest";
import { page } from "vitest/browser";
import About from "./About";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

describe("About Component Integration", () => {
  it("renders about page content", async () => {
    render(
      <ThemeProvider theme={theme}>
        <About />
      </ThemeProvider>
    );

    // Hero (this one uses exact because "LinguaTile" is used multiple times)
    await expect.element(page.getByText("LinguaTile", { exact: true })).toBeVisible();

    // Sections
    await expect.element(page.getByText("Why?")).toBeVisible();
    await expect.element(page.getByText("What’s Next?")).toBeVisible();
    await expect.element(page.getByText("Tech Stack")).toBeVisible();
    await expect.element(page.getByText("Color Scheme")).toBeVisible();
    await expect.element(page.getByText("Contact & Feedback")).toBeVisible();

    // Check specific content
    await expect.element(page.getByText("ReactJS")).toBeVisible();
    await expect.element(page.getByText("FastAPI")).toBeVisible();
  });
});

