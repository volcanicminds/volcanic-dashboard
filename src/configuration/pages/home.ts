import { Component } from "@/types";

const home = {
  title: "home-title",
  layout: "Grid",
  components: [
    {
      componentType: "form",
      componentName: "CommonForm",
      title: "home-character-title",
      formWriteToContext: false,
      formId: "factsForm",
      data: [
        {
          type: "remote",
          dataFields: [
            {
              alias: "name",
              data: "data.name",
            },
            {
              alias: "films",
              data: "data.films",
            },
          ],
          config: {
            url: "character/308",
          },
        },
      ],
      inputs: [
        {
          type: "input",
          field: "name",
          source: "name",
          label: "name-label",
          binding: "disney-characters",
          validation: {
            maxLength: 32,
          },
        },
        {
          type: "multiselect",
          dataType: "array",
          field: "films",
          label: "films-label",
          source: "films",
          options: [
            {
              value: "Tangled",
              label: "Tangled",
            },
            {
              value: "Tangled: Before Ever After",
              label: "Tangled: Before Ever After",
            },
            {
              value: "another",
              label: "another",
            },
          ],
          binding: "disney-characters",
        },
      ],
    },
  ] as Component[],
};

export default home;
