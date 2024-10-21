export type DataFieldRemapper = (data: any, rootKey: string) => any[];

export type Primitive = string | number | boolean;

type Config = {
  url: string;
  params?: {
    [key: string]: Primitive | null;
  };
  polling?: {
    interval: number;
  };
};

// PAGE
export type PageDataField = {
  //The context might be here or inside the PageData for global context or both
  context?: string;
  data: Primitive | object | any[];
  remapper?: DataFieldRemapper;
};
export interface PageData {
  //The context might be here or inside the PageDataField for single data context or both
  context?: string;
  type: "remote" | "static";
  dataFields: PageDataField[];
  config?: Config;
}
export interface PageConfiguration {
  title: string;
  layout: string; //it can be "Columns" or "Grid" or "Stack"
  layoutProps?: any;
  data?: PageData[];
  components: Component[];
}

//COMPONENT
export type DataField = {
  /*
  The "alias" field is:
   - used to remap internally the data for the component in the form of {[alias]: data}
   - given to the remapper function as rootKey parameter as default
   - used to check the visibilità of the component
   - used to populate the fieldsOrder field
   - validate the rules
   - in some specific custom components as fallback data or for internal logic
   - for the form, to find the timestamp field
   - for the form, to map the inputs default values
  */
  alias: string;
  data: Primitive | object | any[];
  remapper?: DataFieldRemapper;
  timestamp?: string;
  label?: string; //This string will be passed to the translation function
  icon?: string;
  rules?: Rule[] | ((fields: string) => Rule[]);
};
export type Condition = {
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
};
export type Rule = {
  conditions: Condition[];
  icon?: string;
  additionalIcon?: string;
  result?: "ok" | "ko" | string;
  resultLabel?: string;
  tooltip?: string;
};
export interface Data {
  type: "remote" | "static" | "context";
  dataFields: DataField[];
  config: Config;
}
export type TableCellRemapper = {
  [key: string]: Primitive;
};
export type ColumnHidden = boolean | ((commonData: any) => boolean);
export type ColumnCellFormatter = {
  type:
    | "text"
    | "date"
    | "number"
    | "boolean"
    | "bulletNumbers"
    | "image"
    | "scenarios"
    | "context"
    | "translationLabel"
    | "fromList"
    | "custom";
  list?: SelectOption[];
  rootLabel?: string;
  context?: string;
  formatIn?: string;
  formatOut?: string;
  remapper?: TableCellRemapper;
  renderFunction?: (
    cell: any,
    row: any,
    tools: {
      t: (key: string) => string;
      get: (object: any, path: string) => any;
      commonData: any;
      tableIdField: string;
      configurableEndpoint: (path: string, args?: any) => Promise<any>;
      addNotification: (message: string, options?: any) => any;
      refreshTable: () => void;
    }
  ) => any;
  renderForPrint?: (
    cell: any,
    row: any,
    tools: {
      t: (key: string) => string;
      get: (object: any, path: string) => any;
      commonData: any;
      tableIdField: string;
    }
  ) => Primitive;
};
export type ConfigColumn = {
  field: string;
  headerName?: string;
  hidden?: ColumnHidden;
  hiddenFromPrint?: ColumnHidden;
  width?: number;
  showMenu?: boolean;
  sortable?: boolean;
  sortingFn?: (rowA: any, rowB: any, columnId: string) => number;
  filterable?: boolean;
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
    | "checkbox";
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
    | "inNumberRange";
  filterSelectOptions?: string[] | { label: string; value: string }[];
  formatter?: ColumnCellFormatter;
};
export type FormInputRemapperFunction = (
  cell: any,
  values: any,
  tools: {
    t: (key: string) => string;
    get: (object: any, path: string) => any;
    commonData: any;
  }
) => FormInputRemapperObject | Primitive;
export type FormInputRemapperObjectWithTranslate = FormInputRemapperObject & {
  translate?: boolean;
};
export type FormInputRemapperObject = {
  [key: string]: Primitive;
};
export type FormInputRemapper = {
  in: FormInputRemapperFunction | FormInputRemapperObjectWithTranslate;
  out: FormInputRemapperFunction | FormInputRemapperObject;
  encodeUri?: boolean;
};
export type SelectOption = {
  value: Primitive;
  label?: string;
  translationId?: string;
};
export type BindingFunctionArgs = {
  data: any;
  inputConfig: FormInput | TableFormInput;
  record: any;
  field: string;
  value: string;
  setFormValue: any;
  configurableEndpoint: (
    path: string,
    args: any,
    options?: any
  ) => Promise<any>;
};
export type FormInputValidationMinMaxField =
  | number
  | ((row: any, contextData: any) => number);
export type FormInputValidation = {
  min?: FormInputValidationMinMaxField;
  max?: FormInputValidationMinMaxField;
  minLength?: FormInputValidationMinMaxField;
  maxLength?: FormInputValidationMinMaxField;
  special?: "phone" | "hex";
  regex?: RegExp;
  required?: boolean;
  error?: string;
};
export type EnablingFieldTypeConfig = {
  t: (key: string) => string;
  commonData: any;
  get: (object: any, path: string) => any;
  remapValue: (
    remapper: FormInputRemapperObject,
    value: Primitive
  ) => Primitive;
};
export type EnablingFieldType =
  | boolean
  | ((
      values: any,
      inputs: FormInputs | TableFormInputs,
      config: EnablingFieldTypeConfig
    ) => boolean);
export type FormInput = {
  type: string;
  dataType?: any & "array";
  field: string;
  label: string;
  source: string;
  visible?: EnablingFieldType;
  disabled?: EnablingFieldType;
  alert?: {
    condition: EnablingFieldType;
    severity: "error" | "warning" | "info" | "success";
    message: string;
  };
  requiredConfirmation?: boolean | ((value: Primitive, values: any) => boolean);
  requiredConfirmationContentId?: string;
  binding: string | ((arg: BindingFunctionArgs) => void);
  defaultValue?: Primitive;
  remapper?: FormInputRemapper;
  options?:
    | string
    | SelectOption[]
    | ((
        values: any,
        tools: { t: (key: string) => string; commonData: any }
      ) => SelectOption[]);
  additionalOptions?: SelectOption[];
  validation?: FormInputValidation;
  grid?: {
    xs: number;
    sm?: number;
    md: number;
    lg?: number;
  };
  features?: {
    withAudioIcon?: boolean;
  };
};
export type FormInputs = FormInput[];
export type TableFormInput = {
  type: string;
  dataType?: any;
  field: string;
  label: string;
  visible?: EnablingFieldType;
  disabled?: EnablingFieldType;
  alert?: {
    condition: EnablingFieldType;
    severity: "error" | "warning" | "info" | "success";
    message: string;
  };
  requiredConfirmation?: boolean | ((value: Primitive, values: any) => boolean);
  requiredConfirmationContentId?: string;
  binding?: (arg: BindingFunctionArgs) => void;
  defaultValue?: Primitive;
  remapper?: FormInputRemapper;
  options?:
    | string
    | SelectOption[]
    | ((
        values: any,
        tools: { t: (key: string) => string; commonData: any }
      ) => SelectOption[]);
  additionalOptions?: SelectOption[];
  validation?: FormInputValidation;
  grid?: {
    xs: number;
    sm?: number;
    md: number;
    lg?: number;
  };
  features?: {
    withAudioIcon?: boolean;
  };
};
export type TableFormInputs = TableFormInput[];
export type TableFooterLegenda = {
  color: string;
  label: string;
  withNote?: boolean;
};
export type ComponentFooter = {
  image?: {
    path: string;
    width: number;
  };
  legenda?: TableFooterLegenda[];
  notes?: string[];
};
export type DefaultConfig = {
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  hiding?: {
    enabled?: boolean;
  };
  pagination?: {
    enabled?: boolean;
    pageIndex?: number;
    pageSize?: number;
  };
  filtering?: {
    enableGlobalFilter?: boolean;
    manual?: boolean;
    onColumnFiltersChange?: any;
  };
};

export type FormFooter = {
  images: [
    {
      image?: {
        path: string;
        width: number;
      };
      conditions?: Condition[];
    },
  ];
};

export type TableForm = {
  title: {
    type: "field" | "translationId";
    value: string;
  }[];
  inputs: TableFormInputs;
  footer?: FormFooter;
};
export type TableFeatures = {
  actions?: {
    positionActionsColumn?: "first" | "last";
    withDelete?: boolean;
    custom?: (args: any) => any;
  };
  add?: boolean;
  form?: TableForm;
  exportCsv?: boolean;
  exportPdf?: boolean;
  refresh?: boolean;
  refreshComponentOnSave?: string;
};
export type TableTimestamp = {
  field: string;
  format: "DD/MM/YYYY HH:mm:ss";
  delay?: number;
};
export interface Component {
  componentType: string;
  componentName: string;
  formWriteToContext?: boolean; //For the form, data from the form will be stored in the page context
  "data-column"?: number;
  title: string;
  data?: Data[];
  //It's a list of aliases
  fieldsOrder?: string[];
  qrCodeFieldId?: string;
  firmwareFieldId?: string;
  firmwareFieldToAttach?: string;
  visible?: Condition[];
  features?: TableFeatures;
  footer?: ComponentFooter | FormFooter;
  config?: DefaultConfig;
  timestamp?: TableTimestamp;
  columns?: ConfigColumn[];
  formId?: string;
  inputs?: FormInputs;
  tableIdField?: string;
  tableName?: string;
}
