import type { Meta, StoryObj } from "@storybook/react";
import StatusDisplayLed from "@/components/card/StatusDisplayLed";

const meta = {
  title: "Components/StatusDisplayLed",
  component: StatusDisplayLed,
  tags: ["basic", "component", "entral-unit"],
} satisfies Meta<typeof StatusDisplayLed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      {
        alias: "field1",
        label: "ccu-central-tamper-label",
        data: "OPEN",
        rules: [
          {
            result: "#06b200",
            conditions: [
              {
                data: "field1",
                operator: "equal",
                value: "OPEN",
              },
            ],
          },
          {
            result: "#ffc901",
            conditions: [
              {
                data: "field1",
                operator: "equal",
                value: "TAMPER-OPEN",
              },
            ],
          },
          {
            result: "#2793db",
            conditions: [
              {
                data: "field1",
                operator: "equal",
                value: "EXCLUDED",
              },
            ],
          },
          {
            result: "#8401ff",
            conditions: [
              {
                data: "field1",
                operator: "equal",
                value: "INHIBITED",
              },
            ],
          },
          {
            result: "#ffffff",
            conditions: [
              {
                data: "field1",
                operator: "equal",
                value: "CLOSE",
              },
            ],
          },
          {
            result: "#7f7f7f",
            conditions: [
              {
                data: "field1",
                operator: "notIn",
                value: [
                  "OPEN",
                  "TAMPER-OPEN",
                  "EXCLUDED",
                  "INHIBITED",
                  "CLOSE",
                ],
              },
            ],
          },
        ],
      },
      {
        alias: "field2",
        label: "ccu-maintenance-dip1-label",
        data: "TAMPER-OPEN",
        rules: [
          {
            result: "#06b200",
            conditions: [
              {
                data: "field2",
                operator: "equal",
                value: "OPEN",
              },
            ],
          },
          {
            result: "#ffc901",
            conditions: [
              {
                data: "field2",
                operator: "equal",
                value: "TAMPER-OPEN",
              },
            ],
          },
          {
            result: "#2793db",
            conditions: [
              {
                data: "field2",
                operator: "equal",
                value: "EXCLUDED",
              },
            ],
          },
          {
            result: "#8401ff",
            conditions: [
              {
                data: "field2",
                operator: "equal",
                value: "INHIBITED",
              },
            ],
          },
          {
            result: "#ffffff",
            conditions: [
              {
                data: "field2",
                operator: "equal",
                value: "CLOSE",
              },
            ],
          },
          {
            result: "#7f7f7f",
            conditions: [
              {
                data: "field2",
                operator: "notIn",
                value: [
                  "OPEN",
                  "TAMPER-OPEN",
                  "EXCLUDED",
                  "INHIBITED",
                  "CLOSE",
                ],
              },
            ],
          },
        ],
      },
      {
        alias: "field3",
        label: "ccu-sabotage-label",
        data: "TEST",
        rules: [
          {
            result: "#06b200",
            conditions: [
              {
                data: "field3",
                operator: "equal",
                value: "OPEN",
              },
            ],
          },
          {
            result: "#ffc901",
            conditions: [
              {
                data: "field3",
                operator: "equal",
                value: "TAMPER-OPEN",
              },
            ],
          },
          {
            result: "#2793db",
            conditions: [
              {
                data: "field3",
                operator: "equal",
                value: "EXCLUDED",
              },
            ],
          },
          {
            result: "#8401ff",
            conditions: [
              {
                data: "field3",
                operator: "equal",
                value: "INHIBITED",
              },
            ],
          },
          {
            result: "#ffffff",
            conditions: [
              {
                data: "field3",
                operator: "equal",
                value: "CLOSE",
              },
            ],
          },
          {
            result: "#7f7f7f",
            conditions: [
              {
                data: "field3",
                operator: "notIn",
                value: [
                  "OPEN",
                  "TAMPER-OPEN",
                  "EXCLUDED",
                  "INHIBITED",
                  "CLOSE",
                ],
              },
            ],
          },
        ],
      },
    ],
    fieldsOrder: ["field2", "field3", "field1", "field4"],
  },
};
