import type { Meta, StoryObj } from "@storybook/react";
import VirtualInOut from "@/components/card/VirtualInOut";

const meta = {
  title: "Components/VirtualInOut",
  component: VirtualInOut,
  tags: ["basic", "component", "custom"],
} satisfies Meta<typeof VirtualInOut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      {
        alias: "in",
        label: "in",
        data: "5",
      },
      {
        alias: "out",
        label: "out",
        data: "5",
      },
      {
        alias: "max",
        label: "max",
        data: "100",
      },
    ],
  },
};
