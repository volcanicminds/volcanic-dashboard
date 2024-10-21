import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Utilities from "../components/feature/Utilities";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Utilities",
  component: Utilities,
  tags: ["basic", "component", "input"],
  args: {
    customizableEndpoint: fn(),
    customizableEndpointPost: fn(),
    logout: fn(),
  },
} satisfies Meta<typeof Utilities>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    title: "TEST",
    navigate: () => {},
    setToken: () => {},
  },
};
