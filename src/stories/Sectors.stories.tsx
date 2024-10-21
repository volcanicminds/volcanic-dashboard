import type { Meta, StoryObj } from "@storybook/react";
import BulletNumbers from "@/components/common/form/inputs/BulletNumbers";

const meta = {
  title: "Components/BulletNumbers",
  component: BulletNumbers,
  tags: ["basic", "component", "input", "custom"],
} satisfies Meta<typeof BulletNumbers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: "1001000000000010",
    label: "BulletNumbers",
    onChange: (args: any) => alert(args),
  },
};
