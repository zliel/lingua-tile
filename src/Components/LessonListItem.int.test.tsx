import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { LessonListItem } from "./LessonListItem";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import OfflineContext from "../Contexts/OfflineContext";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const mockAuth = {
    authData: { username: "TestUser", token: "token", isLoggedIn: true },
  };
  const mockOffline = {
    isPending: () => false,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <OfflineContext.Provider value={mockOffline as any}>
          <MemoryRouter>{children}</MemoryRouter>
        </OfflineContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("LessonListItem Component Integration", () => {
  const mockLesson = {
    _id: "lesson1",
    title: "Introduction to Hiragana",
    category: "flashcards",
    section_id: "section1",
    is_active: true,
    order_index: 0,
    card_ids: [],
  };

  it("displays lesson title and creates start button", async () => {
    const Wrapper = createWrapper();
    const onLessonStart = vi.fn();

    render(
      <LessonListItem
        lesson={mockLesson as any}
        review={null}
        onLessonStart={onLessonStart}
      />,
      { wrapper: Wrapper },
    );

    await expect
      .element(page.getByText("Introduction to Hiragana"))
      .toBeVisible();
    await expect
      .element(page.getByRole("button", { name: /Start Lesson/i }))
      .toBeVisible();
  });

  it("displays overdue status when applicable", async () => {
    const Wrapper = createWrapper();
    const reviewStats = { daysLeft: -2, isOverdue: true };

    render(
      <LessonListItem
        lesson={mockLesson as any}
        review={reviewStats}
        onLessonStart={vi.fn()}
      />,
      { wrapper: Wrapper },
    );

    await expect.element(page.getByText("Overdue")).toBeVisible();
  });

  it("navigates on start click", async () => {
    const Wrapper = createWrapper();
    const onLessonStart = vi.fn();

    render(
      <LessonListItem
        lesson={mockLesson as any}
        review={null}
        onLessonStart={onLessonStart}
      />,
      { wrapper: Wrapper },
    );

    await userEvent.click(page.getByRole("button", { name: /Start Lesson/i }));
    expect(onLessonStart).toHaveBeenCalledWith(mockLesson);
  });
});
