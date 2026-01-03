import type { Meta, StoryObj } from '@storybook/react';
import { LessonListSkeleton } from '@/Components/LessonListSkeleton';

const meta = {
  title: 'Components/LessonListSkeleton',
  component: LessonListSkeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LessonListSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

