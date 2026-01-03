import type { Meta, StoryObj } from "@storybook/react";
import { ProfileSkeleton } from "@/Components/skeletons/ProfileSkeleton";

const meta = {
  title: "Components/Skeletons/ProfileSkeleton",
  component: ProfileSkeleton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
