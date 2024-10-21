import type { Meta, StoryObj } from "@storybook/react";
import EventsIn from "@/components/common/form/inputs/EventsIn";

const meta = {
  title: "Components/EventsIn",
  component: EventsIn,
  tags: ["basic", "component", "input", "custom"],
} satisfies Meta<typeof EventsIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    ip: "123.123.123.123",
    data: {
      number: "E01",
    },
    values: {
      device_type: "210",
    },
    value: "0000000000000000",
    label: "Events In",
    onChange: (args: any) => alert(args),
  },
  argTypes: {
    values: {
      control: { type: "select" },
      options: ["210", "211", "212", "213", "214", "215", "216"],
      mapping: {
        "210": {
          device_type: "210",
        },
        "211": {
          device_type: "211",
        },
        "212": {
          device_type: "212",
        },
        "213": {
          device_type: "213",
        },
        "214": {
          device_type: "214",
        },
        "215": {
          device_type: "215",
        },
        "216": {
          device_type: "216",
        },
      },
    },
  },
};
