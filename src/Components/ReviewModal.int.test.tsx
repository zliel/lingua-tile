import { render } from "vitest-browser-react";
import useLessonReview from "@/hooks/useLessonReview";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import ReviewModal from "./ReviewModal";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import confetti from "canvas-confetti";
import { theme } from "@/theme";

// Mock dependencies
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useLessonReview", () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ReviewModal Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = () => ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <MemoryRouter>{children}</MemoryRouter>
    </ThemeProvider>
  );

  it("renders rating options when open", async () => {
    (useLessonReview as any).mockReturnValue({
      handlePerformanceReview: vi.fn(),
    });

    const Wrapper = createWrapper();
    render(<ReviewModal open={true} setOpen={vi.fn()} lessonId="lesson123" />, { wrapper: Wrapper });

    await expect.element(page.getByText("Lesson Complete!")).toBeVisible();
    await expect.element(page.getByText("How would you rate your performance?")).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Again" })).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Hard" })).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Good" })).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Easy" })).toBeVisible();
  });

  it("calls handlePerformanceReview when a rating is selected", async () => {
    const mockHandlePerformanceReview = vi.fn();
    (useLessonReview as any).mockReturnValue({
      handlePerformanceReview: mockHandlePerformanceReview,
    });

    const Wrapper = createWrapper();
    render(<ReviewModal open={true} setOpen={vi.fn()} lessonId="lesson123" />, { wrapper: Wrapper });

    // Click "Easy" (value 4)
    await userEvent.click(page.getByRole("button", { name: "Easy" }));

    expect(mockHandlePerformanceReview).toHaveBeenCalledWith(4);
  });

  it("shows loading state when triggered via hook/state interaction", async () => {
    let capturedSetLoading: (loading: boolean) => void = () => { };

    (useLessonReview as any).mockImplementation((_id: string, _setOpen: any, setLoading: any) => {
      capturedSetLoading = setLoading;
      return { handlePerformanceReview: vi.fn() };
    });

    const Wrapper = createWrapper();
    render(<ReviewModal open={true} setOpen={vi.fn()} lessonId="lesson123" />, { wrapper: Wrapper });

    // Simulate looading start (e.g. hook does this when mutation starts)
    await vi.waitUntil(() => capturedSetLoading !== undefined);

    capturedSetLoading(true);

    await expect.element(page.getByRole("progressbar")).toBeVisible();
  });

  it("transitions to XpSummary and Confetti when review completes", async () => {
    (useLessonReview as any).mockImplementation((_id: string, _setOpen: any, _setLoading: any, onComplete: any) => {
      return {
        handlePerformanceReview: () => {
          // Simulate completion immediately
          onComplete({ leveled_up: true, xp_gained: 100, new_level: 5, new_xp: 50 });
        }
      };
    });

    const setOpen = vi.fn();
    const Wrapper = createWrapper();
    render(<ReviewModal open={true} setOpen={setOpen} lessonId="lesson123" />, { wrapper: Wrapper });

    // Click "Good"
    await userEvent.click(page.getByRole("button", { name: "Good" }));

    // Now XpSummary should be visible (using real component content)
    await expect.element(page.getByText("Level Up!")).toBeVisible();
    await expect.element(page.getByText("+100 XP")).toBeVisible();

    expect(confetti).toHaveBeenCalled();

    await userEvent.click(page.getByRole("button", { name: "Continue" }));

    expect(setOpen).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith("/learn");
  });
});
