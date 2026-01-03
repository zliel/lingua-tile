import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@/Components/home/HeroSection";
import AuthContext from "@/Contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";

const meta = {
  title: "Components/Home/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <AuthContext.Provider value={{ authData: { isLoggedIn: false } } as any}>
        <Story />
      </AuthContext.Provider>
    ),
  ],
};
