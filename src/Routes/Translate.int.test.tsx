import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import Translate from "./Translate";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AuthContext from "../Contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

const theme = createTheme();

// Mock axios since TranslationForm uses it
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    isAxiosError: () => false,
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  // Auth context needed if any component checks auth (not TranslationForm, but good practice)
  const mockAuth = {
    authData: { isLoggedIn: false },
    authIsLoading: false,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>{children}</MemoryRouter>
        </ThemeProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("Translate Component Integration", () => {
  it("renders translation form content", async () => {
    const Wrapper = createWrapper();
    render(<Translate />, { wrapper: Wrapper });

    // Check for content from TranslationForm
    (axios.get as any).mockResolvedValue({ data: {} });
    await expect.element(page.getByText("Translate Text")).toBeVisible();
    await expect
      .element(
        page.getByText(
          "Enter text below to translate between English and Japanese.",
        ),
      )
      .toBeVisible();
  });
});
