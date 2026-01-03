import type { Meta, StoryObj } from "@storybook/react";
import Flashcard from "@/Components/Flashcard";
import fn from "@storybook/addon-vitest";

const meta = {
  title: "Components/Flashcard",
  component: Flashcard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    frontText: { control: "text" },
    backText: { control: "text" },
  },
  args: {
    onNextCard: fn(),
    onPreviousCard: fn(),
  },
} satisfies Meta<typeof Flashcard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    frontText: "食べる",
    backText: "To Eat",
  },
};

export const LongText: Story = {
  args: {
    frontText: "私は日本語を勉強しています",
    backText: "I am studying Japanese",
  },
};

export const EnglishFront: Story = {
  args: {
    frontText: "Cat",
    backText: "猫 (Neko)",
  },
};
