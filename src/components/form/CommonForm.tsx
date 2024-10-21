import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import {
  Typography,
  Grid,
  MenuItem,
  ThemeProvider,
  Alert,
  Stack,
  Box,
  InputAdornment,
} from "@mui/material";
import Button from "@/components/common/Button";
import { t } from "i18next";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useToast from "@/hook/useToast";
import {
  COMMON_DATA_FIELD,
  DATETIME_LOCAL_FORMAT,
  DEFAULT_ND,
  DEFAULT_THEME_NAME,
} from "@/utils/constants";
import Switch from "@/components/common/form/inputs/Switch";
import Select from "@/components/common/form/inputs/Select";
import BasicInput from "@/components/common/form/inputs/BasicInput";
import SetComputerTime from "@/components/common/form/inputs/SetComputerTime";
import {
  PageContext,
  PageContextInterface,
  PageDataContextType,
} from "@/page/page";
import { remapValue } from "@/utils/config";
import SimpleCard from "@/components/common/SimpleCard";
import { parseDateWithTimezone } from "@/utils/dates";
import dayjs from "dayjs";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Label from "@/components/common/form/inputs/Label";
import { ThemesContext } from "@/themes";
import EventsIn from "@/components/common/form/inputs/EventsIn";
import Sectors from "@/components/common/form/inputs/BulletNumbers";
import { STATUS_FIELD } from "@/components/ApiWrapper";
import Contacts from "@/components/common/form/inputs/Contacts";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {
  DataField,
  EnablingFieldType,
  FormFooter as FormFooterType,
  FormInput,
  FormInputs,
  FormInputValidationMinMaxField,
  SelectOption,
  TableFormInput,
  TableFormInputs,
} from "@/types";
import { AppActions } from "../mainlayout";
import { Location } from "react-router-dom";
import FormFooter from "../common/form/FormFooter";
import TestTouch from "@/components/common/form/inputs/TestTouch";
import DateTimePicker from "@/components/common/form/inputs/DateTimePicker";
import DatePicker from "@/components/common/form/inputs/DatePicker";
import TimePicker from "@/components/common/form/inputs/TimePicker";
import SetPinCodes from "@/components/common/form/inputs/SetPinCodes";
import KonnexConfigure from "@/components/common/form/inputs/KonnexConfigure";
import KonnexPresenceTest from "@/components/common/form/inputs/KonnexPresenceTest";
import CameraTest from "@/components/common/form/inputs/CameraTest";
import CameraConfigure from "@/components/common/form/inputs/CameraConfigure";

const DEFAULT_INPUT_TYPE = "text";
interface FormProps {
  title: string;
  formId: string;
  submit: "blur" | "confirm";
  inputs: FormInputs | TableFormInputs;
  dataFields: DataField[];
  formWriteToContext?: boolean;
  footer?: FormFooterType;
  commonData?: any;
}
//only used for submit confirm
interface TableFormProps {
  tableName?: string;
  rowId?: string;
  refresh?: () => void;
  onConfirm?: () => void;
  onDiscard?: () => void;
  onDelete?: () => void;
  discardLabel?: string;
  confirmLabel?: string;
  deleteLabel?: string;
}
interface CommonProps {
  dispatch: Dispatch<AppActions>;
  customizableEndpoint: (
    path: string,
    args?: any,
    options?: any
  ) => Promise<any>;
  location: Location<any>;
}

function getDefaultValueByType(dataType: HTMLInputTypeAttribute) {
  return dataType === "checkbox"
    ? false
    : dataType === "number"
      ? 0
      : dataType === "array"
        ? []
        : "";
}

function getOptions(
  values: any,
  item: TableFormInput | FormInput,
  contextData: PageDataContextType
) {
  const additionalOptions = item.additionalOptions || [];
  if (Array.isArray(item.options)) {
    return [...(item.options || []), ...additionalOptions];
  } else if (typeof item.options === "string") {
    const contextOptions = contextData[COMMON_DATA_FIELD][item.options] || [];
    const options = [...contextOptions, ...additionalOptions];

    return options.filter((option: any) => option.value !== STATUS_FIELD);
  } else if (typeof item.options === "function") {
    return item.options(values, { t, commonData: contextData });
  }

  return [];
}

function isPhone(value: string) {
  for (let i = 0; i < value.length; i++) {
    let ch = value[i];
    if (ch >= "0" && ch <= "9") continue;
    if (ch == "+") continue;
    return false;
  }

  return true;
}

function isHexadecimal(value: string) {
  for (let i = 0; i < value.length; i++) {
    let ch = value[i];
    if (ch >= "0" && ch <= "9") continue;
    if (ch >= "A" && ch <= "F") continue;
    if (ch >= "a" && ch <= "f") continue;
    return false;
  }

  return value.length > 0;
}

export default function Form({
  title,
  formId,
  submit = "blur",
  inputs = [],
  tableName,
  rowId,
  dataFields: fields = [],
  refresh,
  formWriteToContext = false,
  onConfirm,
  onDiscard,
  onDelete,
  discardLabel,
  confirmLabel,
  deleteLabel,
  commonData,
  dispatch,
  customizableEndpoint,
  location,
  footer,
}: FormProps & TableFormProps & CommonProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    content: string;
    discard: () => void;
    confirm: () => void;
  } | null>(null);
  const { addNotification } = useToast();
  const { data: contextData, setContextData } =
    useContext<PageContextInterface>(PageContext);
  const themes = useContext(ThemesContext);
  const [isSaving, setIsSaving] = useState(false);

  const checkEnabled = (
    defaultValue: boolean,
    field: string,
    item: FormInput | TableFormInput,
    formValues: {
      [x: string]: any;
      [x: number]: any;
    }
  ) => {
    let isEnabled = defaultValue;
    const enablingField = _.get(item, field) as EnablingFieldType;
    if (enablingField != null) {
      if (typeof enablingField === "function") {
        isEnabled = enablingField(formValues || [], inputs || [], {
          t,
          commonData: contextData,
          get: (object: any, path: string) => _.get(object, path),
          remapValue,
        });
      } else {
        isEnabled = enablingField;
      }
    }

    return isEnabled;
  };

  const fieldsData: any = useMemo(() => {
    return fields.reduce((acc, field) => {
      const itemData =
        submit === "confirm" && Array.isArray(field.data)
          ? (field.data || [])[0]
          : { [field.alias]: field.data };
      acc = { ...acc, ...itemData };

      return acc;
    }, {});
  }, [fields]);

  const getDefaultValue = (item: TableFormInput | FormInput) => {
    const defaultValueByType = getDefaultValueByType(
      item.dataType || DEFAULT_INPUT_TYPE
    );

    const source = submit === "blur" ? (item as FormInput).source : item.field;
    return fieldsData[source] != null
      ? fieldsData[source]
      : item.defaultValue != null
        ? item.defaultValue
        : defaultValueByType;
  };

  const getRemappedValues = (item: TableFormInput | FormInput, value: any) => {
    return item.remapper?.in && value != null
      ? typeof item.remapper.in === "function"
        ? item.remapper.in(value, fieldsData, {
            t,
            get: (object: any, path: string) => _.get(object, path),
            commonData,
          })
        : !!item.remapper.in.translate
          ? t(String(remapValue(item.remapper.in, value)))
          : remapValue(item.remapper.in, value)
      : value;
  };

  const defaultValues = useMemo(() => {
    return inputs.reduce(
      (
        acc: { [key: string]: string | number | boolean },
        item: FormInput | TableFormInput
      ) => {
        const defaultValue = getDefaultValue(item);
        const remappedDefaultValue = getRemappedValues(item, defaultValue);

        acc[item.field] = remappedDefaultValue;
        return acc;
      },
      {}
    );
  }, [fieldsData, inputs]);

  const checkIsRequired = (isConfigRequired: boolean, isVisible: boolean) => {
    return isConfigRequired && isVisible;
  };

  function evaluateValidationField(
    validationField: FormInputValidationMinMaxField,
    {
      row,
      context,
    }: {
      row: any;
      context: any;
    }
  ) {
    if (typeof validationField === "function") {
      return validationField(row, context);
    }

    return validationField as number;
  }

  const schemaConfig: { [key: string]: yup.AnySchema } = useMemo(
    () =>
      inputs.reduce(
        (
          acc: { [key: string]: yup.AnySchema },
          item: FormInput | TableFormInput
        ) => {
          acc[item.field] =
            item.dataType === "checkbox"
              ? yup.boolean()
              : item.dataType === "number"
                ? yup.number()
                : item.dataType === "array"
                  ? yup.array()
                  : yup.string();

          acc[item.field] = acc[item.field].test(
            "is-required",
            t("err-empty"),
            (value, context) => {
              const isVisible = checkEnabled(
                true,
                "visible",
                item,
                context.parent
              );

              const isRequired = checkIsRequired(
                !!item.validation?.required,
                isVisible
              );

              return isRequired ? !!value : true;
            }
          );
          if (item.validation?.max != null && item.validation?.min != null) {
            const error = item.validation.error || t("err-invalid-range");
            acc[item.field] = acc[item.field].test(
              "is-between",
              (context) => {
                const max = evaluateValidationField(
                  item.validation?.max != null ? item.validation?.max : -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );
                const min = evaluateValidationField(
                  item.validation?.min != null ? item.validation?.min : -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );

                return `${error} [${min} - ${max}]`;
              },
              (value, context) => {
                const max = evaluateValidationField(
                  item.validation?.max || -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );
                const min = evaluateValidationField(
                  item.validation?.min || -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );
                const isVisible = checkEnabled(
                  true,
                  "visible",
                  item,
                  context.parent
                );
                const isRequired = checkIsRequired(
                  !!item.validation?.required,
                  isVisible
                );
                return isRequired || value !== undefined
                  ? value !== undefined && value >= min && value <= max
                  : true;
              }
            );
          }

          if (item.validation?.maxLength != null) {
            const error = item.validation.error || t("err-invalid-range");
            acc[item.field] = acc[item.field].test(
              "is-max-length",
              (context) => {
                const maxLength = evaluateValidationField(
                  item.validation?.maxLength || -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );

                return `${error} [${maxLength}]`;
              },
              (value, context) => {
                const maxLength = evaluateValidationField(
                  item.validation?.maxLength || -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );
                const isVisible = checkEnabled(
                  true,
                  "visible",
                  item,
                  context.parent
                );
                const isRequired = checkIsRequired(
                  !!item.validation?.required,
                  isVisible
                );
                return isRequired || value !== undefined
                  ? value !== undefined && value.length <= maxLength
                  : true;
              }
            );
          }

          if (item.validation?.minLength != null) {
            const error = item.validation.error || t("err-invalid-range");
            acc[item.field] = acc[item.field].test(
              "is-min-length",
              (context) => {
                const minLength = evaluateValidationField(
                  item.validation?.minLength || -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );

                return `${error} [${minLength}]`;
              },
              (value, context) => {
                const minLength = evaluateValidationField(
                  item.validation?.minLength || -1,
                  {
                    row: context,
                    context: commonData,
                  }
                );
                const isVisible = checkEnabled(
                  true,
                  "visible",
                  item,
                  context.parent
                );
                const isRequired = checkIsRequired(
                  !!item.validation?.required,
                  isVisible
                );
                return isRequired || value !== undefined
                  ? value !== undefined && value.length >= minLength
                  : true;
              }
            );
          }

          if (item.validation?.regex) {
            const regex = item.validation.regex;
            const error = item.validation.error || t("error-regex");
            acc[item.field] = acc[item.field].test(
              "passes-regex",
              error,
              (value, context) => {
                const isVisible = checkEnabled(
                  true,
                  "visible",
                  item,
                  context.parent
                );

                const isRequired = checkIsRequired(
                  !!item.validation?.required,
                  isVisible
                );

                return isRequired || (value !== undefined && value !== "")
                  ? regex.test(value)
                  : true;
              }
            );
          }

          if (item.validation?.special) {
            if (item.validation.special === "phone") {
              acc[item.field] = acc[item.field].test(
                "is-phone",
                t("err-invalid-phone"),
                (value, context) => {
                  const isVisible = checkEnabled(
                    true,
                    "visible",
                    item,
                    context.parent
                  );
                  const isRequired = checkIsRequired(
                    !!item.validation?.required,
                    isVisible
                  );
                  return isRequired || (value !== undefined && value !== "")
                    ? isPhone(value)
                    : true;
                }
              );
            }
            if (item.validation.special === "hex") {
              acc[item.field] = acc[item.field].test(
                "is-hex",
                t("err-invalid-hex"),
                (value, context) => {
                  const isVisible = checkEnabled(
                    true,
                    "visible",
                    item,
                    context.parent
                  );
                  const isRequired = checkIsRequired(
                    !!item.validation?.required,
                    isVisible
                  );
                  return isRequired || (value !== undefined && value !== "")
                    ? isHexadecimal(value)
                    : true;
                }
              );
            }
          }

          return acc;
        },
        {}
      ),
    [inputs]
  );

  const schema: yup.ObjectSchema<
    {
      [x: string]: any;
    },
    yup.AnyObject,
    {
      [x: string]: any;
    },
    ""
  > = yup.object().shape(schemaConfig);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  const values = watch();

  useEffect(() => {
    if (formWriteToContext) {
      const formContextData = contextData[formId];
      const remappedValues = inputs.reduce(
        (
          acc: { [key: string]: string | number | boolean },
          item: FormInput | TableFormInput
        ) => {
          const value = getDefaultValue(item);
          const remappedValue = getRemappedValues(item, value);

          acc[item.field] = remappedValue;
          return acc;
        },
        {}
      );
      const isEqual = _.isEqual(formContextData, remappedValues);

      !isEqual && setContextData({ ...contextData, [formId]: remappedValues });
    }
  }, [inputs]);

  const executeBinding = async ({
    record,
    field,
    value,
    inputConfig,
  }: {
    record: any;
    field: string;
    value: string;
    inputConfig?: FormInput;
  }) => {
    const shouldEncodeUri = getShouldEncodeUri(inputConfig);

    if (typeof inputConfig?.binding === "string") {
      const response = await customizableEndpoint(
        "edit",
        {
          type: inputConfig.binding,
          name: field,
          value,
          DT_RowId: rowId != null ? rowId : 0,
        },
        {
          serialize: shouldEncodeUri,
        }
      );
      if (response.result === "error") {
        addNotification(response.message, { variant: "error" });
        throw new Error(response.message);
      }
    } else if (
      inputConfig?.binding &&
      typeof inputConfig?.binding === "function"
    ) {
      try {
        await inputConfig.binding({
          data: { ...fieldsData, ...contextData[COMMON_DATA_FIELD] },
          inputConfig,
          record,
          field,
          value,
          setFormValue: setValue,
          customizableEndpoint,
        });
      } catch (e: any) {
        addNotification(e, { variant: "error" });
        throw new Error(e);
      }
    } else {
      console.warn("No binding function found for field", field);
    }

    refresh && refresh();

    if (formWriteToContext) {
      const remappedValue = inputConfig
        ? getRemappedValues(inputConfig, value)
        : value;

      setContextData({
        ...contextData,
        [formId]: Object.assign({}, record, { [field]: remappedValue }),
      });
    }
  };

  const executeSave = async (record: any) => {
    try {
      const fieldsToUpdate = _.keys(
        _.pickBy(record, (value, key) => {
          return !_.isEqual(String(value), String(defaultValues[key]));
        })
      );

      await Promise.all(
        fieldsToUpdate.map(async (field) => {
          const inputConfig = inputs.find((input) => input.field === field);
          const value = normalizeValue(record[field], inputConfig);
          const shouldEncodeUri = getShouldEncodeUri(inputConfig);

          if (tableName != null && rowId != null) {
            let response = null;
            if (
              inputConfig?.binding &&
              typeof inputConfig?.binding === "function"
            ) {
              try {
                response = await inputConfig.binding({
                  data: { ...fieldsData, ...contextData[COMMON_DATA_FIELD] },
                  inputConfig,
                  record,
                  field,
                  value,
                  setFormValue: setValue,
                  customizableEndpoint,
                });
              } catch (e: any) {
                addNotification(e, { variant: "error" });
                throw new Error(e);
              }
            } else {
              response = await customizableEndpoint(
                "edit",
                {
                  type: tableName,
                  name: field,
                  value,
                  DT_RowId: rowId,
                },
                {
                  serialize: shouldEncodeUri,
                }
              );
            }

            if (response.result === "error") {
              addNotification(response.message, { variant: "error" });
              throw new Error(response.message);
            }
          } else {
            console.warn("No table name found for field", field);
          }
        })
      );
    } catch (e: any) {
      addNotification(e.message, { variant: "error" });
      throw new Error(e.message);
    }
  };

  const getInputConfigByFieldName = (field: string) => {
    return inputs.find((input) => input.field === field);
  };

  const checkRequiredConfirmation = (
    value: string,
    inputConfig?: FormInput | TableFormInput
  ) => {
    let shoudlRequireConfirmation = false;

    if (
      inputConfig?.requiredConfirmation &&
      typeof inputConfig.requiredConfirmation === "boolean"
    ) {
      shoudlRequireConfirmation = inputConfig.requiredConfirmation;
    } else if (
      inputConfig?.requiredConfirmation &&
      typeof inputConfig.requiredConfirmation === "function"
    ) {
      shoudlRequireConfirmation = inputConfig.requiredConfirmation(
        value,
        values
      );
    }

    return shoudlRequireConfirmation;
  };

  const getShouldEncodeUri = (inputConfig?: FormInput | TableFormInput) => {
    return inputConfig?.remapper?.encodeUri != null
      ? inputConfig.remapper.encodeUri
      : true;
  };

  function getRemappedOutValue(
    value: any,
    inputConfig?: FormInput | TableFormInput
  ) {
    if (inputConfig?.remapper?.out) {
      return typeof inputConfig.remapper.out === "function"
        ? inputConfig.remapper.out(value, values, {
            t,
            get: (object: any, path: string) => _.get(object, path),
            commonData,
          })
        : remapValue(inputConfig.remapper.out, value);
    }
    return value;
  }

  const normalizeValue = (
    value: any,
    inputConfig?: FormInput | TableFormInput
  ) => {
    let remappedValue = getRemappedOutValue(value, inputConfig);

    const shouldEncodeUri = getShouldEncodeUri(inputConfig);

    if (shouldEncodeUri) {
      remappedValue = encodeURIComponent(remappedValue);
    }

    return remappedValue;
  };

  const onSubmit = useCallback((record: any = {}, field?: string) => {
    try {
      const inputConfig = field ? getInputConfigByFieldName(field) : null;

      if (submit === "blur" && inputConfig && field) {
        const value = normalizeValue(record[field], inputConfig);

        let shoudlRequireConfirmation = checkRequiredConfirmation(
          value,
          inputConfig
        );

        if (inputConfig && shoudlRequireConfirmation) {
          setConfirmDialog({
            open: true,
            content: t(inputConfig.requiredConfirmationContentId || ""),
            discard: () => {
              resetField(field);
              setConfirmDialog(null);
            },
            confirm: () => {
              executeBinding({
                record,
                field,
                value,
                inputConfig: inputConfig as FormInput,
              });
              setConfirmDialog(null);
            },
          });
        } else {
          executeBinding({
            record,
            field,
            value,
            inputConfig: inputConfig as FormInput,
          });
        }
      } else if (submit === "confirm") {
        setIsSaving(true);
        executeSave(record)
          .then(() => {
            onConfirm && onConfirm();
          })
          .finally(() => {
            setIsSaving(false);
            refresh && refresh();
          });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleChange = (name: string, value: any) => {
    if (submit === "confirm") {
      const inputConfig = getInputConfigByFieldName(name);
      const normalizedValue = normalizeValue(value, inputConfig);

      let shoudlRequireConfirmation = checkRequiredConfirmation(
        normalizedValue,
        inputConfig
      );

      if (inputConfig && shoudlRequireConfirmation) {
        setConfirmDialog({
          open: true,
          content: t(inputConfig.requiredConfirmationContentId || ""),
          discard: () => {
            resetField(name);
            setConfirmDialog(null);
          },
          confirm: () => {
            setValue(name, value, { shouldDirty: true });
            setConfirmDialog(null);
          },
        });
      } else {
        setValue(name, value, { shouldDirty: true });
      }
    } else if (submit === "blur") {
      setValue(name, value, { shouldDirty: true });
      handleSubmit((record) => onSubmit(record, name))();
    }
  };

  const formTheme = useMemo(() => {
    const themeKey = Object.keys(themes).find((key) =>
      key.includes(submit === "blur" ? "dark" : "light")
    );

    if (themeKey) {
      return themes[themeKey];
    }

    return themes[DEFAULT_THEME_NAME];
  }, [themes, submit]);

  const executeConfirm = () => {
    handleSubmit((record) => onSubmit(record))();
  };

  const Container = useMemo(
    () =>
      ({ children }: { children: React.ReactNode }) => {
        return submit === "blur" ? (
          <SimpleCard
            id={`common-form-${formId}`}
            fullWidth
            title={t(`${title}`)}
            childrenYPadding={5}
          >
            {children}
          </SimpleCard>
        ) : (
          children
        );
      },
    [submit]
  );

  return (
    <>
      <ConfirmDialog
        open={!!confirmDialog?.open}
        content={confirmDialog?.content}
        onDiscard={confirmDialog?.discard || (() => {})}
        onConfirm={confirmDialog?.confirm || (() => {})}
      />
      <Container>
        <form
          noValidate
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <ThemeProvider theme={formTheme || {}}>
            <Grid
              container
              rowSpacing={6}
              columnSpacing={4}
              mb={footer ? 0 : "auto"}
            >
              {inputs.map((item: FormInput | TableFormInput, index) => {
                const timestamp = fields.find(
                  (field) => field.alias === item.field
                )?.timestamp;
                const hasAlert = item.alert?.condition
                  ? checkEnabled(false, "alert.condition", item, values)
                  : false;
                const gridDimensions = item.grid || { xs: 12, md: 6, xl: 4 };
                const isVisible = checkEnabled(true, "visible", item, values);

                return (
                  isVisible && (
                    <Grid
                      key={`common-form-${index}`}
                      item
                      {...gridDimensions}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      {hasAlert && (
                        <Alert severity={item.alert?.severity}>
                          {t(item.alert?.message || "")}
                        </Alert>
                      )}
                      <Controller
                        control={control}
                        render={({ field }) => {
                          let value = field.value;
                          try {
                            value =
                              field.value && item.dataType === "datetime-local"
                                ? dayjs(
                                    parseDateWithTimezone(field.value)
                                  ).format(DATETIME_LOCAL_FORMAT)
                                : field.value;
                          } catch (e) {
                            console.warn(e);
                          }

                          const isDisabled = checkEnabled(
                            false,
                            "disabled",
                            item,
                            values
                          );

                          const isFieldRequired = !!item.validation?.required;

                          switch (item.type) {
                            case "switch":
                              return (
                                <Switch
                                  id={`switch-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  value={value}
                                  label={t(`${item.label}`)}
                                  required={isFieldRequired}
                                  defaultValue={field.value}
                                  onChange={(value) =>
                                    handleChange(field.name, value)
                                  }
                                  color="success"
                                />
                              );
                            case "date":
                              return (
                                <DatePicker
                                  id={`date-picker-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  type={item.dataType || DEFAULT_INPUT_TYPE}
                                  required={isFieldRequired}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                  defaultValue={dayjs(value)}
                                  label={t(`${item.label}`)}
                                  onChange={(value) => {
                                    handleChange(field.name, value);
                                  }}
                                />
                              );
                            case "time":
                              let defaultValue = dayjs(value);

                              if (typeof value === "string") {
                                const [hours, minutes, seconds] = value
                                  .split(":")
                                  .map(Number);

                                defaultValue = dayjs()
                                  .set("hour", hours)
                                  .set("minute", minutes)
                                  .set("second", seconds);
                              }

                              return (
                                <TimePicker
                                  id={`date-time-picker-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  type={item.dataType || DEFAULT_INPUT_TYPE}
                                  required={isFieldRequired}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                  defaultValue={defaultValue}
                                  label={t(`${item.label}`)}
                                  onChange={(value) => {
                                    handleChange(field.name, value);
                                  }}
                                />
                              );
                            case "date-time":
                              return (
                                <DateTimePicker
                                  id={`date-time-picker-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  type={item.dataType || DEFAULT_INPUT_TYPE}
                                  required={isFieldRequired}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                  defaultValue={dayjs(value)}
                                  value={dayjs(value)}
                                  label={t(`${item.label}`)}
                                  onChange={(value) => {
                                    handleChange(field.name, value);
                                  }}
                                />
                              );
                            case "select":
                              const selectOptions: SelectOption[] = getOptions(
                                values,
                                item,
                                contextData
                              );

                              return (
                                <Select
                                  id={`select-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  required={isFieldRequired}
                                  defaultValue={field.value}
                                  onChange={(event) =>
                                    handleChange(field.name, event.target.value)
                                  }
                                  fullWidth
                                  variant="standard"
                                  value={value}
                                >
                                  {selectOptions.map((option, i) => (
                                    <MenuItem
                                      key={`option-${item.label}-${i}`}
                                      value={option.value as string}
                                    >
                                      {option.label ??
                                        t(option.translationId || "")}
                                    </MenuItem>
                                  ))}
                                </Select>
                              );
                            case "multiselect":
                              const multiSelectOptions: SelectOption[] =
                                getOptions(values, item, contextData);

                              return (
                                <Select
                                  id={`multiselect-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  required={isFieldRequired}
                                  defaultValue={field.value}
                                  onChange={(event) =>
                                    handleChange(field.name, event.target.value)
                                  }
                                  fullWidth
                                  variant="standard"
                                  value={value}
                                  multiple
                                >
                                  {multiSelectOptions.map((option, i) => (
                                    <MenuItem
                                      key={`option-${item.label}-${i}`}
                                      value={option.value as string}
                                    >
                                      {option.label ??
                                        t(option.translationId || "")}
                                    </MenuItem>
                                  ))}
                                </Select>
                              );
                            case "label":
                              return (
                                <Label
                                  value={value}
                                  label={t(`${item.label}`)}
                                />
                              );
                            case "camera-configure":
                              return (
                                <CameraConfigure
                                  values={values}
                                  label={t(`${item.label}`)}
                                  addNotification={addNotification}
                                />
                              );
                            case "camera-test":
                              return (
                                <CameraTest
                                  values={values}
                                  label={t(`${item.label}`)}
                                  commonData={commonData}
                                  customizableEndpoint={customizableEndpoint}
                                  addNotification={addNotification}
                                />
                              );
                            case "eventsIn":
                              return (
                                <EventsIn
                                  ip={
                                    contextData[COMMON_DATA_FIELD]?.hpIpaddr ||
                                    ""
                                  }
                                  data={fieldsData}
                                  values={values}
                                  value={value}
                                  label={t(`${item.label}`)}
                                  onChange={(newValue: string) =>
                                    handleChange(field.name, newValue)
                                  }
                                />
                              );
                            case "sectors":
                              return (
                                <Sectors
                                  value={value}
                                  label={t(`${item.label}`)}
                                  onChange={(newValue: string) =>
                                    handleChange(field.name, newValue)
                                  }
                                />
                              );
                            case "contacts":
                              const contactsOptions: SelectOption[] =
                                getOptions(values, item, contextData);

                              return (
                                <Contacts
                                  options={contactsOptions}
                                  value={value}
                                  label={t(`${item.label}`)}
                                  onChange={(newValue: string) =>
                                    handleChange(field.name, newValue)
                                  }
                                />
                              );
                            case "set-computer-time":
                              return (
                                <SetComputerTime
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  onChange={(newValue: string) =>
                                    handleChange(field.name, newValue)
                                  }
                                />
                              );
                            case "konnex-configure":
                              return (
                                <KonnexConfigure
                                  value={value}
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  addNotification={addNotification}
                                  sx={{
                                    width: {
                                      sx: "100%",
                                      md: "50%",
                                    },
                                  }}
                                />
                              );
                            case "konnex-presence-test":
                              return (
                                <KonnexPresenceTest
                                  value={value}
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  addNotification={addNotification}
                                  customizableEndpoint={customizableEndpoint}
                                  sx={{
                                    width: {
                                      sx: "100%",
                                      md: "50%",
                                    },
                                  }}
                                />
                              );
                            case "set-pin-codes":
                              return (
                                <SetPinCodes
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  addNotification={addNotification}
                                  onChange={() => {
                                    addNotification(
                                      t("factoryCodeSet-success"),
                                      { variant: "success" }
                                    );
                                  }}
                                  customizableEndpoint={customizableEndpoint}
                                />
                              );
                            case "test-touch":
                              return (
                                <TestTouch
                                  disabled={isDisabled}
                                  label={t(`${item.label}`)}
                                  values={values}
                                  commonData={{
                                    ...fieldsData,
                                    ...contextData[COMMON_DATA_FIELD],
                                  }}
                                  customizableEndpoint={customizableEndpoint}
                                />
                              );
                            default:
                              const startAdornment = !!item.features
                                ?.withAudioIcon ? (
                                <InputAdornment position="start">
                                  <MusicNoteIcon />
                                </InputAdornment>
                              ) : undefined;

                              let enhancedLabel = t(`${item.label}`);
                              if (
                                item.dataType === "number" &&
                                item.validation?.max != null &&
                                item.validation?.min != null
                              ) {
                                const max = evaluateValidationField(
                                  item.validation?.max != null
                                    ? item.validation?.max
                                    : -1,
                                  {
                                    row: values,
                                    context: commonData,
                                  }
                                );
                                const min = evaluateValidationField(
                                  item.validation?.min != null
                                    ? item.validation?.min
                                    : -1,
                                  {
                                    row: values,
                                    context: commonData,
                                  }
                                );
                                enhancedLabel = `${enhancedLabel} [${min} - ${max}]`;
                              }

                              return (
                                <BasicInput
                                  id={`basic-input-${item.field}-${index}`}
                                  disabled={isDisabled}
                                  type={item.dataType || DEFAULT_INPUT_TYPE}
                                  required={isFieldRequired}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                  defaultValue={value}
                                  label={enhancedLabel}
                                  startAdornment={startAdornment}
                                  onChange={(event) =>
                                    submit === "confirm" &&
                                    handleChange(field.name, event.target.value)
                                  }
                                  onBlur={(event) =>
                                    submit === "blur" &&
                                    handleChange(field.name, event.target.value)
                                  }
                                />
                              );
                          }
                        }}
                        {...register(item.field)}
                      />
                      {timestamp && (
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.5)"
                        >
                          {timestamp}
                        </Typography>
                      )}

                      {errors[item.field] && (
                        <Typography color="error">
                          {errors[item.field]?.message?.toString() ||
                            DEFAULT_ND}
                        </Typography>
                      )}
                    </Grid>
                  )
                );
              })}
            </Grid>
            {footer && (
              <Box mb="auto">
                <FormFooter footer={footer} values={values} />
              </Box>
            )}
            {submit === "confirm" && (
              <Stack
                mt={5}
                spacing={2}
                direction="row"
                justifyContent="flex-end"
              >
                {onDelete && (
                  <Button
                    disabled={isSaving}
                    onClick={onDelete}
                    type="button"
                    color="error"
                    variant="text"
                  >
                    {deleteLabel ?? t("fields-delete")}
                  </Button>
                )}
                <Button
                  disabled={isSaving}
                  onClick={onDiscard}
                  type="button"
                  variant="outlined"
                >
                  {discardLabel ?? t("cancel")}
                </Button>
                <Button
                  disabled={!isDirty || isSaving}
                  onClick={executeConfirm}
                  autoFocus
                  type="button"
                  variant="contained"
                  isLoading={isSaving}
                >
                  {confirmLabel ?? t("save")}
                </Button>
              </Stack>
            )}
          </ThemeProvider>
        </form>
      </Container>
    </>
  );
}
