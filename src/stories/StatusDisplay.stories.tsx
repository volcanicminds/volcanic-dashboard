import type { Meta, StoryObj } from "@storybook/react";
import StatusDisplay from "@/components/card/StatusDisplay";

const meta = {
  title: "Components/StatusDisplay",
  component: StatusDisplay,
  tags: ["basic", "component", "home"],
} satisfies Meta<typeof StatusDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      {
        alias: "field1",
        label: "hp-power-supply-volt",
        data: "14 V",
        rules: [
          {
            result: "ok",
            conditions: [
              {
                data: "field1",
                operator: "less",
                value: 13.8,
              },
            ],
            icon: "Clear",
          },
          {
            result: "ko",
            conditions: [
              {
                data: "field1",
                operator: "between",
                value1: 13.8,
                value2: 14.7,
              },
            ],
            icon: "Done",
          },
          {
            result: "ok",
            conditions: [
              {
                data: "field1",
                operator: "greater",
                value: 14.7,
              },
            ],
            icon: "Clear",
          },
        ],
      },
      {
        alias: "field2",
        label: "hp-power-battery-volt",
        data: "12 mA",
        rules: [
          {
            result: "ok",
            conditions: [
              {
                data: "field2",
                operator: "less",
                value: 11.5,
              },
            ],
            icon: "Clear",
          },
          {
            result: "ko",
            conditions: [
              {
                data: "field2",
                operator: "greaterOrEqual",
                value: 11.5,
              },
            ],
            icon: "Done",
          },
        ],
      },
      {
        alias: "field3",
        label: "hp-power-supply-amp",
        data: "5 V",
        rules: [
          {
            result: "ok",
            conditions: [
              {
                data: "field3",
                operator: "greaterOrEqual",
                value: 0,
              },
            ],
            icon: "Done",
          },
          {
            result: "ko",
            conditions: [
              {
                data: "field3",
                operator: "less",
                value: 0,
              },
            ],
            icon: "Clear",
          },
        ],
      },
      {
        alias: "field4",
        label: "ccu-battery-current-label",
        data: "-2 V",
        rules: [
          {
            result: "ok",
            conditions: [
              {
                data: "field4",
                operator: "less",
                value: 0,
              },
            ],
            icon: "Done",
          },
          {
            result: "ko",
            conditions: [
              {
                data: "field4",
                operator: "less",
                value: 0,
              },
            ],
            icon: "Clear",
          },
        ],
      },
    ],
    fieldsOrder: ["field2", "field3", "field1", "field4"],
  },
};
