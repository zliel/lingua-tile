import type { Meta, StoryObj } from "@storybook/react";
import PracticeLessonSkeleton from "@/Components/skeletons/PracticeLessonSkeleton";

const meta = {
  title: "Components/Skeletons/PracticeLessonSkeleton",
  component: PracticeLessonSkeleton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PracticeLessonSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
