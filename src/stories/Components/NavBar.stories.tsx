import type { Meta, StoryObj } from '@storybook/react';
import NavBar from '@/Components/NavBar';
import AuthContext from '@/Contexts/AuthContext';
import OfflineContext from '@/Contexts/OfflineContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// @ts-ignore
axios.get = async (url) => {
  if (url.includes('/api/users/')) {
    return { data: { current_streak: 12 } };
  }
  return { data: {} };
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    )
  ]
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const createAuthMock = (overrides: any = {}) => ({
  authData: {
    isLoggedIn: false,
    username: null,
    token: null,
    isAdmin: false,
    ...overrides.authData,
  },
  authIsLoading: false,
  login: () => { },
  logout: () => { },
  checkAdmin: async () => false,
  ...overrides,
});

const createOfflineMock = (overrides: any = {}) => ({
  isOnline: true,
  addToQueue: () => { },
  isPending: () => false,
  sync: async () => { },
  clearQueue: () => { },
  ...overrides,
});


export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={createAuthMock({ authData: { isLoggedIn: false } })}>
        <OfflineContext.Provider value={createOfflineMock()}>
          <Story />
        </OfflineContext.Provider>
      </AuthContext.Provider>
    )
  ]
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={createAuthMock({
        authData: {
          isLoggedIn: true,
          username: 'TestUser',
          token: 'fake-token'
        }
      })}>
        <OfflineContext.Provider value={createOfflineMock()}>
          <Story />
        </OfflineContext.Provider>
      </AuthContext.Provider>
    )
  ]
};

export const OfflineMode: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={createAuthMock({
        authData: {
          isLoggedIn: true,
          username: 'OfflineUser',
          token: 'fake-token'
        }
      })}>
        <OfflineContext.Provider value={createOfflineMock({ isOnline: false })}>
          <Story />
        </OfflineContext.Provider>
      </AuthContext.Provider>
    )
  ]
};

