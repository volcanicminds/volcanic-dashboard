import type { Meta, StoryObj } from "@storybook/react";
import SearchOperators from "@/components/card/SearchOperators";

const meta = {
  title: "Components/SearchOperators",
  component: SearchOperators,
  tags: ["custom", "component", "entral-unit"],
} satisfies Meta<typeof SearchOperators>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    id: "my-id",
    commonData: {},
    tableIdField: "DT_RowId",
    dispatch: () => {},
    customizableEndpoint: () => Promise.resolve({}),
    customizableEndpointPost: () => Promise.resolve({}),
    forceReload: () => {},
    forceComponentReloadByName: () => {},
    forceComponentReload: () => {},
    location: {
      state: "",
      key: "",
      pathname: "",
      search: "",
      hash: "",
    },
    tableName: "my-table-name",
    title: "Titolo card",
    dataFields: [
      {
        alias: "online",
        data: false,
      },
      {
        alias: "GSM",
        data: false,
      },
    ],
    columns: [
      {
        field: "DT_RowId",
        headerName: "cm-gsm-number",
        sortable: true,
      },
      {
        field: "description",
        headerName: "cm-gsm-operator",
      },
      {
        field: "signal",
        headerName: "cm-gsm-signal",
      },
    ],
    features: {
      exportCsv: false,
      exportPdf: false,
      refresh: false,
    },
  },
};
