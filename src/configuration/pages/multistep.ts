import { Component } from "@/types";

const MultiStep = {
  title: "multistep-title",
  layout: "MultiStep",
  layoutProps: {
    path: "/multistep",
    steps: [
      {
        id: 1,
        title: "step1",
      },
      {
        id: 2,
        title: "step2",
      },
      {
        id: 3,
        title: "step3",
      },
    ],
  },
  components: [
    {
      stepId: 1,
      componentType: "form",
      componentName: "CommonForm",
      title: "step1",
      data: [
        {
          type: "remote",
          dataFields: [
            {
              alias: "first_name",
              data: "data.first_name",
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
          label: "first-name-label",
          binding: "reqres-users",
          validation: {
            maxLength: 32,
          },
        },
      ],
    },
    {
      stepId: 2,
      componentType: "form",
      componentName: "CommonForm",
      title: "step2",
      data: [
        {
          type: "remote",
          dataFields: [
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
          field: "last_name",
          source: "last_name",
          label: "last-name-label",
          binding: "reqres-users",
          validation: {
            maxLength: 32,
          },
        },
      ],
    },
    {
      stepId: 3,
      componentType: "form",
      componentName: "CommonForm",
      title: "step3",
      data: [
        {
          type: "remote",
          dataFields: [
            {
              alias: "avatar",
              data: "data.avatar",
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
          field: "avatar",
          source: "avatar",
          label: "avatar-label",
          binding: "reqres-users",
        },
      ],
    },
  ] as Component[],
};

export default MultiStep;
