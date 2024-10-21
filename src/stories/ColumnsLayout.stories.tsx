import type { Meta, StoryObj } from "@storybook/react";
import Columns from "@/layouts/Columns";

const meta = {
  title: "Layouts/Columns",
  component: Columns,
  tags: ["basic", "layout", "columns"],
} satisfies Meta<typeof Columns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: [
      <div data-column={0}>1a</div>,
      <div data-column={0}>1b</div>,
      <div data-column={1}>2a</div>,
      <div data-column={1}>2b</div>,
    ],
    columnNumber: 2,
    columnWeights: [2, 2],
  },
  argTypes: {
    children: { table: { disable: true } },
  },
};
