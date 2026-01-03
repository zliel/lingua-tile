import type { Meta, StoryObj } from "@storybook/react";
import { ProjectedReviewsChart } from "@/Components/charts/ProjectedReviewsChart";
import AuthContext from "@/Contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";

const queryClient = new QueryClient();

const today = dayjs();
const mockReviews = [
  { next_review: today.add(1, "day").format("YYYY-MM-DD") },
  { next_review: today.add(1, "day").format("YYYY-MM-DD") },
  { next_review: today.add(2, "day").format("YYYY-MM-DD") },
  { next_review: today.add(5, "day").format("YYYY-MM-DD") },
  { next_review: today.add(7, "day").format("YYYY-MM-DD") },
  { next_review: today.add(10, "day").format("YYYY-MM-DD") },
  { next_review: today.add(10, "day").format("YYYY-MM-DD") },
  { next_review: today.add(10, "day").format("YYYY-MM-DD") },
];

const meta = {
  title: "Components/Charts/ProjectedReviewsChart",
  component: ProjectedReviewsChart,
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
} satisfies Meta<typeof ProjectedReviewsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reviews: mockReviews as any[],
  },
};
