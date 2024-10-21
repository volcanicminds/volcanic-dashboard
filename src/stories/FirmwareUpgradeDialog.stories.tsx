import type { Meta, StoryObj } from "@storybook/react";
import FirmwareUpgradeDialog from "@/components/common/table/FirmwareUpgradeDialog";
import { fn } from "@storybook/test";

const meta = {
  title: "Components/FirmwareUpgradeDialog",
  component: FirmwareUpgradeDialog,
  tags: ["basic", "component", "dialog"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClose: fn(),
    configurableEndpointPost: fn(),
    configurableEndpoint: fn(),
  },
} satisfies Meta<typeof FirmwareUpgradeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    id: "id",
    open: true,
    isModal: false,
  },
};
