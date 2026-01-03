import type { Meta, StoryObj } from "@storybook/react";
import fn from "@storybook/addon-vitest";
import { ErrorFallback } from "@/Components/ErrorFallback";

const meta = {
  title: "Components/ErrorFallback",
  component: ErrorFallback,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    resetErrorBoundary: fn(),
  },
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error("This is a simulated error message for testing purposes."),
  },
};
