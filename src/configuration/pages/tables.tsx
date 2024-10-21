import { Component } from "@/types";

const inputs = {
  title: "tables",
  layout: "Stack",
  components: [
    {
      componentType: "table",
      componentName: "BasicTable",
      title: "tables-title",
      tableName: "reqres-users",
      data: [
        {
          type: "remote",
          dataFields: [{ alias: "reqres-users", data: "data" }],
          config: {
            url: "users",
          },
        },
      ],
      columns: [
        {
          field: "first_name",
          headerName: "table-name",
        },
        {
          field: "last_name",
          headerName: "table-last-name",
        },
        {
          field: "avatar",
          headerName: "table-avatar",
          formatter: {
            type: "image",
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
              field: "first_name",
              label: "name-label",
              validation: {
                maxLength: 32,
              },
            },
            {
              type: "input",
              field: "last_name",
              label: "last-name-label",
              validation: {
                maxLength: 32,
              },
            },
            {
              type: "input",
              field: "avatar",
              label: "avatar-label",
            },
          ],
        },
      },
    },
  ] as Component[],
};

export default inputs;
