import type { Meta, StoryObj } from "@storybook/react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { fn } from "@storybook/test";

const meta = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["basic", "component", "dialog"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onDiscard: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    open: true,
    isModal: true,
    title: "Title",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    discardLabel: "Discard",
    confirmLabel: "Confirm",
  },
};
