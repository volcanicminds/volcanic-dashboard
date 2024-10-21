import type { Meta, StoryObj } from "@storybook/react";
import OptionalModules from "@/components/card/OptionalModules";

const meta = {
  title: "Components/OptionalModules",
  component: OptionalModules,
  tags: ["basic", "component", "home"],
} satisfies Meta<typeof OptionalModules>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      {
        alias: "wifi_equipped",
        data: "0",
      },
      {
        alias: "gsm_equipped",
        data: "0",
      },
      {
        alias: "zigbee_equipped",
        data: "0",
      },
      {
        alias: "pstn_equipped",
        data: "0",
      },
      {
        data: true,
        alias: "WIFI",
        label: "ccu-wifi-status-label",
      },
      { data: false, alias: "WIFI_CONN" },
      {
        data: false,
        alias: "IS4G",
      },
      {
        data: true,
        alias: "GSM",
        label: "ccu-mobile-status-label",
      },
      { data: false, alias: "MOBILEFAULT" },
      { data: false, alias: "GSM_RXLEV" },
      {
        data: false,
        alias: "ZIGBEE",
        label: "ccu-ZigBee-status-label",
      },
      {
        data: false,
        alias: "PSTN",
        label: "ccu-pstn-status-label",
      },
      { data: false, alias: "PSTNFAULT" },
    ],
    fieldsOrder: ["WIFI", "GSM", "ZIGBEE", "PSTN"],
  },
};
