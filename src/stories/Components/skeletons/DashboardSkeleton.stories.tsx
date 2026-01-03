import type { Meta, StoryObj } from '@storybook/react';
import DashboardSkeleton from '@/Components/skeletons/DashboardSkeleton';

const meta = {
  title: 'Components/Skeletons/DashboardSkeleton',
  component: DashboardSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

