import type { Meta, StoryObj } from "@storybook/react";
import { vi } from "vitest";
import FlashcardList from "@/Components/FlashcardList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "@/Contexts/AuthContext";
import SnackbarContext from "@/Contexts/SnackbarContext";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import fn from "@storybook/addon-vitest";
import { api } from "@/utils/apiClient";

// Mock the apiClient module
vi.mock("../../utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock ReviewModal to avoid its complexity
vi.mock("./ReviewModal", () => ({
  default: ({ open, setOpen }: any) =>
    open ? (
      <div data-testid="review-modal">
        ReviewModal Open <button onClick={() => setOpen(false)}>Close</button>
      </div>
    ) : null,
}));

// Mock Flashcard to simplify interaction
vi.mock("./Flashcard", () => ({
  default: ({ frontText, backText, onNextCard, onPreviousCard }: any) => (
    <div data-testid="flashcard">
      <p>Front: {frontText}</p>
      <p>Back: {backText}</p>
      <button onClick={onNextCard}>Next</button>
      <button onClick={onPreviousCard}>Prev</button>
    </div>
  ),
}));

const mockLesson = {
  _id: "lesson1",
  title: "Basic Hiragana",
  category: "flashcards",
  card_ids: ["1", "2", "3"],
  created_at: "2023-01-01",
};

const mockCards = [
  { _id: "1", front_text: "あ", back_text: "a" },
  { _id: "2", front_text: "い", back_text: "i" },
  { _id: "3", front_text: "う", back_text: "u" },
];

const mockReview = {
  isOverdue: false,
  daysLeft: 1,
};

// Setup query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock Axios Adapter
const mockAdapter = async (config: any) => {
  if (config.url?.includes("cards/by-ids")) {
    return {
      data: mockCards,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }
  if (config.url?.includes("/review/")) {
    return {
      data: mockReview,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }
  return {
    data: {},
    status: 404,
    statusText: "Not Found",
    headers: {},
    config,
  };
};

const meta = {
  title: "Components/FlashcardList",
  component: FlashcardList,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      axios.defaults.adapter = mockAdapter;

      return (
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider
            value={{
              authData: {
                token: "mock-token",
                isLoggedIn: true,
                user: { name: "Test User" },
              },
              setAuthData: fn(),
              login: fn(),
              logout: fn(),
            }}
          >
            <SnackbarContext.Provider
              value={{
                showSnackbar: (msg: string) => console.log("Snackbar:", msg),
              }}
            >
              <MemoryRouter>
                <Story />
              </MemoryRouter>
            </SnackbarContext.Provider>
          </AuthContext.Provider>
        </QueryClientProvider>
      );
    },
  ],
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof FlashcardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lessonId: "lesson1",
    lesson: mockLesson as any,
  },
};
