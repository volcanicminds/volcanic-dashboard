import type { Meta, StoryObj } from "@storybook/react";
import Scheduler from "@/components/table/Scheduler";

const meta = {
  title: "Components/Scheduler",
  component: Scheduler,
  tags: ["basic", "scheduler"],
} satisfies Meta<typeof Scheduler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    id: "Scheduler",
    title: "Scheduler",
    tableName: "Scheduler",
    forceComponentReload: () => {},
    forceComponentReloadByName: () => {},
    configurableEndpoint: async (_args: any) => {},
    configurableEndpointPost: async (
      _url: string,
      _data?: any,
      _config?: any
    ) => {},
    forceReload: () => {},
    location: { state: "", key: "", pathname: "", search: "", hash: "" },
    dispatch: () => {},
    columns: [
      {
        field: "DT_RowId",
        headerName: "Id",
        hidden: true,
      },
      {
        field: "number",
        headerName: "sch-prg-number",
        sortable: true,
      },
      {
        field: "enabled",
        headerName: "sch-prg-hc",
        formatter: {
          type: "boolean",
        },
      },
      {
        field: "description",
        headerName: "sch-prg-description",
      },
    ],
    dataFields: [
      {
        data: [
          {
            data: {
              DT_RowId: "0",
              number: "1",
              enabled: "0",
              description: "...",
              timestamp: "2024-05-28 14:47:01",
            },
          },
          {
            data: {
              DT_RowId: "1",
              number: "2",
              enabled: "0",
              description: "...",
              timestamp: "2024-05-28 14:47:01",
            },
          },
          {
            data: {
              DT_RowId: "2",
              number: "3",
              enabled: "0",
              description: "...",
              timestamp: "2024-05-28 14:47:01",
            },
          },
        ],
      },
    ],
    inputs: [
      {
        type: "switch",
        dataType: "checkbox",
        field: "enabled",
        source: "enabled",
        label: "sch-prg-hc",
        remapper: {
          in: {
            "0": false,
            "1": true,
          },
          out: {
            false: "0",
            true: "1",
          },
        },
        binding: "sch-programs",
      },
      {
        type: "input",
        field: "description",
        source: "description",
        label: "sch-prg-description",
        binding: "sch-programs",
      },
    ],
    features: {
      exportCsv: true,
      exportPdf: true,
      refresh: false,
    },
    addNotification: (_message: string, _options?: any) => {},
  },
};
