import type { Meta, StoryObj } from '@storybook/react';
import { LessonProgressChart } from '@/Components/charts/LessonProgressChart';
import AuthContext from '@/Contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    }
  }
});

const mockReviews = [
  ...Array(10).fill({ card_object: { state: 0 } }), // New
  ...Array(20).fill({ card_object: { state: 1 } }), // Learning
  ...Array(30).fill({ card_object: { state: 2 } }), // Review
  ...Array(5).fill({ card_object: { state: 3 } }),  // Relearning
];

const meta = {
  title: 'Components/Charts/LessonProgressChart',
  component: LessonProgressChart,
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
} satisfies Meta<typeof LessonProgressChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reviews: mockReviews as any[],
  },
};

