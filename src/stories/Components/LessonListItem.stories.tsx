import type { Meta, StoryObj } from '@storybook/react';
import { LessonListItem } from '@/Components/LessonListItem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthContext from '@/Contexts/AuthContext';
import OfflineContext from '@/Contexts/OfflineContext';
import { MemoryRouter } from 'react-router-dom';

// Mock Data
const baseLesson = {
  _id: 'lesson1',
  title: 'Introduction to Particles',
  description: 'Learn wa, ga, and o',
  category: 'grammar',
  card_ids: [],
  created_at: '2023-01-01',
};

const queryClient = new QueryClient();

const meta = {
  title: 'Components/LessonListItem',
  component: LessonListItem,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{
          authData: { token: 'mock-token', isLoggedIn: true, isAdmin: false, username: 'Test User' },
          authIsLoading: false,
          login: () => { },
          logout: () => { },
          checkAdmin: async () => false
        }}>
          <OfflineContext.Provider value={{
            isOnline: true,
            isPending: () => false,
            addToQueue: () => { },
            clearQueue: () => { },
            sync: async () => { }
          } as any}>
            <MemoryRouter>
              <div style={{ maxWidth: '400px' }}>
                <Story />
              </div>
            </MemoryRouter>
          </OfflineContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    onLessonStart: { action: 'lesson started' },
  },
} satisfies Meta<typeof LessonListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewLesson: Story = {
  args: {
    lesson: { ...baseLesson, category: 'flashcards' } as any,
    review: null,
  },
};

export const ReviewDue: Story = {
  args: {
    lesson: { ...baseLesson, category: 'practice' } as any,
    review: { isOverdue: true, daysLeft: -2 } as any,
  },
};

export const OnTrack: Story = {
  args: {
    lesson: { ...baseLesson, category: 'grammar' } as any,
    review: { isOverdue: false, daysLeft: 5 } as any,
  },
};

export const PendingSync: Story = {
  args: {
    lesson: { ...baseLesson } as any,
    review: null,
  },
  decorators: [
    (Story) => (
      <OfflineContext.Provider value={{
        isOnline: false,
        isPending: () => true, // Force pending state
        addToQueue: () => { },
        clearQueue: () => { },
        sync: async () => { }
      } as any}>
        <Story />
      </OfflineContext.Provider>
    )
  ]
}

