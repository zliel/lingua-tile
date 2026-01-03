import type { Meta, StoryObj } from "@storybook/react";
import AnimatedLogo from "@/Components/home/AnimatedLogo";

const meta = {
  title: "Components/Home/AnimatedLogo",
  component: AnimatedLogo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 100, max: 500, step: 10 } },
  },
} satisfies Meta<typeof AnimatedLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 200,
  },
};

export const Small: Story = {
  args: {
    size: 100,
  },
};

export const Large: Story = {
  args: {
    size: 400,
  },
};
