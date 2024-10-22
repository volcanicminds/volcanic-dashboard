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
    {
      componentType: "card",
      componentName: "Alerts",
      title: "alerts-title",
      data: [
        {
          type: "static",
          dataFields: [
            {
              alias: "Events",
              data: [
                {
                  ok: true,
                  text: "event ok",
                },
                {
                  ok: false,
                  text: "event not ok",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      componentType: "card",
      componentName: "ConnectivityList",
      title: "connectivity-list-title",
      data: [
        {
          type: "static",
          dataFields: [
            {
              alias: "ethernet",
              data: true,
              label: "ethernet-label",
              rules: [
                {
                  icon: "Cable",
                  conditions: [
                    {
                      data: "ethernet",
                      operator: "equal",
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              alias: "wifi",
              data: true,
              label: "wifi",
              rules: [
                {
                  icon: "Wifi",
                  conditions: [
                    {
                      data: "wifi",
                      operator: "equal",
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              alias: "IS4G",
              data: true,
              label: "4g",
              rules: [
                {
                  icon: "FourGMobiledata",
                  conditions: [
                    {
                      data: "IS4G",
                      operator: "equal",
                      value: true,
                    },
                  ],
                },
                {
                  icon: "EMobiledata",
                  conditions: [
                    {
                      data: "IS4G",
                      operator: "equal",
                      value: false,
                    },
                  ],
                },
              ],
            },
            {
              alias: "cloud",
              data: false,
              rules: [
                {
                  icon: "CloudQueue",
                  conditions: [
                    {
                      data: "cloud",
                      operator: "equal",
                      value: true,
                    },
                  ],
                },
                {
                  icon: "CloudOff",
                  conditions: [
                    {
                      data: "cloud",
                      operator: "equal",
                      value: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ] as Component[],
};

export default home;
