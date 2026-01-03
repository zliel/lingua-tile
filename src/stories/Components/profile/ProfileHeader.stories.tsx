import type { Meta, StoryObj } from "@storybook/react";
import fn from "@storybook/addon-vitest";
import { ProfileHeader } from "@/Components/profile/ProfileHeader";

const mockUser = {
  username: "TestUser",
  roles: ["user"],
  level: 5,
  xp: 250,
};

const meta = {
  title: "Components/Profile/ProfileHeader",
  component: ProfileHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    handleUpdate: fn(),
  },
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: mockUser as any,
  },
};

export const AdminUser: Story = {
  args: {
    user: {
      ...mockUser,
      roles: ["user", "admin"],
      level: 50,
      xp: 10000,
    } as any,
  },
};
