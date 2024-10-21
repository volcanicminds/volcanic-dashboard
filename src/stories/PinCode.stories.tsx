import type { Meta, StoryObj } from "@storybook/react";
import PinCode from "@/components/common/PinCode";
import { fn } from "@storybook/test";

const meta = {
  title: "Components/PinCode",
  component: PinCode,
  tags: ["basic", "component", "input", "custom"],
  args: {
    onChange: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof PinCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: "TEST",
    isLoading: false,
    type: "password",
    fontWeight: 700,
    fontSize: "30px",
  },
};
