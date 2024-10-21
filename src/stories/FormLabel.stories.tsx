import type { Meta, StoryObj } from "@storybook/react";
import FormLabel from "@/components/common/form/inputs/Label";

const meta = {
  title: "Components/FormLabel",
  component: FormLabel,
  tags: ["basic", "form", "input"],
} satisfies Meta<typeof FormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: "consectetur adipiscing elit",
    label: "Lorem ipsum dolor sit amet",
  },
};
