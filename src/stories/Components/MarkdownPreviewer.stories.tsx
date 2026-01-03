import type { Meta, StoryObj } from "@storybook/react";
import MarkdownPreviewer from "@/Components/MarkdownPreviewer";
import { useState } from "react";

const meta = {
  title: "Components/MarkdownPreviewer",
  component: MarkdownPreviewer,
  parameters: {
    layout: "padded",
  },
  decorators: [
    // A black background is required because both the text and default background are white
    // for this component
    (Story) => (
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
  },
} satisfies Meta<typeof MarkdownPreviewer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Render function to handle state updates
const Template = (args: any) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return <MarkdownPreviewer {...args} value={value} onChange={handleChange} />;
};

export const Default: Story = {
  render: Template,
  args: {
    value:
      "# Hello World\n\nStart typing **markdown** here to see the preview on the right!",
  },
};

export const ComplexMarkdown: Story = {
  render: Template,
  args: {
    value: `# Japanese Practice
        
## Vocabulary
- 私 (watashi) - I
- 猫 (neko) - Cat

## Grammar
> Particle **wa** (は) marks the topic.

\`\`\`javascript
console.log("Konnichiwa");
\`\`\`
`,
  },
};
