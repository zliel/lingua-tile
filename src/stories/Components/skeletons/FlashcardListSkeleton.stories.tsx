import type { Meta, StoryObj } from "@storybook/react";
import FlashcardListSkeleton from "@/Components/skeletons/FlashcardListSkeleton";

const meta = {
  title: "Components/Skeletons/FlashcardListSkeleton",
  component: FlashcardListSkeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FlashcardListSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
