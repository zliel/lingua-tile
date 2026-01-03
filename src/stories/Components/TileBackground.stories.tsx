import type { Meta, StoryObj } from "@storybook/react";
import TileBackground from "@/Components/TileBackground";
import { MemoryRouter } from "react-router-dom";

const meta = {
  title: "Components/TileBackground",
  component: TileBackground,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TileBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <MemoryRouter initialEntries={["/"]}>
          <Story />
        </MemoryRouter>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            color: "text.primary",
            background: "rgba(255,255,255,0.8)",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <h2>Content Overlay</h2>
          <p>The background should be animating behind this.</p>
        </div>
      </div>
    ),
  ],
};

export const FocusMode: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <MemoryRouter initialEntries={["/flashcards"]}>
          <Story />
        </MemoryRouter>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            color: "text.primary",
            background: "rgba(255,255,255,0.8)",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <h2>Focus Mode</h2>
          <p>Background tiles should be hidden/faded out.</p>
        </div>
      </div>
    ),
  ],
};
