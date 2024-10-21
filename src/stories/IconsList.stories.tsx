import type { Meta, StoryObj } from "@storybook/react";
import IconsList from "@/components/card/IconsList";

const meta = {
  title: "Components/IconsList",
  component: IconsList,
  tags: ["basic", "component", "home"],
} satisfies Meta<typeof IconsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Titolo card",
    dataFields: [
      {
        alias: "field1",
        data: "true",
        rules: [
          {
            result: "ok",
            icon: "Warning",
            conditions: [
              {
                data: "field1",
                operator: "equal",
                value: "true",
              },
            ],
          },
        ],
      },
      {
        alias: "field2",
        data: "true",
        rules: [
          {
            result: "ok",
            icon: "Error",
            conditions: [
              {
                data: "field2",
                operator: "equal",
                value: "true",
              },
            ],
          },
        ],
      },
      {
        alias: "field3",
        data: "true",
        rules: [
          {
            result: "ok",
            icon: "Engineering",
            conditions: [
              {
                data: "field3",
                operator: "equal",
                value: "true",
              },
            ],
          },
        ],
      },
      {
        alias: "field4",
        data: "true",
        rules: [
          {
            result: "ok",
            icon: "PowerSettingsNew",
            conditions: [
              {
                data: "field4",
                operator: "equal",
                value: "true",
              },
            ],
          },
        ],
      },
      {
        alias: "field5",
        data: "true",
        rules: [
          {
            result: "ok",
            icon: "Block",
            conditions: [
              {
                data: "field5",
                operator: "equal",
                value: "true",
              },
            ],
          },
        ],
      },
      {
        alias: "field6",
        data: "true",
        rules: [
          {
            result: "ok",
            icon: "AccessTime",
            conditions: [
              {
                data: "field6",
                operator: "equal",
                value: "true",
              },
            ],
          },
        ],
      },
    ],
    fieldsOrder: ["field2", "field3", "field1", "field4", "field5"],
  },
};
