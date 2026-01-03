import type { Meta, StoryObj } from '@storybook/react';
import PageSkeleton from '@/Components/skeletons/PageSkeleton';

const meta = {
  title: 'Components/Skeletons/PageSkeleton',
  component: PageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

