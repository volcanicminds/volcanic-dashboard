import type { Meta, StoryObj } from "@storybook/react";
import ConnectivityList from "@/components/card/ConnectivityList";

const meta = {
  title: "Components/ConnectivityList",
  component: ConnectivityList,
  tags: ["basic", "component", "home"],
} satisfies Meta<typeof ConnectivityList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      {
        alias: "field1",
        data: true,
        rules: [
          {
            conditions: [
              {
                data: "Ethernet",
                operator: "equal",
                value: true,
              },
            ],
            result: "ok",
            icon: "Cable",
          },
          {
            conditions: [
              {
                data: "Ethernet",
                operator: "equal",
                value: false,
              },
            ],
            result: "ok",
            icon: "LinkOff",
          },
        ],
      },
      {
        alias: "field2",
        data: true,
        rules: [
          {
            conditions: [
              {
                data: "Wifi",
                operator: "equal",
                value: true,
              },
            ],
            result: "ok",
            icon: "Wifi",
          },
          {
            conditions: [
              {
                data: "Wifi",
                operator: "equal",
                value: false,
              },
            ],
            result: "ok",
            icon: "WifiOff",
          },
        ],
      },
      {
        alias: "field3",
        data: true,
        rules: [
          {
            icon: "SignalCellular4Bar",
            additionalIcon: "FourGMobiledata",
            conditions: [
              {
                data: "GPRS",
                operator: "equal",
                value: true,
              },
              {
                data: "IS4G",
                operator: "equal",
                value: true,
              },
            ],
            result: "ko",
          },
          {
            icon: "EMobiledata",
            conditions: [
              {
                data: "GPRS",
                operator: "equal",
                value: true,
              },
              {
                data: "IS4G",
                operator: "equal",
                value: false,
              },
            ],
            result: "ko",
          },
          {
            icon: "MobiledataOff",
            conditions: [
              {
                data: "GPRS",
                operator: "equal",
                value: false,
              },
            ],
            result: "ko",
          },
        ],
      },
    ],
    fieldsOrder: ["field2", "field3", "field1"],
  },
};
