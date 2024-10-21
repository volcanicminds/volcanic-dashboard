import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import BasicInput from "@/components/common/form/inputs/BasicInput";
import { InputAdornment } from "@mui/material";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/BasicInput",
  component: BasicInput,
  tags: ["basic", "component", "input"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof BasicInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    color: "primary",
    label: "Basic Input",
    placeholder: "Insert text here",
    variant: "outlined",
  },
  argTypes: {
    startAdornment: { table: { disable: true } },
    endAdornment: { table: { disable: true } },
  },
};
export const StartAdornment: Story = {
  args: {
    color: "primary",
    label: "Start Adornment Input",
    placeholder: "Insert text here",
    variant: "standard",
    type: "number",
    startAdornment: <InputAdornment position="start">kg</InputAdornment>,
  },
  argTypes: {
    startAdornment: { table: { disable: true } },
    endAdornment: { table: { disable: true } },
  },
};
export const EndAdornment: Story = {
  args: {
    color: "primary",
    label: "End Adornment Input",
    placeholder: "Insert text here",
    variant: "filled",
    type: "number",
    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
  },
  argTypes: {
    startAdornment: { table: { disable: true } },
    endAdornment: { table: { disable: true } },
  },
};
