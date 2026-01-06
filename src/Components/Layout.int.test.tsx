import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
// Mock child components to avoid complex dependencies
vi.mock("./NavBar", () => ({
  default: () => <div data-testid="mock-navbar">NavBar</div>,
}));
vi.mock("./TileBackground", () => ({
  default: () => <div data-testid="mock-background">TileBackground</div>,
}));
vi.mock("./PWAInstallPrompt", () => ({
  default: () => <div data-testid="mock-pwa-prompt">PWAPrompt</div>,
}));
vi.mock("react-ios-pwa-prompt", () => ({
  default: () => <div data-testid="mock-ios-prompt">IOSPrompt</div>,
}));
// Mock hooks
vi.mock("@/hooks/useAppBadge", () => ({
  useAppBadge: vi.fn(),
}));

describe("Layout Component", () => {
  it("renders the layout structure with navbar and background", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-background")).toBeInTheDocument();
    expect(screen.getByTestId("mock-pwa-prompt")).toBeInTheDocument();
  });
  it("renders the outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/test"]}>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/test"
              element={<div data-testid="test-content">Page Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });
});
