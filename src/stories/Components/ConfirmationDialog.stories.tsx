import type { Meta, StoryObj } from "@storybook/react";
import ConfirmationDialog from "@/Components/ConfirmationDialog";
import { Button } from "@mui/material";
import { useState } from "react";

const meta = {
  title: "Components/ConfirmationDialog",
  component: ConfirmationDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    onConfirm: { action: "confirmed" },
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const DialogWrapper = (args: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open {args.title || "Dialog"}
      </Button>
      <ConfirmationDialog
        {...args}
        open={open}
        onClose={() => {
          args.onClose?.();
          setOpen(false);
        }}
        onConfirm={() => {
          args.onConfirm?.();
          setOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: "Confirm Action",
    message: "Are you sure you want to proceed? This action cannot be undone.",
  },
};

export const DeleteWarning: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: "Delete Account?",
    message: "All your progress and data will be permanently deleted.",
  },
};
