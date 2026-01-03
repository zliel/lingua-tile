import type { Meta, StoryObj } from "@storybook/react";
import FormSkeleton from "@/Components/skeletons/FormSkeleton";

const meta = {
  title: "Components/Skeletons/FormSkeleton",
  component: FormSkeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fields: { control: "number" },
    buttons: { control: "number" },
    title: { control: "boolean" },
    width: { control: "number" },
  },
} satisfies Meta<typeof FormSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ComplexForm: Story = {
  args: {
    fields: 5,
    buttons: 2,
    width: 500,
  },
};
