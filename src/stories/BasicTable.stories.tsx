import type { Meta, StoryObj } from "@storybook/react";
import BasicTable from "@/components/table/BasicTable";

const meta = {
  title: "Components/BasicTable",
  component: BasicTable,
  tags: ["basic", "table"],
} satisfies Meta<typeof BasicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    id: "hp-events-title",
    title: "hp-events-title",
    tableName: "hp-events-title",
    dispatch: () => null,
    dispatchPage: () => null,
    forceComponentReload: () => null,
    configurableEndpoint: async (_args: any) => null,
    configurableEndpointPost: async (_args: any) => null,
    forceComponentReloadByName: () => null,
    forceReload: () => null,
    location: { state: "", key: "", pathname: "", search: "", hash: "" },
    setToken: () => null,
    config: {
      sort: {
        field: "number",
        order: "asc",
      },
    },
    columns: [
      {
        field: "id",
        headerName: "id",
        width: 100,
        showMenu: true,
        sortable: true,
        filterable: true,
      },
      {
        field: "number",
        headerName: "sortable-number",
        width: 100,
        sortable: true,
      },
      {
        field: "date",
        headerName: "timestamp",
        width: 300,
        showMenu: false,
        sortable: true,
        filterable: false,
        formatter: {
          type: "date",
          formatIn: "YYYY-MM-DDTHH:mm:SSZ",
          formatOut: "DD/MM/YYYY",
        },
      },
    ],
    dataFields: [
      {
        data: {
          alias: "1",
          number: 1123,
          date: "2021-10-10T00:00:00Z",
        },
      },
      {
        data: {
          alias: "2",
          number: 121,
          date: "2021-10-11T00:00:00Z",
        },
      },
      {
        data: {
          alias: "3",
          number: 4551,
          date: "2021-10-12T00:00:00Z",
        },
      },
      {
        data: {
          alias: "4",
          number: 1231,
          date: "2021-10-13T00:00:00Z",
        },
      },
    ],
    footer: {
      image: {
        path: "/images/tastiera_radio.svg",
        width: 200,
      },
      legenda: [
        {
          color: "#06b200",
          label: "ci-open",
        },
        {
          color: "#09ff00",
          label: "ci-open-memory",
        },
        {
          color: "#ff0000",
          label: "ci-alarm",
        },
        {
          color: "#ffc901",
          label: "ci-tamper",
        },
        {
          color: "#2793db",
          label: "ci-excluded",
        },
        {
          color: "#8401ff",
          label: "ci-inhibited",
        },
        {
          color: "#ffffff",
          label: "ci-closed",
        },
        {
          color: "#ff7900",
          label: "ci-blinding",
        },
        {
          color: "#7f7f7f",
          label: "ci-tamper",
          withNote: true,
        },
      ],
      notes: ["tamper-note"],
    },
  },
};
