import type { Meta, StoryObj } from '@storybook/react';
import { JourneySkeleton } from '@/Components/skeletons/JourneyMapSkeleton';

const meta = {
  title: 'Components/Skeletons/JourneySkeleton',
  component: JourneySkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JourneySkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

