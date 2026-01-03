import type { Meta, StoryObj } from "@storybook/react";
import LevelProgressBar from "@/Components/charts/LevelProgressBar";

const meta = {
  title: "Components/Charts/LevelProgressBar",
  component: LevelProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    level: { control: "number" },
    xp: { control: "number" },
  },
} satisfies Meta<typeof LevelProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LevelUpApproaching: Story = {
  args: {
    level: 5,
    xp: 1000,
  },
};

export const JustLeveledUp: Story = {
  args: {
    level: 10,
    xp: 50,
  },
};

export const ZeroProgress: Story = {
  args: {
    level: 1,
    xp: 0,
  },
};
