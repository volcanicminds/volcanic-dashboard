# Volcanic Dashboard

## Navigation

Inside the _configuration_ folder you can create new pages inside the "src/pages" folder. Every page, to be rendered inside the webapp, must be imported into the "src/navigation.ts" file, which describes the routing of the application.
The navigation schema is:

```ts
const navigation: Array<NavigationNode | NavigationLeaf>;

interface NavigationNode {
  id: string; //The translation id to show the node label into the sidebar
  path: string; //The middle path name to reach the inner pages
  subItems: Array<NavigationNode | NavigationLeaf>; //The list of NavigationLeaf elements
  icon?: string; //An optional MUI Icon name can be added here
}
interface NavigationLeaf {
  id: string; //The translation id to show the page label into the sidebar
  path: string; //The url path for the single page
  config: any; //The react component page
  icon?: string; //An optional MUI Icon name can be added here
}
```

The "navigation" object could be an array of "NavigationNode" or "NavigationLeaf".
For example:

```ts
[
  {
    id: "NodoHome",
    path: "",
    config: homeConfig,
  },
  {
    id: "NodoConfigurazione",
    path: "configuration",
    subItems: [
      {
        id: "navigation.busPeripherals",
        path: "bus-peripherals",
        config: busPeripheralsConfig,
      },
    ],
  },
];
```

## Localization

Since the project is translated the fields that describe text to be shown to the user should be considered as translation id passed to the i18next translation library.
The translation are placed in the main module, under the "src/lang" folder, inside the configuration module, in the "src/lang" folder.
The priority order is _configuration module_ -> _main module_.

## Page

Below there is the structure of the page configuration schema, described as a typescript type.

```ts
{
  title: string; //To be shown as the component title
  layout: string; //it can be "Columns" or "Grid" or "Stack"
  layoutProps?: any;
  data?: {
    //The context might be here or inside the PageDataField for single data context or both
    context?: string;
    type: "remote" | "static";
    dataFields: {
      //The context might be here or inside the PageData for global context or both
      context?: string;
      data: Primitive | object | any[];
      remapper?: (data: any, rootKey: string) => any[];
    };
    [];
    config?: {
      url: string;
      params?: {
        [key: string]: string | number | boolean | null;
      };
      polling?: {
        interval: number;
      };
    };
  }[];
  components: Component[];
};

```

The "layoutProps" field could be filled with these structures, which will be taken into consideration depending on the "layout" field value.

```ts
[...]
gridDimensions: [
      {
        xs: 12,
        md: 6,
        xl: 6,
      },
    ],
gridSpacing: 3
[...]
spacing: 2
[...]
```

The "page.tsx" engine file can be configured to set a layout for the page, to list the inner components and to get the remote data, even with polling. The data that is get with the remote calls is stored into the page context, into the "CONTEXT_FIELD" object. The "context" field can be defined both in the "data" field, to store the whole response or inside the "dataField" to store just a single value.
It is possible to remap the incoming data defining a custom function so that the "context" value is stored in the page context already transformed.

## The Data Field

The Data field, used both inside the pages and components configurations, is the description of how to get the data to be used as page context or inside a component.
The "config" object contains the main "url" of the remote endpoint, but take into consideration that the complete url is created based on the _VITE_API_BASE_URL_ and _VITE_API_BASE_PATH_ chain together. The "params" object is the map of the params and their value. To create a param without any value, just set _name:null_ . The polling object sets the polling for that data source, the interval is in ms, define the object if you want the enpoint to have this behavior.
The "dataFields" is an array of fields to be taken from the enpoint, so that you can map into the page context only the fields you need.
For the component configuration you have no "context" field, but there is the "alias" field that is used as a component internal reference to that value.

## Component

Below there is the structure of the component configuration schema, described as a typescript type.

```ts
{
  componentType: string;
  componentName: string;
  formWriteToContext?: boolean; //For the form, data from the form will be stored in the page context
  "data-column"?: number; //Used by the "column" paage layout
  title: string; //To be shown as the component title
  data?: {
    type: "remote" | "static" | "context";
    dataFields: {
      alias: string;
      data: Primitive | object | any[];
      remapper?: (data: any, rootKey: string) => any[];
      timestamp?: string;
      label?: string; //This string will be passed to the translation function
      icon?: string; //Can be filled with the name of MUI icon or with a template string like: "SignalCellularConnectedNoInternet${GSM_RXLEV}Bar"
      rules?: Rule[] | ((fields: string) => Rule[]);
    }[];
    config: {
      url: string;
      params?: {
        [key: string]: string | number | boolean | null;
      };
      polling?: {
        interval: number;
      };
    };
  }[];
  fieldsOrder?: string[]; //The order to show the fields, based on the data alias field and it is used inside the card components
  qrCodeFieldId?: string; //The QR code field to be used to create the QR code into the home page
  firmwareFieldId?: string; //The firmware field to be used into the SystemHome card component
  firmwareFieldToAttach?: string; //It should be valued as the desired alias to attach, to be used into the SystemHome card component
  visible?: {
    data: string;
    operator:
      | "between"
      | "greater"
      | "less"
      | "equal"
      | "notEqual"
      | "greaterOrEqual"
      | "lessOrEqual"
      | "in"
      | "notIn";
    value?: number | boolean | string | number[] | string[] | boolean[];
    value1?: number;
    value2?: number;
  }[]; // The description of the rules to make the visibility of the component dynamically conditional
  features?: {
    actions?: {
      positionActionsColumn?: "first" | "last"; //The position of the buttons or menu to be shown inside the row of the table
      withDelete?: boolean;
      custom?: (args: any) => any; //It lets you configure a custom feature to be shown into the row of the table
    }; // The actions that can be attached to the rows of the table
    add?: boolean;
    form?: {
      title: {
        type: "field" | "translationId";
        value: string;
      }[]; //The title of the edit modal of the row of the table, can be composed of multiple elements
      inputs: {
        type: string; //The input type, it maps the file to pick from the "src/components/form/inputs" folder
        dataType?: any; //The type of the input if different from "text"
        field: string; //The field mapped by the input
        label: string; //The input lable
        visible?: EnablingFieldType; //To hide dynamically the input
        disabled?: EnablingFieldType; //To disable dynamically the input
        binding: ((arg: BindingFunctionArgs) => void); //An optional function that replaces the automatic update of that field to the table
        alert?: {
          condition: EnablingFieldType;
          severity: "error" | "warning" | "info" | "success";
          message: string;
        }; //To show an alert dynamically near the input
        requiredConfirmation?:
          | boolean
          | ((value: string | number | boolean) => boolean); //The required confirmation condition to change the input
        requiredConfirmationContentId?: string; //The id the translation of the content of the confirmation dialog
        defaultValue?: string | number | boolean; //The default value of the input
        remapper?: FormInputRemapper; //To remap the values for the input, both in input and in output
        options?: string | SelectOption[]; //The options of the select input type
        additionalOptions?: SelectOption[]; //Extra custom created options of the select input type
        validation?: {
          min?: FormInputValidationMinMaxField;
          max?: FormInputValidationMinMaxField;
          minLength?: FormInputValidationMinMaxField;
          maxLength?: FormInputValidationMinMaxField;
          special?: "phone" | "hex";
          regex?: RegExp;
          required?: boolean;
          error?: string;
        }; //The validation rules for the inputs
        grid?: {
          xs: number;
          sm?: number;
          md: number;
          lg?: number;
        }; //The grid properties to change the default grid visualization of the form
        features?: {
          withAudioIcon?: boolean; //It show the audio icon next to a text input
        };
      }[]; //The list of the inputs of the edit modal of the row of the table
      footer?: FormFooter; //The footer of the edit modal of the row of the table
    }; //The description  of the forms to edit the rows of the table
    exportCsv?: boolean; //To let the user export the table in csv format
    exportPdf?: boolean; //To let the user export the table in pdf format
    refresh?: boolean; //To force a table refresh
    refreshComponentOnSave?: string; //To refresh another component in case the table data has changed
  }; //The features of the BasicTable
  footer?: ComponentFooter | FormFooter; //The footer for the BasicTable or the CommonForm components
  config?: {
    sort?: {
        field: string;
        order: "asc" | "desc";
    };
    hiding?: {
      enabled?: boolean; //true by default, to hide or show the columns hiding feature of the table
    };
    pagination?: {
        enabled?: boolean; // true by default
        pageIndex?: number;
        pageSize?: number; // 10 by default
    };
    filtering?: {
        enableGlobalFilter?: boolean; //true by default, to hide or show the global filter of the table
        manual?: boolean;
        onColumnFiltersChange?: any;
    };
  }; //The default table configuration for sorting, pagination and filters
  timestamp?: {
    field: string;
    format: "DD/MM/YYYY HH:mm:ss";
    delay?: number;
  }; //The name of the field and format of the timestamp, shown as a tooltip
  columns?: {
    field: string; //The name of the field from the data source
    headerName?: string; //The text to be shown on the header of the column
    hidden?: boolean | ((commonData: any) => boolean); //To hide the column from UI
    hiddenFromPrint?: boolean | ((commonData: any) => boolean); //To hide the column on printing
    width?: number; //The with in pixels of the column
    showMenu?: boolean; //To show the column menu
    sortable?: boolean; //To enable the table to be sortable
    sortingFn?: (rowA: any, rowB: any, columnId: string) => number; //To add a custom sorting function
    filterable?: boolean; //To enable the table to be filterable
    filterVariant?:
      | "text"
      | "autocomplete"
      | "select"
      | "multi-select"
      | "range"
      | "range-slider"
      | "date"
      | "datetime"
      | "date-range"
      | "datetime-range"
      | "time"
      | "time-range"
      | "checkbox"; //The type of filter
    filterFn?:
      | "includesString"
      | "includesStringSensitive"
      | "equalsString"
      | "equalsStringSensitive"
      | "arrIncludes"
      | "arrIncludesAll"
      | "arrIncludesSome"
      | "equals"
      | "weakEquals"
      | "inNumberRange"; //The filter function to apply
    filterSelectOptions?: string[] | { label: string; value: string }[]; //The list of the filter options to show (es: used by the Events page)
    formatter?: {
      type: "text" | "date" | "number" | "boolean" | "fromList"
      | "sectors" | "context" | "translationLabel" | "custom"; //The formatter type, use "custom" to enable the "renderFunction" option
      list?: SelectOption[] //To be used with type "fromList"
      rootLabel?: string; //To be used with type "translationLabel"
      context?: string; //Tobe used with type "context"
      formatIn?: string; //The date format in input
      formatOut?: string;//The date format in output
      remapper?: {
        [key: string]: string | number | boolean;
      }; //A remapper map
      renderFunction?: (
        cell: any,
        row: any,
        tools: {
          t: (key: string) => string;
          get: (object: any, path: string) => any;
          commonData: any;
          tableIdField: string;
          customizableEndpoint: (path: string, args?: any) => Promise<any>;
          addNotification: (message: string, options?: any) => any;
          refreshTable: () => void;
        }
      ) => any; //To use a custom render function to render the cell
      renderForPrint?: (
        cell: any,
        row: any,
        tools: {
          t: (key: string) => string;
          get: (object: any, path: string) => any;
          commonData: any;
          tableIdField: string;
        }
      ) => Primitive; //An optional function to change the rendered data when the download csv and pdf buttons are pressed
    }; //To define a specific formatter, if not defined is inferred by the field type
  }[]; //The columns configuration for the table
  formId?: string; //To map the form data inside the page context, if enabled
  inputs?: {
    type: string; //The input type, it maps the file to pick from the "src/components/form/inputs" folder
    dataType?: any & "array"; //The type of the input if different from "text"
    field: string; //The field mapped by the input
    label: string; //The input lable
    source: string; //The source value to populate the input, should be mapped to an alias
    visible?: EnablingFieldType; //To hide dynamically the input
    disabled?: EnablingFieldType; //To disable dynamically the input
    alert?: {
      condition: EnablingFieldType;
      severity: "error" | "warning" | "info" | "success";
      message: string;
    }; //To show an alert dynamically near the input
    requiredConfirmation?:
      | boolean
      | ((value: string | number | boolean) => boolean); //The required confirmation condition to change the input
    requiredConfirmationContentId?: string; //The id the translation of the content of the confirmation dialog
    binding: string | ((arg: BindingFunctionArgs) => void); //The source endopoint to map the input back to the source
    defaultValue?: string | number | boolean; //The default value of the input
    remapper?: FormInputRemapper; //To remap the values for the input, both in input and in output
    options?: string | SelectOption[] | ((
        values: any,
        {tools: { t: (key: string) => string; commonData: any } //The options of the select input type
    additionalOptions?: SelectOption[]; //Extra custom created options of the select input type
    validation?: {
        min?: FormInputValidationMinMaxField;
        max?: FormInputValidationMinMaxField;
        minLength?: FormInputValidationMinMaxField;
        maxLength?: FormInputValidationMinMaxField;
        special?: "phone" | "hex";
        regex?: RegExp;
        required?: boolean;
        error?: string;
    }; //The validation rules for the inputs
    grid?: {
      xs: number;
      sm?: number;
      md: number;
      lg?: number;
    }; //The grid properties to change the default grid visualization of the form
    features?: {
      withAudioIcon?: boolean; //It show the audio icon next to a text input
    };
  }[]; //The definition of the CommonForm inputs if inside a page form.
  tableIdField?: string; //The id field to be used inside a table, if different from the one defined into the env file.
  tableName?: string; //The name of the table, used by the CommonForm to bind the inputs changed values back to the source. If you want to
                      //use the form to edit the BasicTables, the fields tableName and the alias inside the component's data item must be the same
};

//Here the types that are cited above, the complete type file for the configuration is inside the file index.d.ts inside the types repository
type Primitive = string | number | boolean;
type EnablingFieldType =
  | boolean
  | ((
      values: any,
      inputs: FormInputs | TableFormInputs, //The form input definition as described above
      config: {
        t: (key: string) => string;
        commonData: any;
        get: (object: any, path: string) => any;
        remapValue: (
          remapper: FormInputRemapperObject, //The remapper static object to remap the values
          value: Primitive
        ) => Primitive;
      };
    ) => boolean);

type FormInputRemapper = { //The remapper object to remap the value coming to the input or after the values has been changed
  in: FormInputRemapperFunction | FormInputRemapperObjectWithTranslate; //It can be a static map or a function
  out: FormInputRemapperFunction | FormInputRemapperObject; //It can be a static map or a function
  encodeUri?: boolean; //To ask the customizableEndpoint inside the file ApiWrapper to not encode the Uri
};
type FormInputRemapperFunction = (
  cell: any,
  values: any,
  tools: {
    t: (key: string) => string;
    get: (object: any, path: string) => any;
    commonData: any;
  }
) => FormInputRemapperObject | Primitive;
type FormInputRemapperObjectWithTranslate = FormInputRemapperObject & {
  translate?: boolean;
};
type FormInputRemapperObject = {
  [key: string]: Primitive;
};
type FormInputValidationMinMaxField =
  | number
  | ((row: any, contextData: any) => number);
type BindingFunctionArgs = { //The function arguments for the binding function if the editing of that input required a custom function
  data: any;
  inputConfig: FormInput | TableFormInput;
  record: any;
  field: string;
  value: string;
  setFormValue: any;
  customizableEndpoint: (
    path: string,
    args: any,
    options?: any
  ) => Promise<any>;
};
type ComponentFooter = {
  image?: { //The image path (from the public folder) and the width in pixels
    path: string;
    width: number;
  };
  legenda?: { //The legenda, created by a colored box and a note (here it is enabled)
    color: string;
    label: string;
    withNote?: boolean;
  }[];
  notes?: string[]; //The notes of the leged, a list of translation ids
};
type FormFooter = { //The form fotter, is is a list of images, with path and width, the condi
  images: [
    {
      image?: {
        path: string;
        width: number;
      };
      conditions?: { //The conditions configuration to show or not the images
        data: string;
        operator:
          | "between"
          | "greater"
          | "less"
          | "equal"
          | "notEqual"
          | "greaterOrEqual"
          | "lessOrEqual"
          | "in"
          | "notIn";
        value?: number | boolean | string | number[] | string[] | boolean[];
        value1?: number;
        value2?: number;
      }[];
    },
  ];
};
type SelectOption = { //The type of the selects, it can have a static label or a translationId as the showed text
  value: Primitive;
  label?: string;
  translationId?: string;
};
```

The "componentType" field mark the folder inside the "src/components" of the main module to select and the "componentName" field marks the name of the file to pick to render the desired component.
You can choose among any file inside the "table", "form", "card" and "feature" folders.

### Forms and input types

A form can be configured about the same way both directly inside of a page or inside of a table. For the page forms you have to add two more fields: "binding" and "source".
The "binding" field specifies the endpoint to save the edited data. The "source" specifies the alias from which the input should be populated.
You can configure these input types, the input component files can be found in the _src/components/form/inputs_ folder

- input: the rendered component is the BasicInput component, the compatible dataTypes are the HTML input types, but the recommended types are "text" (default), "number" and "password"
- switch: the rendered component is the Switch component, the dataType must be valued as "checkbox"
- date: the rendered component is the DatePicker component, the dataType must be valued as "datetime-local"
- time: the rendered component is the TimePicker component, the dataType must be valued as "time"
- date-time: the rendered component is the DateTimePicker component, the dataType must be valued as "datetime-local"
- select: the rendered component is the Select component, the dataType field is not necessary
- multiselect: the rendered component is the Select component, the dataType field must be valued as "array"
- label: the rendered component is the Label component, which is just a static text
- eventsIn: the rendered component is the EventsIn component, the dataType field is not necessary
- sectors: the rendered component is the Sectors component
- contacts: the rendered component is the Contacts component
- set-computer-time: the rendered component is the SetComputerTime component
- set-factory-codes: the rendered component is the SetFactoryCodes component
- konnex-configure: the rendered component is the KonnexConfigure component
- konnex-presence-test: the rendered component is the KonnexPresenceTest component
- set-pin-codes: the rendered component is the SetPinCodes component
- test-touch: the rendered component is the TestTouch component

## Theme Configuration

The themes are configured within the **configuration module**, located inside the `src/themes` folder. After running the commands `yarn dev` or `yarn build`, a prompt will appear, asking the user to choose the desired theme based on the available configurations.

Themes are dynamically imported by the configuration module. Each theme can define its own **images**, **fonts**, and **component customizations** within its respective folder.

### Key Points:

- **Library Used:**  
  This project uses the **MUI library** ([Material UI](https://mui.com/material-ui/getting-started/)). The majority of components, such as buttons, accordions, inputs, etc., come from this library.
- **Theme Structure:**  
  Each theme contains a `baseTheme.ts` file, where the **color palette** is defined. This extends the MUI's built-in **light** and **dark** themes.
- **Typography Settings:**  
  The `typography.ts` file sets the global **fontFamily** as well as the specific fonts for headings (e.g., `h1`, `h2`, etc.).

### Custom Components and Styling

Custom components, as well as MUI components, are styled inside the `src/themes/*theme-name*/components` folder. The styling syntax is **CSS**, with a structure similar to **LESS** or **SASS**, allowing for **nested rules**. The theme object can be referenced to retrieve values like the color palette.

- **CSS Classes:**  
  Most of the classes used follow MUI's default styles, but there may also be custom classes defined within the templates of specific components.

- **Global Styles:**  
  The `CssBaseline` component defines global CSS rules outside of individual components, such as `font-family`, `font-style`, animations, and the styling of the `body` element. Fonts, located in the `src/themes/*theme-name*/fonts` folder, are imported here.
