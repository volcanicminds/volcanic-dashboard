import { Component } from "@/types";

const inputs = {
  title: "tables",
  layout: "Stack",
  components: [
    {
      componentType: "table",
      componentName: "BasicTable",
      title: "tables-title",
      tableName: "disney-characters",
      data: [
        {
          type: "remote",
          dataFields: [{ alias: "disney-characters", data: "data" }],
          config: {
            url: "character",
          },
        },
      ],
      columns: [
        {
          field: "name",
          headerName: "table-name",
        },
        {
          field: "films",
          headerName: "table-films",
          formatter: {
            type: "custom",
            renderFunction: (cell: any = []) => {
              return cell.join(", ");
            },
            renderForPrint: (cell: any = []) => {
              return cell.join(", ");
            },
          },
        },
      ],
      features: {
        exportCsv: true,
        exportPdf: true,
        refresh: false,
        form: {
          title: [
            {
              type: "field", // or translationId
              value: "name",
            },
          ],
          inputs: [
            {
              type: "input",
              field: "name",
              label: "name-label",
              validation: {
                maxLength: 32,
              },
            },
            {
              type: "input",
              field: "films",
              label: "films-label",
              remapper: {
                in: (value: string[] = []) => (value || []).join(", "),
                out: (value: string = "") => (value || "").split(", "),
              },
            },
          ],
        },
      },
    },
  ] as Component[],
};

export default inputs;
