import type { Meta, StoryObj } from "@storybook/react";
import Stack from "@/layouts/Stack";

const meta = {
  title: "Layouts/StackLayout",
  component: Stack,
  tags: ["basic", "layout", "stack"],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    spacing: 1,
    children: [
      <div>Component 1</div>,
      <div>Component 2</div>,
      <div>Component 3</div>,
    ],
  },
  argTypes: {
    children: { table: { disable: true } },
  },
};
