import type { Meta, StoryObj } from "@storybook/react";
import Sectors from "@/components/common/form/inputs/BulletNumbers";

const meta = {
  title: "Components/Sectors",
  component: Sectors,
  tags: ["basic", "component", "input", "custom"],
} satisfies Meta<typeof Sectors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: "1001000000000010",
    label: "Sectors",
    onChange: (args: any) => alert(args),
  },
};
