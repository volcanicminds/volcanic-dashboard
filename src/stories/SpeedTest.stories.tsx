import type { Meta, StoryObj } from "@storybook/react";
import SpeedTest from "@/components/card/SpeedTest";

const meta = {
  title: "Components/SpeedTest",
  component: SpeedTest,
  tags: ["custom", "component", "entral-unit"],
} satisfies Meta<typeof SpeedTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    customizableEndpoint: () => Promise.resolve({}),
    defaultUpload: "12345 Kb/s",
  },
};
