import type { Meta, StoryObj } from '@storybook/react';
import TranslationForm from '@/Components/TranslationForm';
import axios from 'axios';

// @ts-ignore
axios.get = async (url) => {
  if (url.includes('/api/translations/')) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { data: { translatedText: 'こんにちは！ (Mocked Translation)' } };
  }
  return { data: {} };
};

const meta = {
  title: 'Components/TranslationForm',
  component: TranslationForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TranslationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

