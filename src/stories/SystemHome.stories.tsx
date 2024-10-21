import type { Meta, StoryObj } from "@storybook/react";
import SystemHome from "@/components/card/SystemHome";

const meta = {
  title: "Components/SystemHome",
  component: SystemHome,
  tags: ["basic", "component", "home"],
} satisfies Meta<typeof SystemHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      { alias: "field1", label: "hp-model", data: "TEST1" },
      { alias: "field2", label: "hp-serial", data: "TEST2" },
      { alias: "field3", label: "secumgr-ipk", data: "TEST3" },
      { alias: "field4", label: "cu-firmware-ipk", data: "TEST5" },
      { alias: "field5", label: "hp-ipaddr", data: "TEST6" },
      { alias: "field6", label: "hp-gwaddr", data: "TEST7" },
      { alias: "field7", label: "cu-plant", data: "TEST8" },
    ],

    fieldsOrder: ["field2", "field3", "field1"],
    qrCodeFieldId: "field3",
  },
};
