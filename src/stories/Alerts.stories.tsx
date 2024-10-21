import type { Meta, StoryObj } from "@storybook/react";
import Alerts from "@/components/card/Alerts";

const meta = {
  title: "Components/Alerts",
  component: Alerts,
  tags: ["custom", "component", "home"],
} satisfies Meta<typeof Alerts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Vari alert",
    dataFields: [
      {
        alias: "Events",
        data: [
          {
            category: 4,
            text: "Fault di tipo 1",
          },
          {
            category: 4,
            text: "Fault di tipo 2",
          },
          {
            category: 3,
            text: "Tamper di tipo 1",
          },
        ],
      },
      {
        alias: "isMaintenanceModeActive",
        data: "TRUE",
      },
    ],
  },
};
