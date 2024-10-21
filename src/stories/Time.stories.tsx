import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import TimePicker from "@/components/common/form/inputs/TimePicker";
import dayjs from "dayjs";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["basic", "component", "input"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    id: "id",
    disabled: false,
    type: "date",
    required: true,
    size: "small",
    fullWidth: true,
    variant: "standard",
    defaultValue: dayjs(new Date()),
    label: "TEST",
  },
};
