import type { Meta, StoryObj } from "@storybook/react";
import BatteryTest from "@/components/card/BatteryTest";

const meta = {
  title: "Components/BatteryTest",
  component: BatteryTest,
  tags: ["custom", "component", "entral-unit"],
} satisfies Meta<typeof BatteryTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    customizableEndpoint: () => Promise.resolve({}),
  },
};
