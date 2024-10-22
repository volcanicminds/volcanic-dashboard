import { Component } from "@/types";

const home = {
  title: "home-title",
  layout: "Stack",
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
    {
      componentType: "card",
      componentName: "IconsList",
      title: "icons-list-title",
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
    {
      componentType: "card",
      componentName: "OptionsCards",
      title: "options-card-title",
      data: [
        {
          type: "static",
          dataFields: [
            {
              alias: "options",
              data: [
                {
                  code: "test",
                  name: "test",
                  subtitle: "test",
                  numericValue: 123,
                  isPrice: false,
                  sections: [
                    {
                      title: "section",
                      chips: ["chip1", "chip2"],
                    },
                  ],
                },
                {
                  code: "test2",
                  name: "test2",
                  subtitle: "test2",
                  numericValue: 321,
                  isPrice: false,
                  sections: [
                    {
                      title: "section",
                      chips: ["chip1", "chip2"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      componentType: "card",
      componentName: "ProgressBars",
      title: "progress-bars-card-title",
      data: [
        {
          type: "static",
          dataFields: [
            {
              alias: "options",
              data: [
                {
                  value: 33,
                  label: "value 1",
                },
                {
                  value: 25,
                  label: "value 2",
                },
                {
                  value: 42,
                  label: "value 2",
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
