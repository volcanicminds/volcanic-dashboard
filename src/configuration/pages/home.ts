import { Component } from "@/types";

const home = {
  title: "home-title",
  layout: "Grid",
  components: [
    {
      componentType: "form",
      componentName: "CommonForm",
      title: "home-user-title",
      data: [
        {
          type: "remote",
          dataFields: [
            {
              alias: "first_name",
              data: "data.first_name",
            },
            {
              alias: "last_name",
              data: "data.last_name",
            },
          ],
          config: {
            url: "users/2",
          },
        },
      ],
      inputs: [
        {
          type: "input",
          field: "first_name",
          source: "first_name",
          label: "first_name-label",
          binding: "reqres-users",
          validation: {
            maxLength: 32,
          },
        },
        {
          type: "input",
          field: "last_name",
          source: "last_name",
          label: "last_name-label",
          binding: "reqres-users",
          validation: {
            maxLength: 32,
          },
        },
      ],
    },
  ] as Component[],
};

export default home;
