import type { Meta, StoryObj } from '@storybook/react';
import GrammarLessonSkeleton from '@/Components/skeletons/GrammarLessonSkeleton';

const meta = {
  title: 'Components/Skeletons/GrammarLessonSkeleton',
  component: GrammarLessonSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GrammarLessonSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

