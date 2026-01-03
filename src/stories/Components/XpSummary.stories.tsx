import type { Meta, StoryObj } from '@storybook/react';
import { XpSummary } from '@/Components//XpSummary';
import fn from '@storybook/addon-vitest';

const meta = {
  title: 'Components/XpSummary',
  component: XpSummary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    handleContinue: { action: 'continue' }
  },
} satisfies Meta<typeof XpSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Standard Lesson Completion
export const LessonCompleteFirstTime: Story = {
  args: {
    summaryData: {
      xp_gained: 20,
      new_xp: 350,
      new_level: 5,
      leveled_up: false,
    },
    handleContinue: fn()
  },
};

// Lesson Review Complete
export const LessonReview: Story = {
  args: {
    summaryData: {
      xp_gained: 5,
      new_xp: 355,
      new_level: 5,
      leveled_up: false,
    },
    handleContinue: fn()
  }
}

// Level Up Event
export const LevelUp: Story = {
  args: {
    summaryData: {
      xp_gained: 20,
      new_xp: 0,
      new_level: 6,
      leveled_up: true,
    },
    handleContinue: fn()
  },
};

