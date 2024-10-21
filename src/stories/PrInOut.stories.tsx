import type { Meta, StoryObj } from "@storybook/react";
import PrInOut from "@/components/card/PrInOut";

const meta = {
  title: "Components/PrInOut",
  component: PrInOut,
  tags: ["custom", "component", "entral-unit"],
} satisfies Meta<typeof PrInOut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Pr In Out",
    dataFields: [
      { alias: "in", data: 15 },
      { alias: "out", data: 15 },
      { alias: "max", data: 30 },
    ],
  },
};
