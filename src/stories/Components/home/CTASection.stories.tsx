import type { Meta, StoryObj } from '@storybook/react';
import { CTASection } from '@/Components/home/CTASection';
import AuthContext from '@/Contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Home/CTASection',
  component: CTASection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof CTASection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={{ authData: { isLoggedIn: false } } as any}>
        <Story />
      </AuthContext.Provider>
    ),
  ],
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={{ authData: { isLoggedIn: true } } as any}>
        <Story />
      </AuthContext.Provider>
    ),
  ],
};

