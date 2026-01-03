import type { Meta, StoryObj } from '@storybook/react';
import { PastWeekReviewsChart } from '@/Components/charts/PastWeekReviewsChart';
import AuthContext from '@/Contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';

const queryClient = new QueryClient();

const today = dayjs();
const mockReviews = [
  { review_date: today.format('YYYY-MM-DD') },
  { review_date: today.format('YYYY-MM-DD') },
  { review_date: today.subtract(1, 'day').format('YYYY-MM-DD') },
  { review_date: today.subtract(3, 'day').format('YYYY-MM-DD') },
  { review_date: today.subtract(3, 'day').format('YYYY-MM-DD') },
  { review_date: today.subtract(3, 'day').format('YYYY-MM-DD') },
  { review_date: today.subtract(5, 'day').format('YYYY-MM-DD') },
];

const meta = {
  title: 'Components/Charts/PastWeekReviewsChart',
  component: PastWeekReviewsChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ authData: { token: 'mock-token' } } as any}>
          <div style={{ width: '600px' }}>
            <Story />
          </div>
        </AuthContext.Provider>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof PastWeekReviewsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reviews: mockReviews as any[],
  },
};

