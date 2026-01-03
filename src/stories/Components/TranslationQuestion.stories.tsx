import type { Meta, StoryObj } from '@storybook/react';
import TranslationQuestion from '@/Components/TranslationQuestion';
import fn from '@storybook/addon-vitest';
import { SnackbarProvider } from '@/Contexts/SnackbarContext';

const sampleSentence = {
  full_sentence: "私はリンゴを食べます。",
  possible_answers: ["I eat apples."],
  words: ["私", "は", "リンゴ", "を", "食べます"],
};

const allSentences = [
  sampleSentence,
  {
    full_sentence: "私は水を飲みます。",
    possible_answers: ["I drink water."],
    words: ["私", "は", "水", "を", "飲みます"],
  },
  {
    full_sentence: "これはペンです",
    possible_answers: ["This is a pen."],
    words: ["これ", "は", "ペン", "です"],
  },
];

const meta = {
  title: 'Components/TranslationQuestion',
  component: TranslationQuestion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
  args: {
    onNext: fn(),
    allSentences: allSentences,
  },
} satisfies Meta<typeof TranslationQuestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sentence: sampleSentence,
  },
};

export const LongSentence: Story = {
  args: {
    sentence: {
      full_sentence: "昨日、私は公園に行って、ボールで遊んでいるとてもかわいい犬を見ました。",
      possible_answers: ["Yesterday, I went to the park and saw a very cute dog playing with a ball."],
      words: ["昨日", "私", "は", "公園", "に", "行って", "ボール", "で", "遊んでいる", "とても", "かわいい", "犬", "を", "見ました"],
    }
  }
}
