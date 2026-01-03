import type { Meta, StoryObj } from "@storybook/react";
import { LessonDifficultyChart } from "@/Components/charts/LessonDifficultyChart";
import AuthContext from "@/Contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const mockReviews = Array.from({ length: 50 }, (_, i) => ({
  card_object: {
    difficulty: Math.random() * 10,
  },
}));

const meta = {
  title: "Components/Charts/LessonDifficultyChart",
  component: LessonDifficultyChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{ authData: { token: "mock-token" } } as any}
        >
          <div style={{ width: "600px" }}>
            <Story />
          </div>
        </AuthContext.Provider>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof LessonDifficultyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reviews: mockReviews as any[],
  },
};
