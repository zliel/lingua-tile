import type { Meta, StoryObj } from "@storybook/react";
import WordBank from "@/Components/WordBank";

const fn = () => {};

const meta = {
  title: "Components/WordBank",
  component: WordBank,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onWordClick: { action: "word clicked" },
    onReorder: { action: "reordered" },
  },
  args: {
    onWordClick: fn(),
    onReorder: fn(),
  },
} satisfies Meta<typeof WordBank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    availableWords: [
      { id: "1", text: "私(わたし)" },
      { id: "2", text: "は" },
      { id: "3", text: "学生(がくせい)" },
      { id: "4", text: "です" },
    ],
    selectedWords: [],
    isCorrect: null,
    showFurigana: true,
  },
};

export const PartiallyFilled: Story = {
  args: {
    availableWords: [
      { id: "3", text: "学生(がくせい)" },
      { id: "4", text: "です" },
    ],
    selectedWords: [
      { id: "1", text: "私(わたし)" },
      { id: "2", text: "は" },
    ],
    isCorrect: null,
    showFurigana: true,
  },
};

export const Correct: Story = {
  args: {
    availableWords: [],
    selectedWords: [
      {
        id: "1",
        text: "私(わたし)",
      },
      {
        id: "2",
        text: "は",
      },
      {
        id: "3",
        text: "学生(がくせい)",
      },
      {
        id: "4",
        text: "です",
      },
    ],
    isCorrect: true,
    showFurigana: true,
  },
};

export const Incorrect: Story = {
  args: {
    availableWords: [],
    selectedWords: [
      { id: "1", text: "私(わたし)" },
      { id: "2", text: "は" },
      { id: "4", text: "です" },
      { id: "3", text: "学生(がくせい)" },
    ],
    isCorrect: false,
    showFurigana: true,
  },
};
