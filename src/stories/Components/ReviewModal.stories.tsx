import type { Meta, StoryObj } from "@storybook/react";
import fn from "@storybook/addon-vitest";
import ReviewModal from "@/Components/ReviewModal";
import AuthContext from "@/Contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { api } from "../../utils/apiClient";

// Mock axios for useLessonReview hook
// @ts-ignore
api.post = async (url) => {
  if (url.includes("/reviews")) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return mock summary data designed to trigger the summary view
    return {
      data: {
        leveled_up: true,
        xp_gained: 50,
        new_streak: 5,
        streak_bonus: 10,
      },
    };
  }
  return { data: {} };
};

const queryClient = new QueryClient();

const meta = {
  title: "Components/ReviewModal",
  component: ReviewModal,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <AuthContext.Provider
        value={{
          authData: {
            token: "mock- token",
            isLoggedIn: true,
            user: { name: "Test User" },
          },
          setAuthData: fn(),
          login: fn(),
          logout: fn(),
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </QueryClientProvider>
      </AuthContext.Provider>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
  args: {
    setOpen: fn(),
    lessonId: "test-lesson-id",
  },
} satisfies Meta<typeof ReviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
  },
};

export const Closed: Story = {
  args: {
    open: false,
  },
};
