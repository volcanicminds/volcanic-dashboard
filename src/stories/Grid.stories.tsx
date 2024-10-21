import type { Meta, StoryObj } from "@storybook/react";
import Grid from "@/layouts/Grid";

const meta = {
  title: "Layouts/Grid",
  component: Grid,
  tags: ["basic", "layout", "grid"],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: [
      <div>Component 1</div>,
      <div>Component 2</div>,
      <div>Component 3</div>,
    ],
    gridDimensions: [
      { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 },
      { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 },
      { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 },
    ],
  },
  argTypes: {
    children: { table: { disable: true } },
  },
};
