import type { Meta, StoryObj } from '@storybook/react';
import StreakCounter from '@/Components/StreakCounter';

const meta = {
  title: 'Components/StreakCounter',
  component: StreakCounter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    streak: { control: { type: 'number', min: 0 } },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof StreakCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Streak: Story = {
  args: {
    streak: 1,
    loading: false,
  },
};

export const ZeroStreak: Story = {
  args: {
    streak: 0,
    loading: false,
  },
};
