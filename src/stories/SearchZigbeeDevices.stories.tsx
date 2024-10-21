import type { Meta, StoryObj } from "@storybook/react";
import SearchZigbeeDevices from "@/components/feature/SearchZigbeeDevices";

const meta = {
  title: "Components/SearchZigbeeDevices",
  component: SearchZigbeeDevices,
  tags: ["custom", "component", "entral-unit"],
} satisfies Meta<typeof SearchZigbeeDevices>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    configurableEndpoint: async (_url: string, _data?: any) => {},
    configurableEndpointPost: async (
      _url: string,
      _data?: any,
      _config?: any
    ) => {},
    forceReload: () => {},
    dataFields: [
      {
        alias: "ZIGBEE",
        data: false,
      },
      {
        alias: "zigbeeEquipped",
        data: "0",
      },
    ],
    forceComponentReload: () => {},
    forceComponentReloadByName: () => {},
    location: {
      state: "",
      key: "",
      pathname: "",
      search: "",
      hash: "",
    },
    dispatch: () => {},
  },
};
