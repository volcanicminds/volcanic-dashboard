import { Component } from "@/types";

const green = "#06b201";
const purple = "#8401fe";
const white = "#ffffff";
const gray = "#7f7f7e";
const lightBlue = "#2793dd";

const rules = (field: string) => [
  {
    result: green,
    conditions: [
      {
        data: field,
        operator: "equal",
        value: "OPEN",
      },
    ],
  },
  {
    result: lightBlue,
    conditions: [
      {
        data: field,
        operator: "equal",
        value: "EXCLUDED",
      },
    ],
  },
  {
    result: purple,
    conditions: [
      {
        data: field,
        operator: "equal",
        value: "INHIBITED",
      },
    ],
  },
  {
    result: white,
    conditions: [
      {
        data: field,
        operator: "equal",
        value: "CLOSE",
      },
    ],
  },
  {
    result: gray,
    conditions: [
      {
        data: field,
        operator: "notIn",
        value: ["OPEN", "EXCLUDED", "INHIBITED", "CLOSE"],
      },
    ],
  },
];

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
    {
      componentType: "card",
      componentName: "StatusDisplay",
      title: "status-display-card-title",
      data: [
        {
          type: "static",
          dataFields: [
            {
              data: true,
              alias: "Ethernet",
              label: "ethernet-status",
              rules: [
                {
                  result: "ko",
                  resultLabel: "not-connected",
                  conditions: [
                    {
                      data: "Ethernet",
                      operator: "equal",
                      value: false,
                    },
                  ],
                },
                {
                  result: "ok",
                  resultLabel: "connected",
                  conditions: [
                    {
                      data: "Ethernet",
                      operator: "equal",
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              data: true,
              alias: "Wifi",
              label: "wifi-status",
              rules: [
                {
                  result: "ko",
                  resultLabel: "not-connected",
                  conditions: [
                    {
                      data: "Wifi",
                      operator: "equal",
                      value: false,
                    },
                  ],
                },
                {
                  result: "ok",
                  resultLabel: "connected",
                  conditions: [
                    {
                      data: "Wifi",
                      operator: "equal",
                      value: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      fieldsOrder: ["Wifi", "Ethernet"],
    },
    {
      componentType: "card",
      componentName: "StatusDisplayLed",
      title: "cases-title",
      data: [
        {
          type: "static",
          dataFields: [
            {
              data: "OPEN",
              alias: "case1",
              label: "case1-label",
              rules,
            },
            {
              data: "EXCLUDED",
              alias: "case2",
              label: "case2-label",
              rules,
            },
            {
              data: "INHIBITED",
              alias: "case3",
              label: "case3-label",
              rules,
            },
            {
              data: "CLOSE",
              alias: "case4",
              label: "case4-label",
              rules,
            },
          ],
        },
      ],
      fieldsOrder: ["TamperInput", "dip1sw", "SabInput", "usbextTamperStatus"],
    },
  ] as Component[],
};

export default home;
