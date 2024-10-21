import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Select from "@/components/common/form/inputs/Select";
import { MenuItem } from "@mui/material";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["basic", "component", "select"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
    onClose: fn(),
    onOpen: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    label: "Select Input",
    variant: "outlined",
    id: "select-story-basic",
    fullWidth: true,
    required: true,
    value: 20,
    children: (
      <>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </>
    ),
  },
  // argTypes: {
  //   startAdornment: { table: { disable: true } },
  //   endAdornment: { table: { disable: true } },
  // },
};
