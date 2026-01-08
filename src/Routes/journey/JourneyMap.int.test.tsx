import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import JourneyMap from "./JourneyMap";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "@/Contexts/AuthContext";

const theme = createTheme();

// Mock dependencies
vi.mock("./useJourneyData", () => ({
  useJourneyData: vi.fn(() => ({
    journeyRows: [
      {
        index: 0,
        offsetY: 100,
        lessons: [{ _id: "l1", title: "Lesson 1", category: "flashcards" }],
        sectionStartTitle: "Section 1",
      },
      {
        index: 1,
        offsetY: 200,
        lessons: [{ _id: "l2", title: "Lesson 2", category: "practice" }],
      },
    ],
    extraRows: [],
    isLoading: false,
    getLessonReviewStatus: () => null,
  })),
}));

vi.mock("@/Contexts/OfflineContext", () => ({
  useOffline: () => ({ isPending: () => false }),
}));

// Mock JourneyNode to avoid complex interactions and popovers
vi.mock("./JourneyNode", () => ({
  JourneyNode: ({ lesson }: any) => (
    <div data-testid="journey-node">{lesson.title}</div>
  ),
}));

// Mock Framer Motion to render children immediately
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
      path: (props: any) => <path {...props} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("JourneyMap Component Integration", () => {
  it("renders journey nodes and sections", async () => {

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const mockAuth = {
      authData: {
        isLoggedIn: true,
        token: "mock-token",
        user: { id: "1", username: "admin" },
      },
      authIsLoading: false,
    };
    render(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={mockAuth as any}>
            <MemoryRouter>
              <JourneyMap />
            </MemoryRouter>
          </AuthContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>,
    );

    // Check for Section Title
    await expect
      .element(page.getByRole("heading", { name: "Section" }))
      .toBeVisible();

    // Check for Journey Nodes
    await expect.element(page.getByText("Lesson 1")).toBeVisible();
    await expect.element(page.getByText("Lesson 2")).toBeVisible();
  });
});
