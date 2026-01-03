import type { Meta, StoryObj } from '@storybook/react';
import { TableSkeleton } from '@/Components/skeletons/TableSkeleton';

const meta = {
  title: 'Components/Skeletons/TableSkeleton',
  component: TableSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rows: { control: 'number' },
    columns: { control: 'number' },
  },
} satisfies Meta<typeof TableSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 5,
    columns: 4,
  },
  decorators: [
    (Story: Story) => (
      <div style={{ width: '80vw', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export const LargeTable: Story = {
  args: {
    rows: 10,
    columns: 6,
  },
  decorators: [
    (Story: Story) => (
      <div style={{ width: '80vw', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

