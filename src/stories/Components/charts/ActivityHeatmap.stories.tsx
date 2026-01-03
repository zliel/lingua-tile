import type { Meta, StoryObj } from '@storybook/react';
import { ActivityHeatmap } from '@/Components/charts/ActivityHeatmap';
import dayjs from 'dayjs';

const today = dayjs();
const data = Array.from({ length: 100 }, (_, i) => ({
  date: today.subtract(i * 3, 'day').format('YYYY-MM-DD'),
  count: Math.floor(Math.random() * 25),
}));

const meta = {
  title: 'Components/Charts/ActivityHeatmap',
  component: ActivityHeatmap,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ActivityHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: data,
    title: 'Study Activity',
  },
};

export const Empty: Story = {
  args: {
    data: [],
    title: 'No Activity',
  },
};

