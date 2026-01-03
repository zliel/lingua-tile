import type { Meta, StoryObj } from '@storybook/react';
import fn from '@storybook/addon-vitest';
import ReviewModal from '@/Components/ReviewModal';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';


// Mock axios for useLessonReview hook
// @ts-ignore
axios.post = async (url) => {
  if (url.includes('/reviews')) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return mock summary data designed to trigger the summary view
    return {
      data: {
        leveled_up: true,
        xp_gained: 50,
        new_streak: 5,
        streak_bonus: 10
      }
    };
  }
  return { data: {} };
};

const meta = {
  title: 'Components/ReviewModal',
  component: ReviewModal,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
  args: {
    setOpen: fn(),
    lessonId: 'test-lesson-id',
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

