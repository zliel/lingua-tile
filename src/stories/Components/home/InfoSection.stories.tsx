import type { Meta, StoryObj } from '@storybook/react';
import { InfoSection } from '@/Components/home/InfoSection';

const meta = {
  title: 'Components/Home/InfoSection',
  component: InfoSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InfoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

